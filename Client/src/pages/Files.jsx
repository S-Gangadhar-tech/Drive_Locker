import React, { useState, useEffect } from 'react';
import { useFiles } from '../hooks/useFiles';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUploadCloud,
    FiTrash2,
    FiLoader,
    FiKey,
    FiCheck,
    FiDownload,
    FiExternalLink,
    FiList,
    FiGrid,
    FiMoreVertical
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import FileIcon from '../components/FileIcon';
import UploadModal from '../components/UploadModal';
import UnlockLockerForm from '../components/files/UnlockLockerForm';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";

// Helper for fetching and downloading file blobs
const downloadFileBlob = async (fileUrl, fileName) => {
    try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("File download started!");
    } catch (error) {
        console.error('Download failed:', error);
        toast.error('Failed to download the file.');
    }
};

// Revamped glass dialog for entering the passkey.
const PasskeyDialog = ({ isOpen, onUnlock, loading }) => {
    return (
        <Dialog open={isOpen}>
            <DialogContent className="glass-card border border-white/10 rounded-2xl p-8 max-w-sm text-center" showCloseButton={false}>
                <div className="inline-flex p-3.5 rounded-full bg-red-500/10 text-red-500 mb-4 border border-red-500/20 mx-auto">
                    <FiKey size={24} />
                </div>
                <DialogTitle className="text-xl font-bold text-white mb-2">Unlock Locker</DialogTitle>
                <DialogDescription className="text-sm text-gray-400 mb-6">Enter your master passkey to decrypt and access your files.</DialogDescription>
                <UnlockLockerForm onUnlock={onUnlock} loading={loading} />
            </DialogContent>
        </Dialog>
    );
};

// Reusable individual File Card component
const FileCard = ({ file, isSelected, selectMode, onFileSelect, onSingleDelete }) => {
    return (
        <motion.div
            layout
            onClick={() => selectMode ? onFileSelect(file.publicId) : window.open(file.fileUrl, '_blank', 'noopener,noreferrer')}
            className="h-full"
            whileHover={{ y: -4 }}
        >
            <Card
                className={`glass border rounded-2xl p-5 flex flex-col justify-between relative transition-all group h-full cursor-pointer ${isSelected
                    ? "border-red-500/50 bg-red-500/5 shadow-md shadow-red-500/5"
                    : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
                    }`}
            >
                {/* Checkbox (visible on hover or when selection is active) */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onFileSelect(file.publicId);
                    }}
                    className={`absolute top-4 left-4 w-5 h-5 rounded-md flex items-center justify-center border transition-all z-20 cursor-pointer ${isSelected
                        ? 'bg-red-600 border-transparent text-white opacity-100'
                        : selectMode
                            ? 'border-white/30 text-transparent opacity-100 bg-white/5'
                            : 'border-white/20 text-transparent opacity-0 group-hover:opacity-100 bg-white/5 hover:border-white/40'
                        }`}
                >
                    <FiCheck size={12} className="stroke-[3]" />
                </div>

                {/* Direct Action Buttons (only visible when not in selection mode) */}
                {!selectMode && (
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {/* View Button */}
                        <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-8 w-8 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white items-center justify-center transition-colors bg-transparent border border-transparent"
                            title="View File"
                        >
                            <FiExternalLink size={15} />
                        </a>

                        {/* Download Button */}
                        <Button
                            onClick={() => downloadFileBlob(file.fileUrl, file.fileName)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors bg-transparent hover:bg-transparent"
                            title="Download File"
                        >
                            <FiDownload size={15} />
                        </Button>

                        {/* Delete Button */}
                        <Button
                            onClick={() => onSingleDelete(file)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-600/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors bg-transparent hover:bg-transparent"
                            title="Delete File"
                        >
                            <FiTrash2 size={15} />
                        </Button>
                    </div>
                )}

                <div className="flex flex-col gap-4 mt-2">
                    {/* File Icon */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 w-fit text-gray-300">
                        <FileIcon fileType={file.fileType} />
                    </div>

                    {/* File Details */}
                    <div className="overflow-hidden pr-6">
                        <h3 className="font-semibold text-white truncate text-sm md:text-base group-hover:text-red-500 transition-colors" title={file.fileName}>
                            {file.fileName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {file.fileType.split('/')[1]?.toUpperCase() || "FILE"}
                        </p>
                    </div>
                </div>

                {/* Subtitle / Timestamp */}
                <div className="mt-4 border-t border-white/5 pt-2 text-[10px] text-gray-500">
                    Uploaded: {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'N/A'}
                </div>
            </Card>
        </motion.div>
    );
};

const Files = () => {
    const { files, loading, error, fetchUserFiles, handleFileUpload, handleDeleteFiles, checkPasskeyAndRedirect } = useFiles();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [filesToDelete, setFilesToDelete] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const selectMode = selectedFiles.length > 0;

    // Redirect to setup passkey if user doesn't have one configured
    useEffect(() => {
        checkPasskeyAndRedirect();
    }, [checkPasskeyAndRedirect]);

    // Auto-unlock lock files session if passkey exists
    useEffect(() => {
        const storedPasskey = sessionStorage.getItem('drive_locker_passkey');
        if (storedPasskey && files === null && !loading) {
            fetchUserFiles(storedPasskey);
        }
    }, [files, fetchUserFiles, loading]);

    const handleUnlockFiles = async (passkey) => {
        await fetchUserFiles(passkey);
    };

    const handleUpload = async (file, passkey) => {
        await handleFileUpload(file, passkey);
        setUploadModalOpen(false);
    };

    const handleFileSelect = (publicId) => {
        setSelectedFiles((prev) =>
            prev.includes(publicId) ? prev.filter((id) => id !== publicId) : [...prev, publicId]
        );
    };

    const handleSingleDeleteClick = (file) => {
        setFilesToDelete([file.publicId]);
        setShowConfirmDelete(true);
    };

    const handleConfirmDelete = async () => {
        if (filesToDelete.length === 0) return;
        await handleDeleteFiles(filesToDelete);
        setShowConfirmDelete(false);
        setFilesToDelete([]);
        setSelectedFiles([]);
    };

    const handleDownloadSelected = async () => {
        const selected = files.filter(f => selectedFiles.includes(f.publicId));
        toast.info(`Downloading ${selected.length} files...`);
        for (const file of selected) {
            downloadFileBlob(file.fileUrl, file.fileName);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmDelete(false);
        setFilesToDelete([]);
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            <PasskeyDialog
                isOpen={files === null}
                onUnlock={handleUnlockFiles}
                loading={loading}
            />

            {files !== null && (
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Header */}
                    <Card className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                File Locker
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">
                                Securely store and decrypt files with your private passkey.
                            </p>
                        </div>

                        <div className="flex gap-2 sm:self-center">
                            {files && files.length > 0 && (
                                <Button
                                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                    variant="outline"
                                    className="px-3 py-6 rounded-xl font-semibold border text-sm transition-all bg-white/5 border-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                                    title={viewMode === 'grid' ? "Switch to List View" : "Switch to Grid View"}
                                >
                                    {viewMode === 'grid' ? <FiList size={18} /> : <FiGrid size={18} />}
                                </Button>
                            )}
                            <Button
                                onClick={() => setUploadModalOpen(true)}
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-6 rounded-xl shadow-md shadow-red-600/10 transition-colors text-sm"
                            >
                                <FiUploadCloud size={16} /> Upload File
                            </Button>
                        </div>
                    </Card>

                    {error && <p className="text-red-500 text-center">{error}</p>}



                    {/* Files Display */}
                    {loading && !files ? (
                        <div className="flex justify-center items-center py-20">
                            <FiLoader className="animate-spin text-red-500" size={32} />
                        </div>
                    ) : files && files.length === 0 ? (
                        <Card className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl bg-white/5">
                            <p className="text-gray-400 text-base">Your locker is empty.</p>
                            <p className="text-xs text-gray-500 mt-1">Upload files to secure them inside your vault.</p>
                        </Card>
                    ) : viewMode === 'grid' ? (
                        <motion.div
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                            layout
                        >
                            <AnimatePresence>
                                {files && files.map((file) => (
                                    <FileCard
                                        key={file.publicId}
                                        file={file}
                                        selectMode={selectMode}
                                        isSelected={selectedFiles.includes(file.publicId)}
                                        onFileSelect={handleFileSelect}
                                        onSingleDelete={handleSingleDeleteClick}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        /* List / Table View Layout */
                        <motion.div
                            className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
                            layout
                        >
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-400 text-xs font-semibold uppercase tracking-wider bg-white/5">
                                        <th className="p-4 w-12 text-center">
                                            <Checkbox
                                                checked={files.length > 0 && selectedFiles.length === files.length}
                                                onCheckedChange={(checked) => {
                                                    if (checked) setSelectedFiles(files.map(f => f.publicId));
                                                    else setSelectedFiles([]);
                                                }}
                                                className="border-white/20 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                            />
                                        </th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4 w-32">Format</th>
                                        <th className="p-4 w-48">Date Uploaded</th>
                                        <th className="p-4 w-20 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {files && files.map((file) => {
                                            const fileIsSelected = selectedFiles.includes(file.publicId);
                                            return (
                                                <motion.tr
                                                    key={file.publicId}
                                                    layout
                                                    onClick={() => selectMode ? handleFileSelect(file.publicId) : window.open(file.fileUrl, '_blank', 'noopener,noreferrer')}
                                                    className={`border-b border-white/5 last:border-none transition-colors text-sm cursor-pointer ${fileIsSelected
                                                        ? "bg-red-500/5 hover:bg-red-500/10"
                                                        : "hover:bg-white/5"
                                                        }`}
                                                >
                                                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                        <Checkbox
                                                            checked={fileIsSelected}
                                                            onCheckedChange={() => handleFileSelect(file.publicId)}
                                                            className="border-white/20 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                                        />
                                                    </td>
                                                    <td className="p-4 font-semibold text-gray-200">
                                                        <div className="flex items-center gap-3">
                                                            <FileIcon fileType={file.fileType} className="text-gray-400 flex-shrink-0" />
                                                            <span className="truncate max-w-[200px] sm:max-w-md" title={file.fileName}>
                                                                {file.fileName}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-gray-400 text-xs font-medium">
                                                        {file.fileType.split('/')[1]?.toUpperCase() || "FILE"}
                                                    </td>
                                                    <td className="p-4 text-gray-400 text-xs">
                                                        {file.createdAt ? new Date(file.createdAt).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        }) : 'N/A'}
                                                    </td>
                                                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                        {!selectMode && (
                                                            <div className="flex items-center justify-center gap-1">
                                                                {/* View Button */}
                                                                <a
                                                                    href={file.fileUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex h-8 w-8 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white items-center justify-center transition-colors bg-transparent border border-transparent"
                                                                    title="View File"
                                                                >
                                                                    <FiExternalLink size={15} />
                                                                </a>

                                                                {/* Download Button */}
                                                                <Button
                                                                    onClick={() => downloadFileBlob(file.fileUrl, file.fileName)}
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors bg-transparent hover:bg-transparent"
                                                                    title="Download File"
                                                                >
                                                                    <FiDownload size={15} />
                                                                </Button>

                                                                {/* Delete Button */}
                                                                <Button
                                                                    onClick={() => handleSingleDeleteClick(file)}
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 hover:bg-red-600/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors bg-transparent hover:bg-transparent"
                                                                    title="Delete File"
                                                                >
                                                                    <FiTrash2 size={15} />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </motion.div>
                    )}

                    {/* Modals & Popups */}
                    <UploadModal
                        isOpen={isUploadModalOpen}
                        onClose={() => setUploadModalOpen(false)}
                        onUpload={handleUpload}
                        loading={loading}
                    />

                    <Dialog open={showConfirmDelete} onOpenChange={(open) => !open && handleCancelDelete()}>
                        <DialogContent className="glass-card border border-white/10 rounded-2xl p-8 max-w-sm text-center" showCloseButton={false}>
                            <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-500 mb-4 border border-red-500/20 mx-auto">
                                <FiTrash2 size={24} />
                            </div>
                            <DialogTitle className="text-gray-200 text-base font-semibold mb-2">Delete Files?</DialogTitle>
                            <DialogDescription className="text-gray-400 text-xs mb-6">
                                Are you sure you want to permanently delete <strong className="text-red-500">{filesToDelete.length}</strong> selected file(s)? This action cannot be undone.
                            </DialogDescription>
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleConfirmDelete}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                                >
                                    Delete
                                </Button>
                                <Button
                                    onClick={handleCancelDelete}
                                    variant="outline"
                                    className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </motion.div>
            )}

            {/* Premium Bottom Floating Selection Bar */}
            <AnimatePresence>
                {selectedFiles.length > 0 && files && (
                    <motion.div
                        initial={{ y: 80, x: "-50%", opacity: 0 }}
                        animate={{ y: 0, x: "-50%", opacity: 1 }}
                        exit={{ y: 80, x: "-50%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-6 left-1/2 z-50 flex items-center justify-between gap-6 px-6 py-4 rounded-2xl bg-neutral-900/90 border border-white/10 backdrop-blur-xl shadow-2xl min-w-[320px] sm:min-w-[500px]"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-white">
                                {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => {
                                    if (selectedFiles.length === files.length) {
                                        setSelectedFiles([]);
                                    } else {
                                        setSelectedFiles(files.map(f => f.publicId));
                                    }
                                }}
                                variant="outline"
                                className="px-3 py-1.5 h-auto text-xs font-semibold border bg-white/5 border-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                            >
                                {selectedFiles.length === files.length ? 'Deselect All' : 'Select All'}
                            </Button>
                            <Button
                                onClick={handleDownloadSelected}
                                className="flex items-center gap-1.5 px-4 py-2 h-auto rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white text-xs font-semibold shadow transition"
                            >
                                <FiDownload size={13} />
                                <span>Download</span>
                            </Button>
                            <Button
                                onClick={() => {
                                    setFilesToDelete(selectedFiles);
                                    setShowConfirmDelete(true);
                                }}
                                className="flex items-center gap-1.5 px-4 py-2 h-auto rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow transition"
                            >
                                <FiTrash2 size={13} />
                                <span>Delete</span>
                            </Button>
                            <Button
                                onClick={() => setSelectedFiles([])}
                                variant="ghost"
                                className="p-2 h-auto rounded-lg text-gray-400 hover:text-white bg-transparent hover:bg-transparent"
                            >
                                Cancel
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Files;