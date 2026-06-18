import apiClient from "./apiClient";

export const login = async (formData) => {
    const response = await apiClient.post("/auth/login", formData);
    return response.data; // returns token, email, etc.
};

export const register = async (formData) => {
    const response = await apiClient.post("/user/register", formData);
    return response.data;
};

export const logout = async () => {
    const response = await apiClient.post("/auth/logout", {});
    return response.data;
};

export const sendOtp = async () => {
    const response = await apiClient.post("/auth/send-otp");
    return response.data;
};

export const verifyEmail = async (otpString) => {
    const response = await apiClient.post("/auth/verify-email", { otp: otpString });
    return response.data;
};

export const sendResetOtp = async (email) => {
    const response = await apiClient.post(`/auth/send-reset-otp?email=${encodeURIComponent(email)}`);
    return response.data;
};

export const resetPassword = async (email, otpStr, newPassword) => {
    const response = await apiClient.post("/auth/reset-password", {
        email,
        otp: otpStr,
        newPassword,
    });
    return response.data;
};

export const isAuthenticated = async () => {
    const response = await apiClient.get("/auth/is-authenticated");
    return response.data; // returns true/false
};

export const getProfile = async () => {
    const response = await apiClient.get("/user/profile");
    return response.data;
};

export const addPasskey = async (passKey) => {
    const response = await apiClient.post("/user/add-passkey", { passKey });
    return response.data;
};
