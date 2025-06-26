"use client"

import React, { useState, useRef, ChangeEvent } from 'react'
import {
    Check, AlertCircle, AlertTriangle, Calendar, User,
    Hospital, Printer, Download, Share2, Loader, Info
} from 'lucide-react'
import { FileImage } from 'lucide-react'

interface TopPrediction {
    condition: string
    probability: number
    riskLevel: string
    description: string
}

interface AllProbability {
    condition: string
    probability: number
}

interface Result {
    patientName: string
    patientId: string
    testDate: string
    reportDate: string
    testType: string
    testId: string
    primaryCondition: string
    primaryRiskLevel: string
    primaryConfidence: number
    primaryDescription: string
    topPredictions: TopPrediction[]
    allProbabilities: AllProbability[]
    medicalRecommendation: string
    doctor: string
    hospital: string
    department: string
    fileName?: string
    analysisStatus?: string
}

export default function Page() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [result, setResult] = useState<Result | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (!selected) return
        setPreviewUrl(URL.createObjectURL(selected))
        setFile(selected)
    }

    const triggerFileSelect = () => {
        inputRef.current?.click()
    }

    const sendToAPI = async () => {
        if (!file) return
        setLoading(true)
        try {
            const metadata = {
                patientName: "John Doe",
                patientId: "PT-12345",
                doctor: "Dr. Smith",
                hospital: "City Medical Center"
            }
            const form = new FormData()
            form.append("photo", file)
            form.append("metadata", JSON.stringify(metadata))

            const res = await fetch("/api/predict", {
                method: "POST",
                body: form,
            })
            if (!res.ok) {
                throw new Error(await res.text())
            }
            const data: Result = await res.json()
            setResult(data)
        } catch (err) {
            console.error("Upload error:", err)
            // you could show a toast here…
        } finally {
            setLoading(false)
        }
    }

    const getRiskLevelColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'high': return 'bg-red-100 text-red-700'
            case 'moderate': return 'bg-yellow-100 text-yellow-700'
            case 'low': return 'bg-blue-100 text-blue-700'
            case 'none': return 'bg-green-100 text-green-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getRiskIcon = (riskLevel: string) => {
        switch (riskLevel) {
            case 'high': return <AlertCircle className="text-red-600" size={24} />
            case 'moderate': return <AlertTriangle className="text-yellow-600" size={24} />
            case 'low': return <Info className="text-blue-600" size={24} />
            case 'none': return <Check className="text-green-600" size={24} />
            default: return <Info className="text-gray-600" size={24} />
        }
    }

    const formatConditionName = (condition: string) => {
        return condition
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    return (
        <div className="flex min-h-[100vh] flex-col md:flex-row gap-1">

            {/* Left: image uploader */}
            <div className="md:basis-1/2 flex flex-col gap-2 items-center w-full">
                <div className="flex items-center justify-center rounded-2xl bg-black p-2 max-w-5xl mx-auto w-full h-[25vh] md:h-[50vh] shadow-xl overflow-hidden">
                    {previewUrl
                        ? <img src={previewUrl} alt="Preview" className="h-full w-auto object-contain" />
                        : <FileImage className="text-white" size={48} />
                    }
                </div>

                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={inputRef}
                    onChange={handleFileChange}
                />

                <div className="flex md:justify-end gap-2 w-full">
                    <button className="text-sm basis-1/3 py-3 bg-black text-white rounded-md hover:opacity-90">
                        Capture
                    </button>
                    <button
                        onClick={triggerFileSelect}
                        className="text-sm basis-1/3 py-3 bg-black text-white rounded-md hover:opacity-90"
                    >
                        Upload Photo
                    </button>
                    <button
                        onClick={sendToAPI}
                        disabled={!file || loading}
                        className={`text-sm basis-1/3 py-3 rounded-md
                    ${file && !loading ? 'bg-blue-400 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}
                    flex items-center justify-center`}
                    >
                        {loading
                            ? <Loader className="animate-spin mr-2" size={16} />
                            : <span>Submit</span>
                        }
                    </button>
                </div>
            </div>

            <div className="border-1 border-slate-200" />

            {/* Right: show API result */}
            <div className="md:basis-1/2 p-4">
                {result ? (
                    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-blue-400 p-4 flex justify-between items-center">
                            <div>
                                <h1 className="text-white font-bold text-xl">Medical Analysis Report</h1>
                                <p className="text-blue-100 text-sm">{result.hospital}</p>
                            </div>
                            <Hospital className="text-white" size={24} />
                        </div>

                        {/* Primary Result Banner */}
                        <div className={`p-4 flex items-center justify-between ${getRiskLevelColor(result.primaryRiskLevel)}`}>
                            <div className="flex items-center">
                                {getRiskIcon(result.primaryRiskLevel)}
                                <div className="ml-2">
                                    <h2 className="font-bold">
                                        {formatConditionName(result.primaryCondition)}
                                    </h2>
                                    <p className="text-sm opacity-80">
                                        Confidence: {result.primaryConfidence}% | Risk: {result.primaryRiskLevel.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Patient Info */}
                        <div className="p-4 border-b">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">PATIENT INFORMATION</h3>
                            <div className="flex items-center mb-2">
                                <User className="text-gray-400 mr-2" size={16} />
                                <div>
                                    <p className="font-medium">{result.patientName}</p>
                                    <p className="text-sm text-gray-500">ID: {result.patientId}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="text-gray-400 mr-2" size={16} />
                                <p className="text-sm text-gray-600">Test Date: {result.testDate}</p>
                            </div>
                        </div>

                        {/* Test Details */}
                        <div className="p-4 border-b">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">TEST DETAILS</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-gray-500">Test Type</p>
                                    <p className="font-medium">{result.testType}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Test ID</p>
                                    <p className="font-medium">{result.testId}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Department</p>
                                    <p className="font-medium">{result.department}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Physician</p>
                                    <p className="font-medium">{result.doctor}</p>
                                </div>
                            </div>
                            {result.fileName && (
                                <div className="mt-2">
                                    <p className="text-gray-500 text-xs">File: {result.fileName}</p>
                                </div>
                            )}
                        </div>

                        {/* Primary Finding */}
                        <div className="p-4 border-b">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">PRIMARY FINDING</h3>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="font-medium text-sm mb-1">{formatConditionName(result.primaryCondition)}</p>
                                <p className="text-xs text-gray-700 mb-2">{result.primaryDescription}</p>
                                <div className="flex items-center justify-between text-xs">
                                    <span className={`px-2 py-1 rounded ${getRiskLevelColor(result.primaryRiskLevel)}`}>
                                        {result.primaryRiskLevel.toUpperCase()} RISK
                                    </span>
                                    <span className="text-gray-600">{result.primaryConfidence}% confidence</span>
                                </div>
                            </div>
                        </div>

                        {/* Top 3 Predictions */}
                        <div className="p-4 border-b">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">TOP PREDICTIONS</h3>
                            <div className="space-y-2">
                                {result.topPredictions.slice(0, 3).map((pred, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <div className="flex-1">
                                            <p className="font-medium">{formatConditionName(pred.condition)}</p>
                                            <p className="text-xs text-gray-500">{pred.riskLevel} risk</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{pred.probability}%</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Medical Recommendation */}
                        <div className="p-4 border-b">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">MEDICAL RECOMMENDATION</h3>
                            <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                                <p className="text-sm text-blue-800">{result.medicalRecommendation}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-gray-50">
                            <div className="flex justify-between mb-4">
                                <p className="text-xs text-gray-500">Generated on {result.reportDate}</p>
                                <p className="text-xs text-gray-500">REF: {result.testId}</p>
                            </div>
                            <div className="flex justify-between">
                                <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                                    <Printer size={16} className="mr-1" /> Print
                                </button>
                                <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                                    <Download size={16} className="mr-1" /> Download
                                </button>
                                <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                                    <Share2 size={16} className="mr-1" /> Share
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 p-8">
                        <FileImage className="mx-auto mb-4 text-gray-300" size={64} />
                        <p className="text-lg mb-2">No analysis result yet</p>
                        <p className="text-sm">Upload & submit a medical image to get started</p>
                    </div>
                )}
            </div>

        </div>
    )
}