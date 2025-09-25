import React, { useState } from 'react';
import { useFiles } from '../context/FileContext';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiTrash2, FiLoader, FiKey } from 'react-icons/fi';
import { toast } from 'react-toastify';
import FileListItem from '../Components/FileListItem';
import UploadModal from '../Components/UploadModal';

// A modal dialog component for entering the passkey.
const PasskeyDialog = ({ isOpen, onUnlock, loading }) => {
    const [passkey, setPasskey] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!passkey) {
            toast.warn("Please enter your passkey.");
            return;
        }
        onUnlock(passkey);
    };

    if (!isOpen) return null;

    return (
        <>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-75 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            />
            <motion.div
                className="fixed top-1/2 left-1/2 z-[51] -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-xl shadow-lg p-8 text-center border border-gray-700/50 w-full max-w-sm"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                <FiKey className="mx-auto text-red-500 mb-4" size={40} />
                <h2 className="text-2xl font-bold text-gray-200 mb-3">Unlock Your Files</h2>
                <p className="text-gray-400 mb-6">Enter your passkey to view your encrypted files.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="password"
                        value={passkey}
                        onChange={(e) => setPasskey(e.target.value)}
                        placeholder="Your Secret Passkey"
                        className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition-colors">
                        {loading ? <FiLoader className="animate-spin mx-auto" /> : 'Unlock'}
                    </button>
                </form>
            </motion.div>
        </>
    );
};


const Files = () => {
    const { files, loading, error, fetchUserFiles, handleFileUpload, handleDeleteFiles } = useFiles();

    // Local UI State for file management
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [selectMode, setSelectMode] = useState(false);

    // This function is passed to the dialog.
    const handleUnlockFiles = async (passkey) => {
        await fetchUserFiles(passkey);
    };

    // The upload handler no longer needs a passkey.
    const handleUpload = async (file) => {
        await handleFileUpload(file);
        setUploadModalOpen(false);
    };

    // Other handlers
    const toggleSelectMode = () => { if (selectMode) setSelectedFiles([]); setSelectMode(!selectMode); };
    const handleFileSelect = (publicId) => { setSelectedFiles((prev) => prev.includes(publicId) ? prev.filter((id) => id !== publicId) : [...prev, publicId]); };
    const handleSelectAllChange = (e) => { if (e.target.checked) setSelectedFiles(files.map((file) => file.publicId)); else setSelectedFiles([]); };
    const onDeleteSelected = () => { if (selectedFiles.length > 0) setShowConfirmDelete(true); };
    const handleConfirmDelete = async () => {
        if (selectedFiles.length === 0) return;
        await handleDeleteFiles(selectedFiles);
        setShowConfirmDelete(false);
        setSelectedFiles([]);
        setSelectMode(false);
    };
    const handleCancelDelete = () => setShowConfirmDelete(false);

    return (
        <>
            <PasskeyDialog
                isOpen={files === null}
                onUnlock={handleUnlockFiles}
                loading={loading}
            />

            <motion.div
                className="bg-gray-950/80 shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-4xl mx-auto border border-gray-800 backdrop-blur-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-3xl font-extrabold text-gray-200 border-b-2 border-red-600/50 pb-2 w-full sm:w-auto">
                        Your Files 📂
                    </h1>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <motion.button onClick={() => setUploadModalOpen(true)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-colors duration-200 flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <FiUploadCloud size={18} /> Upload
                        </motion.button>
                        {files && files.length > 0 && (
                            <motion.button onClick={toggleSelectMode} className={`bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-colors duration-200 flex-1 ${selectMode ? 'bg-gray-600' : ''}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                {selectMode ? 'Cancel' : 'Select'}
                            </motion.button>
                        )}
                    </div>
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <hr className="border-gray-800 mb-4" />

                {/* Selection Header */}
                {selectMode && files && files.length > 0 && (
                    <div className="flex items-center justify-between mb-4 p-2 bg-gray-900 rounded-md">
                        <label className="inline-flex items-center gap-2 text-gray-200 cursor-pointer">
                            <input type="checkbox" onChange={handleSelectAllChange} checked={selectedFiles.length === files.length && files.length > 0} className="h-5 w-5 text-red-600 bg-gray-800 rounded border-gray-700 focus:ring-red-500 cursor-pointer" />
                            Select All
                        </label>
                        <button disabled={selectedFiles.length === 0} onClick={onDeleteSelected} className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 text-white font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700">
                            <FiTrash2 /> Delete ({selectedFiles.length})
                        </button>
                    </div>
                )}

                {/* File List */}
                {loading && !files ? (
                    <div className="flex justify-center items-center py-10"><FiLoader className="animate-spin text-red-500" size={40} /></div>
                ) : files && files.length === 0 ? (
                    <p className="text-gray-400 text-center py-10 text-lg">You have no files. Upload one to get started!</p>
                ) : files && (
                    <ul className="list-none p-0 max-h-[45vh] overflow-y-auto">
                        {files.map((file) => (
                            <FileListItem key={file.publicId} file={file} selectMode={selectMode} isSelected={selectedFiles.includes(file.publicId)} onFileSelect={handleFileSelect} />
                        ))}
                    </ul>
                )}

                {/* Modals */}
                <UploadModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} onUpload={handleUpload} />
                {showConfirmDelete && (
                    <>
                        <motion.div className="fixed inset-0 bg-black bg-opacity-70 z-50" onClick={handleCancelDelete} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
                        <motion.div className="fixed top-1/2 left-1/2 z-[51] -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-xl shadow-lg p-8 text-center border border-gray-700/50 min-w-[300px]" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <FiTrash2 className="mx-auto mb-4 text-red-500" size={40} />
                            <p className="text-gray-200 mb-6">Are you sure you want to delete <span className="font-bold text-red-400">{selectedFiles.length}</span> file(s)?</p>
                            <div className="flex justify-center gap-4">
                                <motion.button onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Yes, delete</motion.button>
                                <motion.button onClick={handleCancelDelete} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>No, cancel</motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </motion.div>
        </>
    );
};

export default Files;