import {NextResponse} from "next/server";

export async function POST(request:Request) {
    // parsing the form
    const formData = await request.formData();
    const file = formData.get("photo")
    const meta = formData.get("metadata");

    // processing file and metadata

    // return back the analysis
    return NextResponse.json({
        patientName: "Alice Smith",
        patientId:   "PT-12345678",
        testDate:    "May 15, 2025",
        reportDate:  "May 15, 2025",
        testType:    "X‑Ray Analysis",
        testId:      "XRAY-2025051501",
        hasCancer:   true,
        confidence:  87.3,
        doctor:      "Dr. Michael Lee",
        hospital:    "Central Health Clinic",
        department:  "Radiology",
        notes:       "Findings suggest immediate biopsy. Urgent consult recommended."
    })
}