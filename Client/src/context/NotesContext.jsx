import { createContext, useState, useCallback, useMemo } from "react";
import notesService from "../services/NotesService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppConstants } from "../Util/constants";

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    const BackendURL = AppConstants.BACKEND_URL;
    const [notes, setNotes] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const sendVerificationOtp = useCallback(async () => {
        setLoading(true);
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${BackendURL}/auth/send-otp`);
            if (res.status === 200) {
                navigate("/email-verify");
                toast.success("OTP sent successfully");
            } else {
                toast.error("Unable to send OTP");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    }, [BackendURL, navigate]);

    const handleGlobalApiError = useCallback(
        async (error) => {
            if (error.response?.status === 401) {
                toast.info("Please verify your email to use this service");
                await sendVerificationOtp();
            } else {
                // The API service already shows a toast, so no need to show another one here.
                console.error("A global API error occurred:", error);
            }
        },
        [sendVerificationOtp]
    );

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedNotes = await notesService.fetchNotes(BackendURL);
            setNotes(fetchedNotes);
        } catch (error) {
            await handleGlobalApiError(error);
        } finally {
            setLoading(false);
        }
    }, [BackendURL, handleGlobalApiError]);

    const createNote = useCallback(
        async (newNote) => {
            setLoading(true);
            try {
                const createdNote = await notesService.createNote(newNote);
                setNotes((prev) => [...prev, createdNote]);
            } catch (error) {
                await handleGlobalApiError(error);
            } finally {
                setLoading(false);
            }
        },
        [BackendURL, handleGlobalApiError]
    );

    const updateNote = useCallback(
        async (id, updatedData) => {
            setLoading(true);
            try {
                const updatedNote = await notesService.updateNote(id, updatedData);
                setNotes((prev) => prev.map((note) => (note.id === id ? updatedNote : note)));
            } catch (error) {
                await handleGlobalApiError(error);
            } finally {
                setLoading(false);
            }
        },
        [BackendURL, handleGlobalApiError]
    );

    const deleteNotes = useCallback(
        async (idsToDelete) => {
            setLoading(true);
            try {
                await notesService.deleteNotes(idsToDelete);
                // Update state locally for instant UI feedback instead of re-fetching
                setNotes((prev) => prev.filter((note) => !idsToDelete.includes(note.id)));
            } catch (error) {
                await handleGlobalApiError(error);
            } finally {
                setLoading(false);
            }
        },
        [BackendURL, handleGlobalApiError]
    );

    const value = useMemo(
        () => ({
            notes,
            isLoading,
            fetchNotes,
            createNote,
            updateNote,
            deleteNotes,
        }),
        [notes, isLoading, fetchNotes, createNote, updateNote, deleteNotes]
    );

    return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};