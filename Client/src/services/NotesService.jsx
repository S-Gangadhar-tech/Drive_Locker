import apiClient from "./apiClient"; // Import our new centralized client
import { toast } from "react-toastify";

const notesService = {
    // No more BackendURL parameter needed!
    fetchNotes: async () => {
        try {
            const response = await apiClient.get("/notes/get-notes");
            return response.data;
        } catch (error) {
            // This is a special case for business logic, so we keep the try/catch here
            if (error.response?.status === 404) {
                return []; // Return empty array if no notes are found
            }
            // All other errors are handled by the interceptor automatically
            throw error;
        }
    },

    // No more try/catch for error toasts!
    createNote: async (newNote) => {

        console.log(newNote + " creating this note");

        const response = await apiClient.post("/notes/create-notes", newNote);
        toast.success("Note created successfully! 📝");
        return response.data;
    },

    updateNote: async (id, updatedData) => {
        const noteToUpdate = { ...updatedData, id };
        const response = await apiClient.put("/notes/update-notes", noteToUpdate);
        toast.success("Note updated successfully!");
        return response.data;
    },

    deleteNotes: async (idsToDelete) => {
        const idsAsString = idsToDelete.map(String);
        await apiClient.delete("/notes/delete-notes", {
            data: idsAsString,
        });
        toast.success("Selected notes deleted successfully! ✔️");
    },
};

export default notesService;