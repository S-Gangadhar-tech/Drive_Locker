import React, { createContext, useState, useContext, useEffect } from 'react';
import FileService from "../services/FileService";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from './AppContext';

const FileContext = createContext();
export const useFiles = () => useContext(FileContext);

export const FileProvider = ({ children }) => {
    const { userData } = useContext(AppContext);
    const [files, setFiles] = useState(null); // Use null to signify "not yet fetched"
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionPasskey, setSessionPasskey] = useState('');
    const navigate = useNavigate();

    // On initial load, check session storage for a saved passkey
    useEffect(() => {
        const storedPasskey = sessionStorage.getItem('drive_locker_passkey');
        if (storedPasskey) {
            // If found, try to fetch files automatically
            fetchUserFiles(storedPasskey);
        }
    }, []); // Empty array ensures this runs only once on mount

    const hasPasskey = userData ? userData.hasPasskey : null;

    const checkPasskeyAndRedirect = () => {
        if (hasPasskey === false) {
            toast.info("Please create a passkey to use this service.");
            navigate("/CreatePasskey");
            return true;
        }
        return false;
    };

    const fetchUserFiles = async (passkey) => {
        if (checkPasskeyAndRedirect()) return false;

        setLoading(true);
        setError(null);
        try {
            const data = await FileService.getUserFiles(passkey);
            setFiles(data);

            // On success, save the valid passkey to state and session storage
            setSessionPasskey(passkey);
            sessionStorage.setItem('drive_locker_passkey', passkey);

            toast.success("Files unlocked successfully!");
            return true; // Return success status
        } catch (err) {
            const errorMessage = err.message || "Failed to fetch files. Invalid passkey?";
            toast.error(errorMessage);
            setError(errorMessage);
            setFiles(null); // Keep files null on failure to allow retry
            sessionStorage.removeItem('drive_locker_passkey'); // Clear invalid key
            return false; // Return failure status
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file) => {
        if (checkPasskeyAndRedirect()) return;
        if (!sessionPasskey) {
            toast.error("Passkey not available. Please unlock your files first.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await FileService.fileUpload(file, sessionPasskey);
            if (response && response.status === 200) {
                toast.success("File uploaded successfully!");
                // Automatically refresh the file list using the saved passkey
                await fetchUserFiles(sessionPasskey);
            } else {
                toast.error("File upload failed. Please try again.");
            }
        } catch (err) {
            const errorMessage = err.message || "File upload failed";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFiles = async (publicIds) => {
        if (checkPasskeyAndRedirect()) return;

        setLoading(true);
        setError(null);
        try {
            await FileService.deleteFiles(publicIds);
            // Instantly update UI by filtering out deleted files
            setFiles(currentFiles =>
                currentFiles.filter(file => !publicIds.includes(file.publicId))
            );
            toast.success("Selected files deleted successfully.");
        } catch (err) {
            const errorMessage = err.message || "File deletion failed";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        files,
        loading,
        error,
        fetchUserFiles,
        handleFileUpload,
        handleDeleteFiles,
    };

    return (
        <FileContext.Provider value={value}>
            {children}
        </FileContext.Provider>
    );
};