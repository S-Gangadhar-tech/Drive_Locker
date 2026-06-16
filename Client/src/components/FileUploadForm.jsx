import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FileUploadForm = ({ onUpload, loading }) => {
    const [fileToUpload, setFileToUpload] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const onFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFileToUpload(e.target.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
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

    const onUploadSubmit = (e) => {
        e.preventDefault();
        if (!fileToUpload) return;
        onUpload(fileToUpload);
        setFileToUpload(null);
    };

    return (
        <form onSubmit={onUploadSubmit} className="flex flex-col gap-5 w-full">
            {/* Hidden Shadcn Input */}
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
                        ? "border-red-500 bg-red-500/5"
                        : fileToUpload
                            ? "border-green-500/40 bg-green-500/5"
                            : "border-white/10 hover:border-white/20 bg-white/5"
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
                            className="mt-2 text-xs text-red-500 hover:text-red-400 underline font-semibold flex items-center gap-1 h-auto p-0"
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

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={loading || !fileToUpload}
                className="w-full py-6 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-red-600/10 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <span>Upload File</span>
                )}
            </Button>
        </form>
    );
};

export default FileUploadForm;

