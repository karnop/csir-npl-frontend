import { NextResponse } from "next/server";

// FastAPI server configuration
const FASTAPI_BASE_URL = "http://localhost:8000";

export async function POST(request: Request) {
    try {
        // Parse the incoming form data
        const formData = await request.formData();
        const file = formData.get("photo") as File;
        const metadata = formData.get("metadata") as string;

        // Validate that file exists
        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: "File must be an image" },
                { status: 400 }
            );
        }

        // Create FormData for FastAPI request
        const fastApiFormData = new FormData();
        fastApiFormData.append("file", file);

        // Send request to FastAPI
        const fastApiResponse = await fetch(`${FASTAPI_BASE_URL}/predict/detailed`, {
            method: "POST",
            body: fastApiFormData,
        });

        // Check if FastAPI request was successful
        if (!fastApiResponse.ok) {
            const errorText = await fastApiResponse.text();
            console.error("FastAPI Error:", errorText);
            return NextResponse.json(
                { error: "Failed to analyze image", details: errorText },
                { status: fastApiResponse.status }
            );
        }

        // Parse FastAPI response
        const predictionResult = await fastApiResponse.json();

        // Parse metadata if provided
        let parsedMetadata = {};
        if (metadata) {
            try {
                parsedMetadata = JSON.parse(metadata);
            } catch (e) {
                console.warn("Failed to parse metadata:", e);
            }
        }

        // Transform the prediction result to match your expected format
        const analysisResult = {
            // Patient information (from metadata or defaults)
            patientName: (parsedMetadata as any)?.patientName || "Unknown Patient",
            patientId: (parsedMetadata as any)?.patientId || generatePatientId(),
            testDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            reportDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            testType: "Multi-Class Medical Image Analysis",
            testId: generateTestId(),

            // Primary prediction results
            primaryCondition: predictionResult.primary_prediction.class,
            primaryRiskLevel: predictionResult.primary_prediction.risk_level,
            primaryConfidence: Math.round(predictionResult.primary_prediction.probability * 100 * 10) / 10,
            primaryDescription: predictionResult.primary_prediction.description,

            // Top 3 predictions
            topPredictions: predictionResult.top_3_predictions.map((pred: any) => ({
                condition: pred.class,
                probability: Math.round(pred.probability * 100 * 10) / 10,
                riskLevel: pred.risk_level,
                description: pred.description
            })),

            // All class probabilities
            allProbabilities: Object.entries(predictionResult.all_class_probabilities).map(([className, prob]) => ({
                condition: className,
                probability: Math.round((prob as number) * 100 * 10) / 10
            })),

            // Medical recommendation
            medicalRecommendation: predictionResult.medical_recommendation,

            // Medical information
            doctor: (parsedMetadata as any)?.doctor || "Dr. AI Assistant",
            hospital: (parsedMetadata as any)?.hospital || "Digital Health Clinic",
            department: "Gastroenterology",

            // Analysis details
            fileName: predictionResult.filename,
            analysisStatus: predictionResult.status,

            // Raw prediction data (for debugging/additional processing)
            rawPrediction: predictionResult
        };

        return NextResponse.json(analysisResult);

    } catch (error) {
        console.error("Error in API predict:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

// Helper function to generate patient ID
function generatePatientId(): string {
    const timestamp = Date.now().toString().slice(-8);
    return `PT-${timestamp}`;
}

// Helper function to generate test ID
function generateTestId(): string {
    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeString = Date.now().toString().slice(-4);
    return `MED-${dateString}${timeString}`;
}

// Optional: Health check endpoint for FastAPI connectivity
export async function GET() {
    try {
        const healthResponse = await fetch(`${FASTAPI_BASE_URL}/health`);
        const healthData = await healthResponse.json();

        return NextResponse.json({
            status: "ok",
            fastApiHealth: healthData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: "error",
                message: "Cannot connect to FastAPI service",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 503 }
        );
    }
}