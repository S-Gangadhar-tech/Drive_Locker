import { createContext, useState, useContext, useEffect } from 'react';
import FileService from "../services/FileService";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from './AppContext';
import { AppConstants } from "../Util/constants";

// Create a context
const FileContext = createContext();

export const useFiles = () => useContext(FileContext);

export const FileProvider = ({ children }) => {
    const BackendURL = AppConstants.BACKEND_URL;
    const { userData } = useContext(AppContext);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch files once when userData becomes available
    useEffect(() => {
        if (userData) {
            fetchUserFiles();
        }
    }, [userData]);

    const hasPasskey = userData ? userData.hasPasskey : null;

    const sendVerificationOtp = async () => {
        setLoading(true); // Start loading
        setError(null);
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${BackendURL}/auth/send-otp`);
            if (res.status === 200) {
                navigate("/email-verify");
                toast.success("OTP sent successfully");
            } else {
                toast.error("Unable to send OTP");
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Failed to send OTP";
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const checkPasskeyAndRedirect = () => {
        if (hasPasskey === false) {
            toast.info("Please create a passkey to use this service.");
            navigate("/CreatePasskey");
            return true;
        }
        return false;
    };

    const fetchUserFiles = async () => {
        if (checkPasskeyAndRedirect()) return;

        setLoading(true);
        setError(null);
        try {
            const data = await FileService.getUserFiles();
            setFiles(data);
        } catch (err) {
            if (err.status === 401) {
                toast.info("Please verify your email to use this service");
                await sendVerificationOtp();
            } else {
                setError(err.response?.data?.message || "Failed to fetch files");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file, passkey) => {
        if (checkPasskeyAndRedirect()) return;

        setLoading(true);
        setError(null);
        try {
            const response = await FileService.fileUpload(file, passkey);
            await fetchUserFiles();
            return response;
        } catch (err) {
            if (err.status === 401) {
                toast.info("Please verify your email to use this service");
                await sendVerificationOtp();
            } else {
                setError(err.response?.data?.message || "File upload failed");
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFiles = async (publicIds) => {
        if (checkPasskeyAndRedirect()) return;

        setLoading(true);
        setError(null);
        try {
            const response = await FileService.deleteFiles(publicIds);
            setFiles(currentFiles =>
                currentFiles.filter(file => !publicIds.includes(file.publicId))
            );
            toast.success(response.message || "Files deleted successfully.");
            return response;
        } catch (err) {
            const errorMessage = err.response?.data?.message || "File deletion failed";
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
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