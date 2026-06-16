import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import * as authApi from "../api/auth";
import { toast } from "react-toastify";

export const useAuth = () => {
    const { isLoggedin, setIsLoggedin, userData, setUserData, isLoading, setIsLoading, getUserdata } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginUser = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.login(formData);
            localStorage.setItem('token', data.token);
            setIsLoggedin(true);
            toast.success("Welcome back!");
            await getUserdata();
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed.";
            setError(msg);
            toast.error(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.register(formData);
            toast.success("Account created successfully. Please log in.");
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || "Registration failed.";
            setError(msg);
            toast.error(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async () => {
        setLoading(true);
        try {
            await authApi.logout();
            localStorage.removeItem('token');
            setIsLoggedin(false);
            setUserData(null);
            toast.success("Logged out successfully.");
        } catch (err) {
            const msg = err.response?.data?.message || "Logout failed.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtpCode = async (otpString) => {
        setLoading(true);
        try {
            await authApi.verifyEmail(otpString);
            toast.success("Email verified successfully!");
            await getUserdata();
        } catch (err) {
            const msg = err.response?.data?.message || "Verification failed.";
            toast.error(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const triggerResetOtp = async (email) => {
        setLoading(true);
        try {
            await authApi.sendResetOtp(email);
            toast.success("OTP sent to your email!");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to send OTP.";
            toast.error(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const completeResetPassword = async (email, otpStr, password) => {
        setLoading(true);
        try {
            await authApi.resetPassword(email, otpStr, password);
            toast.success("Password reset successfully!");
        } catch (err) {
            const msg = err.response?.data?.message || "Password reset failed.";
            toast.error(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const setPasskey = async (passkey) => {
        setLoading(true);
        try {
            await authApi.addPasskey(passkey);
            toast.success("Passkey updated successfully!");
            await getUserdata();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to set passkey.";
            toast.error(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoggedin,
        userData,
        globalLoading: isLoading,
        loading,
        error,
        loginUser,
        registerUser,
        logoutUser,
        verifyOtpCode,
        triggerResetOtp,
        completeResetPassword,
        setPasskey,
    };
};
