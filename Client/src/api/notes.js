import apiClient from "./apiClient";

export const fetchNotes = async () => {
    try {
        const response = await apiClient.get("/notes/get-notes");
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return [];
        }
        throw error;
    }
};

export const createNote = async (newNote) => {
    const response = await apiClient.post("/notes/create-notes", newNote);
    return response.data;
};

export const updateNote = async (id, updatedData) => {
    const noteToUpdate = { ...updatedData, id };
    const response = await apiClient.put("/notes/update-notes", noteToUpdate);
    return response.data;
};

export const deleteNotes = async (idsToDelete) => {
    const idsAsString = idsToDelete.map(String);
    const response = await apiClient.delete("/notes/delete-notes", {
        data: idsAsString,
    });
    return response.data;
};
