// src/services/authService.js
import apiClient from './apiClient';
import { toast } from "react-toastify";

// A reusable function to handle API errors, just like with the notes service
const handleApiError = (error, defaultMessage) => {
    console.error(defaultMessage, error);
    const message = error.response?.data?.message || defaultMessage;
    toast.error(message);
    return Promise.reject(error);
};

const authService = {
    isAuthenticated: async () => {
        try {
            const res = await apiClient.get(`/auth/is-authenticated`);
            return res.status === 200 && res.data === true;
        } catch (error) {
            console.error(error.response?.data?.message || "Unable to check authentication state.");
            return false;
        }
    },

    getProfile: async () => {
        try {
            const res = await apiClient.get(`/user/profile`);
            if (res.status === 200) {
                return res.data;
            } else {
                return handleApiError(res, "Unable to retrieve profile.");
            }
        } catch (error) {
            return handleApiError(error, "Error fetching user profile.");
        }
    }
};

export default authService;