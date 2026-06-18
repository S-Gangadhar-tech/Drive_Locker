import React, { createContext, useState } from "react";

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const value = {
        notes,
        setNotes,
        isLoading,
        setLoading,
    };

    return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};