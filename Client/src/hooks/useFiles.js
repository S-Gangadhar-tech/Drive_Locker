import { useContext, useCallback } from 'react';
import { FileContext } from '../context/FileContext';
import * as filesApi from '../api/files';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export const useFiles = () => {
    const {
        files, setFiles,
        loading, setLoading,
        error, setError,
        sessionPasskey, setSessionPasskey
    } = useContext(FileContext);

    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    const checkPasskeyAndRedirect = useCallback(() => {
        if (userData && userData.hasPasskey === false) {
            toast.info("Please create a passkey to use this service.");
            navigate("/create-passkey");
            return true;
        }
        return false;
    }, [userData, navigate]);

    const fetchUserFiles = async (passkey) => {
        if (checkPasskeyAndRedirect()) return false;

        setLoading(true);
        setError(null);
        try {
            const data = await filesApi.getUserFiles(passkey);
            setFiles(data);
            setSessionPasskey(passkey);
            sessionStorage.setItem('drive_locker_passkey', passkey);
            toast.success("Files unlocked successfully!");
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to fetch files. Invalid passkey?";
            toast.error(errorMessage);
            setError(errorMessage);
            setFiles(null);
            sessionStorage.removeItem('drive_locker_passkey');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file, passkey) => {
        if (checkPasskeyAndRedirect()) return;

        // Strict guard: passkey must be a non-null, non-blank, non-whitespace string
        if (!passkey || typeof passkey !== 'string' || passkey.trim().length === 0) {
            toast.error("Passkey is required and cannot be empty.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await filesApi.uploadFile(file, passkey);
            if (response && response.status === 200) {
                toast.success("File uploaded successfully!");
                // Re-fetch files using the confirmed session passkey
                const activePasskey = sessionPasskey || passkey;
                await fetchUserFiles(activePasskey);
            } else {
                toast.error("File upload failed. Please try again.");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "File upload failed. Invalid passkey?";
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
            await filesApi.deleteFiles(publicIds);
            setFiles(currentFiles =>
                currentFiles ? currentFiles.filter(file => !publicIds.includes(file.publicId)) : []
            );
            toast.success("Selected files deleted successfully.");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "File deletion failed";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        files,
        loading,
        error,
        sessionPasskey,
        fetchUserFiles,
        handleFileUpload,
        handleDeleteFiles,
        checkPasskeyAndRedirect,
    };
};
export default useFiles;
