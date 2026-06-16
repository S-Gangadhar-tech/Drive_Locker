import axios from "axios";
import { AppConstants } from "../utils/constants";

const apiClient = axios.create({
    baseURL: AppConstants.BACKEND_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
