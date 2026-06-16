import axios from "axios";
import { toast } from "react-toastify";
import { AppConstants } from "../Util/constants";

// 1. Create a pre-configured instance of Axios
const apiClient = axios.create({
    baseURL: AppConstants.BACKEND_URL, // Set the base URL for all requests
    withCredentials: true, // IMPORTANT: This sends cookies with every request
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Use an interceptor to handle all API errors globally
apiClient.interceptors.response.use(
    // If the response is successful, just return it
    (response) => response,
    // If the response fails, handle the error
    (error) => {
        // Extract a user-friendly error message
        const message = error.response?.data?.message || "An unexpected error occurred.";

        // Show a toast notification
        toast.error(message);
        // If the user is truly unauthenticated (e.g. token expired), redirect to login.
        // We only redirect if the message is exactly "user is not authenticated" to avoid 
        // redirecting on other 401 errors like "Invalid passkey provided".
        if (error.response?.status === 401) {
            if (message === "user is not authenticated") {
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }

        // Propagate the error so that components can still use .catch() for specific actions if needed
        return Promise.reject(error);
    }
);

export default apiClient;