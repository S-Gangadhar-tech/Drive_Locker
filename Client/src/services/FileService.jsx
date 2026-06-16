// src/services/FileService.jsx
import apiClient from './apiClient';

const fileUpload = async (file, passkey) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('passkey', passkey);

        const response = await apiClient.post(`/files/upload-file`, formData);
        return response; // The success message
    } catch (error) {
        throw error.response?.data || { message: 'An error occurred during file upload.' };
    }
};

const getUserFiles = async (passkey) => {
    try {
        // Pass the passkey as a query parameter in the GET request
        const response = await apiClient.get(`/files/get-files`, {
            params: { passkey }
        });
        return response.data; // List of files
    } catch (error) {
        // Re-throw the specific error message from the backend
        throw error.response?.data || { message: 'Failed to retrieve user files.' };
    }
};

const deleteFiles = async (publicIds) => {
    try {
        const response = await apiClient.delete(`/files/delete-files`, {
            data: publicIds, // Axios sends request body for DELETE requests via the 'data' key
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // The success message
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete files.' };
    }
};

const FileService = {
    fileUpload,
    getUserFiles,
    deleteFiles,
};

export default FileService;