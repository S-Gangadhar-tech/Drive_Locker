import axios from "axios";
import { toast } from "react-toastify";

const handleApiError = (error, defaultMsg) => {
    console.error(defaultMsg, error);
    const msg = error.response?.data?.message || defaultMsg;
    toast.error(msg);
    return Promise.reject(error);
};

const notesService = {
    fetchNotes: async (BackendURL) => {
        try {
            const response = await axios.get(`${BackendURL}/notes/get-notes`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                toast.info("No notes found. Create a new one!");
                return [];
            }
            return handleApiError(error, "Error fetching notes.");
        }
    },

    createNote: async (BackendURL, newNote) => {
        try {
            const response = await axios.post(
                `${BackendURL}/notes/create-notes`,
                newNote
            );
            toast.success("Note created successfully! 📝");
            return response.data;
        } catch (error) {
            return handleApiError(error, "Failed to create note.");
        }
    },

    updateNote: async (BackendURL, id, updatedData) => {
        try {
            const noteToUpdate = { ...updatedData, id };
            const response = await axios.put(
                `${BackendURL}/notes/update-notes`,
                noteToUpdate
            );
            toast.success("Note updated successfully!");
            return response.data;
        } catch (error) {
            return handleApiError(error, "Failed to update note.");
        }
    },

    deleteNotes: async (BackendURL, idsToDelete) => {
        try {
            const idsAsString = idsToDelete.map(String);
            await axios.delete(`${BackendURL}/notes/delete-notes`, {
                data: idsAsString,
            });
            toast.success("Selected notes deleted successfully! ✔️");
            return true;
        } catch (error) {
            return handleApiError(error, "Failed to delete notes.");
        }
    },
};

export default notesService;
