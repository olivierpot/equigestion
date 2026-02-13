"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    currentPhotoUrl?: string | null;
    horseId?: string;
    onPhotoChange: (url: string | null) => void;
}

export default function ImageUpload({ currentPhotoUrl, horseId, onPhotoChange }: ImageUploadProps) {
    const [photoUrl, setPhotoUrl] = useState<string | null>(currentPhotoUrl || null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation côté client
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (file.size > maxSize) {
            setError('Le fichier est trop volumineux (max 5MB)');
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            setError('Format non supporté (JPG, PNG, WEBP uniquement)');
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            if (horseId) {
                formData.append('horseId', horseId);
            }

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erreur lors de l\'upload');
            }

            const { url } = await response.json();
            setPhotoUrl(url);
            onPhotoChange(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
        } finally {
            setIsUploading(false);
        }
    }

    function handleRemove() {
        setPhotoUrl(null);
        onPhotoChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    return (
        <div className="space-y-4">
            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                Photo du cheval
            </label>

            <div className="flex items-start gap-4">
                {/* Preview ou placeholder */}
                <div className="relative w-32 h-32 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 flex items-center justify-center">
                    {photoUrl ? (
                        <>
                            <Image
                                src={photoUrl}
                                alt="Photo du cheval"
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <Upload className="h-8 w-8 text-slate-300" />
                    )}
                </div>

                {/* Upload button */}
                <div className="flex-1">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                        id="photo-upload"
                    />
                    <label
                        htmlFor="photo-upload"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Upload en cours...
                            </>
                        ) : (
                            <>
                                <Upload className="h-5 w-5" />
                                {photoUrl ? 'Changer la photo' : 'Ajouter une photo'}
                            </>
                        )}
                    </label>
                    <p className="text-xs text-slate-400 mt-2 ml-1">
                        JPG, PNG ou WEBP • Max 5MB
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-bold">
                    {error}
                </div>
            )}
        </div>
    );
}
