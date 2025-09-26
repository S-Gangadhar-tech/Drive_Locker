import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiDownloadCloud } from "react-icons/fi";
import FileIcon from './FileIcon'; // <-- 1. Import the new component

const FileListItem = ({ file, isSelected, onFileSelect, selectMode }) => {
    // ... (Your handleDownload function remains the same)
    console.log(file);

    const handleDownload = async () => {
        try {
            // Fetch the file data as a blob
            const response = await fetch(file.fileUrl);
            const blob = await response.blob();

            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(new Blob([blob]));

            // Create a hidden anchor tag to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.fileName);
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Clean up: remove the link and revoke the URL
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download the file.');
        }
    };

    return (
        <motion.li
            layout
            // ... (Your animation props)
            className={`flex items-center gap-4 px-4 py-3 border-b border-gray-700 last:border-none transition-colors duration-200 ${isSelected ? 'bg-red-900/40' : 'hover:bg-gray-800/60'}`}
        >
            {/* Show checkbox only in select mode */}
            {selectMode && (
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onFileSelect(file.publicId)}
                    className="h-5 w-5 text-red-600 bg-gray-800 rounded border-gray-700 focus:ring-red-500 cursor-pointer"
                />
            )}

            {/* 2. Add the FileIcon component here */}
            <FileIcon fileType={file.fileType} />

            <div className="flex flex-col flex-grow overflow-hidden">
                <p className="truncate font-semibold text-gray-100">{file.fileName}</p>
                <div className="flex items-center space-x-4 mt-1 text-sm">
                    <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-red-500 hover:underline">
                        <FiExternalLink /> View
                    </a>
                    <button onClick={handleDownload} className="flex items-center gap-1 text-red-500 hover:underline">
                        <FiDownloadCloud /> Download
                    </button>
                </div>
            </div>
        </motion.li>
    );
};

export default FileListItem;