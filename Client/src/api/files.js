import apiClient from "./apiClient";

export const uploadFile = async (file, passkey) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('passkey', passkey);

    const response = await apiClient.post("/files/upload-file", formData);
    return response;
};

export const getUserFiles = async (passkey) => {
    const response = await apiClient.get("/files/get-files", {
        params: { passkey }
    });
    return response.data;
};

export const deleteFiles = async (publicIds) => {
    const response = await apiClient.delete("/files/delete-files", {
        data: publicIds,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};
