import axios from "axios";
import { AppConstants } from "../utils/constants";

const apiClient = axios.create({
    baseURL: AppConstants.BACKEND_URL,
    withCredentials: true,
});

// ── Request: attach JWT from localStorage ──────────────────────────────────
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ── Response: normalize all server error shapes into a consistent message ──
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const data = error.response.data;

            // Prefer the structured { message } field from our ErrorResponse DTO
            // Fallback chain: data.message → data.error → HTTP status text → generic
            const message =
                data?.message ||
                data?.error ||
                error.response.statusText ||
                `Request failed with status ${error.response.status}`;

            // Normalize: always place a clean message at data.message
            error.response.data = { ...data, message };
        } else if (error.request) {
            // Request was made but no response received (network error, server down)
            error.response = {
                data: { message: "Unable to reach the server. Please check your connection." },
                status: 0,
            };
        } else {
            // Something went wrong setting up the request
            error.response = {
                data: { message: error.message || "An unexpected error occurred." },
                status: 0,
            };
        }
        return Promise.reject(error);
    }
);

export default apiClient;
