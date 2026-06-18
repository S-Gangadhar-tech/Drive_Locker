import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FiUploadCloud, FiFile, FiX, FiKey, FiShield } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * FileUploadForm
 * Requires the user to select a file AND confirm their passkey
 * before uploading. The passkey is validated server-side during
 * the upload request — this ensures an extra security confirmation
 * for every file stored in the locker.
 */
const FileUploadForm = ({ onUpload, loading }) => {
    const [fileToUpload, setFileToUpload] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFileToUpload(e.target.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave') {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFileToUpload(e.dataTransfer.files[0]);
        }
    };

    const onUploadSubmit = (data) => {
        if (!fileToUpload) return;
        onUpload(fileToUpload, data.passkey);
        setFileToUpload(null);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onUploadSubmit)} className="flex flex-col gap-5 w-full">
            {/* Hidden file input */}
            <Input
                ref={fileInputRef}
                type="file"
                onChange={onFileChange}
                className="hidden"
            />

            {/* Drag & Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${isDragActive
                    ? 'border-red-500 bg-red-500/5'
                    : fileToUpload
                        ? 'border-green-500/40 bg-green-500/5'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
            >
                {fileToUpload ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-3 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                            <FiFile size={28} />
                        </div>
                        <span className="text-sm font-semibold text-gray-200 truncate max-w-[240px]">
                            {fileToUpload.name}
                        </span>
                        <span className="text-xs text-gray-400">
                            {(fileToUpload.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <Button
                            type="button"
                            variant="link"
                            onClick={(e) => {
                                e.stopPropagation();
                                setFileToUpload(null);
                            }}
                            className="mt-1 text-xs text-red-500 hover:text-red-400 underline font-semibold flex items-center gap-1 h-auto p-0"
                        >
                            <FiX /> Remove file
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="p-3 rounded-full bg-white/5 text-gray-400 border border-white/5">
                            <FiUploadCloud size={28} />
                        </div>
                        <span className="text-sm font-semibold text-gray-200">
                            Click or drag file to upload
                        </span>
                        <span className="text-xs text-gray-500">
                            Any documents, images, or media files
                        </span>
                    </div>
                )}
            </div>

            {/* Passkey Confirmation */}
            <div className="space-y-1.5">
                <Label htmlFor="upload-passkey" className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                    <FiShield size={12} className="text-red-500" />
                    Confirm Passkey to Secure Upload
                </Label>
                <div className="relative flex items-center">
                    <FiKey className="absolute left-3.5 text-gray-400 z-10" size={16} />
                    <Input
                        id="upload-passkey"
                        type="password"
                        {...register('passkey', {
                            required: 'Passkey is required to upload.',
                            minLength: {
                                value: 8,
                                message: 'Passkey must be at least 8 characters.',
                            },
                            validate: (v) =>
                                v.trim().length > 0 || 'Passkey cannot be blank or whitespace only.',
                        })}
                        placeholder="Enter your passkey"
                        className="w-full pl-10 pr-4 py-5 rounded-lg text-sm text-white glass-input outline-none transition-all"
                        autoComplete="current-password"
                    />
                </div>
                {errors.passkey && (
                    <p className="text-xs text-red-500 font-semibold">{errors.passkey.message}</p>
                )}
                <p className="text-[10px] text-gray-500 leading-relaxed">
                    Your passkey is verified server-side before the file is stored in your locker.
                </p>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={loading || !fileToUpload}
                className="w-full py-6 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-red-600/10 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <FiUploadCloud size={15} />
                        <span>Verify & Upload</span>
                    </>
                )}
            </Button>
        </form>
    );
};

export default FileUploadForm;
