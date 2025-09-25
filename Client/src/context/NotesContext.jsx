import { createContext, useState, useCallback, useMemo } from "react";
import notesService from "../services/NotesService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppConstants } from "../Util/constants";

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    console.log("NotesProvider rendered");
    const BackendURL = AppConstants.BACKEND_URL;
    const [notes, setNotes] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const sendVerificationOtp = useCallback(async () => {
        try {
            console.log("sendVerificationOtp function recreated");
            setLoading(true);
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
            console.log("handleGlobalApiError function recreated");
            if (error.response?.status === 401) {
                toast.info("Please verify your email to use this service");
                await sendVerificationOtp();
            } else {
                toast.error(error.response?.data?.message || "An error occurred");
            }
        },
        [sendVerificationOtp]
    );

    const fetchNotes = useCallback(async () => {
        try {
            console.log("fetchNotes function recreated");
            setLoading(true);
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
            try {
                console.log("createNote function recreated");
                setLoading(true);
                const createdNote = await notesService.createNote(BackendURL, newNote);
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
            try {
                console.log("updateNote function recreated");

                setLoading(true);
                const updatedNote = await notesService.updateNote(
                    BackendURL,
                    id,
                    updatedData
                );
                setNotes((prev) =>
                    prev.map((note) => (note.id === id ? updatedNote : note))
                );
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
            try {
                console.log("deleteNote function recreated");
                setLoading(true);
                await notesService.deleteNotes(BackendURL, idsToDelete);
                await fetchNotes();
            } catch (error) {
                await handleGlobalApiError(error);
            } finally {
                setLoading(false);
            }
        },
        [BackendURL, fetchNotes, handleGlobalApiError]
    );

    const value = useMemo(
        () => ({
            notes,
            isLoading,
            setLoading,
            fetchNotes,
            createNote,
            updateNote,
            deleteNotes,
        }),
        [notes, isLoading, fetchNotes, createNote, updateNote, deleteNotes]
    );

    return (
        <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
    );
};
