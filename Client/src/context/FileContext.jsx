import React, { createContext, useState } from 'react';

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const [files, setFiles] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionPasskey, setSessionPasskey] = useState('');

    const value = {
        files,
        setFiles,
        loading,
        setLoading,
        error,
        setError,
        sessionPasskey,
        setSessionPasskey,
    };

    return (
        <FileContext.Provider value={value}>
            {children}
        </FileContext.Provider>
    );
};