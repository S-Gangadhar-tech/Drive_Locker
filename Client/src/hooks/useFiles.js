import { useContext } from 'react';
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

    const checkPasskeyAndRedirect = () => {
        if (userData && userData.hasPasskey === false) {
            toast.info("Please create a passkey to use this service.");
            navigate("/create-passkey");
            return true;
        }
        return false;
    };

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

    const handleFileUpload = async (file) => {
        if (checkPasskeyAndRedirect()) return;
        if (!sessionPasskey) {
            toast.error("Passkey not available. Please unlock your files first.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await filesApi.uploadFile(file, sessionPasskey);
            if (response && response.status === 200) {
                toast.success("File uploaded successfully!");
                await fetchUserFiles(sessionPasskey);
            } else {
                toast.error("File upload failed. Please try again.");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "File upload failed";
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
    };
};
export default useFiles;
