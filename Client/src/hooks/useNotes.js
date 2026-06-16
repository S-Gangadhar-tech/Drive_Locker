import { useContext, useCallback } from "react";
import { NotesContext } from "../context/NotesContext";
import * as notesApi from "../api/notes";
import * as authApi from "../api/auth";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useNotes = () => {
    const { notes, setNotes, isLoading, setLoading } = useContext(NotesContext);
    const { setIsLoggedin } = useContext(AppContext);
    const navigate = useNavigate();

    const sendVerificationOtp = useCallback(async () => {
        setLoading(true);
        try {
            await authApi.sendOtp();
            navigate("/email-verify");
            toast.success("OTP sent successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    }, [navigate, setLoading]);

    const handleGlobalApiError = useCallback(
        async (error) => {
            if (error.response?.status === 401) {
                const msg = error.response?.data?.message || "";
                if (msg.includes("verify your account")) {
                    toast.info("Please verify your email to use this service");
                    await sendVerificationOtp();
                } else {
                    setIsLoggedin(false);
                    navigate("/login");
                }
            } else {
                console.error("A global API error occurred:", error);
            }
        },
        [sendVerificationOtp, setIsLoggedin, navigate]
    );

    const getNotesList = useCallback(async () => {
        setLoading(true);
        try {
            const fetched = await notesApi.fetchNotes();
            setNotes(fetched);
        } catch (error) {
            await handleGlobalApiError(error);
        } finally {
            setLoading(false);
        }
    }, [setNotes, handleGlobalApiError, setLoading]);

    const createNoteItem = useCallback(
        async (newNote) => {
            setLoading(true);
            try {
                const created = await notesApi.createNote(newNote);
                setNotes((prev) => [...prev, created]);
                toast.success("Note created successfully!");
            } catch (error) {
                await handleGlobalApiError(error);
            } finally {
                setLoading(false);
            }
        },
        [setNotes, handleGlobalApiError, setLoading]
    );

    const updateNoteItem = useCallback(
        async (id, updatedData) => {
            setLoading(true);
            try {
                const updated = await notesApi.updateNote(id, updatedData);
                setNotes((prev) => prev.map((note) => (note.id === id ? updated : note)));
                toast.success("Note updated successfully!");
            } catch (error) {
                await handleGlobalApiError(error);
            } finally {
                setLoading(false);
            }
        },
        [setNotes, handleGlobalApiError, setLoading]
    );

    const deleteNotesItems = useCallback(
        async (idsToDelete) => {
            setLoading(true);
            try {
                await notesApi.deleteNotes(idsToDelete);
                setNotes((prev) => prev.filter((note) => !idsToDelete.includes(note.id)));
                toast.success("Selected notes deleted successfully!");
            } catch (error) {
                await handleGlobalApiError(error);
            } finally {
                setLoading(false);
            }
        },
        [setNotes, handleGlobalApiError, setLoading]
    );

    return {
        notes,
        loading: isLoading,
        fetchNotes: getNotesList,
        createNote: createNoteItem,
        updateNote: updateNoteItem,
        deleteNotes: deleteNotesItems,
    };
};

export default useNotes;
