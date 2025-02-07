"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react";

export default function ProductUpload({ onSuccess }: { onSuccess: (response: any) => void }) {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const onError = (event: React.SyntheticEvent<HTMLInputElement, Event>) => {
        setError('An error occurred while uploading the file');
        setUploading(false);
    }
    const handleSuccess = (response: any) => {
        setUploading(false);
        setError(null)
        onSuccess(response);
    }
    const handleStartUpload = () => {
        setUploading(true);
        setError(null);
    }
    const handleFileUpload = async (file: File) => {
        const newFile = new File([file], "product-image.jpg", {
            type: file.type,
        });
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        // Validate file type
        if (!validTypes.includes(file.type)) {
            setError("Please upload a valid image file (JPEG, PNG, or WebP)");
            return;
        }
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("file", file);

            // Replace with your upload endpoint
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload file");
            }

            const data = await response.json();
            handleSuccess(data)
        } catch (err: any) {
            setError(err.message || "An error occurred during upload");
        } finally {
            setUploading(false);
        }
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleStartUpload()
        const file = event.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };



    return (
        <div className="space-y-2">
            <input
                type="file"
                onError={onError}
                // onSuccess={handleSuccess}
                // onUploadStart={handleStartUpload}
                onChange={handleInputChange}
                className="file-input file-input-bordered w-full"
            />

            {uploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                </div>
            )}

            {error && <div className="text-error text-sm">{error}</div>}
        </div>
    )
}
