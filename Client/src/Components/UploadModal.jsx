import { useRef, useEffect } from 'react';
import FileUploadForm from './FileUploadForm';
import { FiX } from 'react-icons/fi';

const UploadModal = ({ isOpen, onClose, onUpload, loading }) => {
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen && fileInputRef.current) {
            fileInputRef.current.click();  // This triggers the hidden file input dialog
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg relative max-w-md w-full">
                <FileUploadForm ref={fileInputRef} onUpload={onUpload} loading={loading} />
                <button onClick={onClose} className="absolute top-2 right-2 text-white"> <FiX size={24} color='red' /></button>
            </div>
        </div>
    );
};

export default UploadModal;
