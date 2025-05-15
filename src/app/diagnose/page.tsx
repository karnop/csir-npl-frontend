"use client"

import React, { useState, useRef, ChangeEvent } from 'react'
import {
    Check, AlertCircle, Calendar, User,
    Hospital, Printer, Download, Share2
} from 'lucide-react'
import { FileImage } from 'lucide-react'

interface Result {
    patientName: string
    patientId:   string
    testDate:    string
    reportDate:  string
    testType:    string
    testId:      string
    hasCancer:   boolean
    confidence:  number
    doctor:      string
    hospital:    string
    department:  string
    notes:       string
}

export default function Page() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [file, setFile]           = useState<File | null>(null)
    const [result, setResult]       = useState<Result | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

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
        // (optional) you could pass an existing "result" object too
        const metadata = {
            foo: 123,     // or pull from some state
            bar: "xyz"
        }

        const form = new FormData()
        form.append('photo', file)
        form.append('metadata', JSON.stringify(metadata))

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: form
        })

        if (!res.ok) {
            console.error('Upload error', await res.text())
            return
        }
        const data: Result = await res.json()
        setResult(data)
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
                        disabled={!file}
                        className={`text-sm basis-1/3 py-3 bg-blue-400 text-black font-bold rounded-md hover:opacity-90
                        ${file ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    >
                        Submit
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
                                <h1 className="text-white font-bold text-xl">Medical Screening Receipt</h1>
                                <p className="text-blue-100 text-sm">{result.hospital}</p>
                            </div>
                            <Hospital className="text-white" size={24} />
                        </div>

                        {/* Banner */}
                        <div className={`p-4 flex items-center justify-between
                             ${result.hasCancer ? 'bg-red-100' : 'bg-green-100'}`}>
                            <div className="flex items-center">
                                {result.hasCancer
                                    ? <AlertCircle className="text-red-600 mr-2" size={24} />
                                    : <Check className="text-green-600 mr-2" size={24} />
                                }
                                <div>
                                    <h2 className={`font-bold ${result.hasCancer ? 'text-red-700' : 'text-green-700'}`}>
                                        {result.hasCancer ? 'Abnormality Detected' : 'No Abnormality Detected'}
                                    </h2>
                                    <p className="text-sm text-gray-600">Confidence: {result.confidence}%</p>
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
                        </div>

                        {/* Notes */}
                        <div className="p-4 border-b">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">NOTES</h3>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-700">{result.notes}</p>
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
                    <p className="text-center text-gray-500">No result yet. Upload & submit a photo.</p>
                )}
            </div>

        </div>
    )
}
