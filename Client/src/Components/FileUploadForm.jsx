import React, { useState, useRef } from 'react';

const FileUploadForm = ({ onUpload, loading }) => {
    const [fileToUpload, setFileToUpload] = useState(null);
    const [passkey, setPasskey] = useState('');
    const fileInputRef = useRef(null);

    const passkeyRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const onFileChange = (e) => {
        setFileToUpload(e.target.files[0]);
    };

    const onPasskeyChange = (e) => {
        setPasskey(e.target.value);
    };

    const onUploadSubmit = (e) => {
        e.preventDefault();
        if (!fileToUpload || !passkey) {
            alert('Please select a file and enter a passkey.');
            return;
        }
        if (!passkeyRegex.test(passkey)) {
            alert('Passkey must be at least 8 characters and include uppercase, lowercase, number, and special character.');
            return;
        }
        onUpload(fileToUpload, passkey);
        setFileToUpload(null);
        setPasskey('');
    };

    return (
        <form onSubmit={onUploadSubmit} className="flex flex-col gap-4 bg-gray-900 p-6 rounded-lg border border-gray-700/50 max-w-md mx-auto">

            {/* Hidden native file input */}
            <input
                ref={fileInputRef}
                type="file"
                onChange={onFileChange}
                style={{ display: 'none' }}
                required
            />

            {/* Visible custom Choose File button */}
            <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
                {fileToUpload ? `File selected: ${fileToUpload.name}` : "Choose File"}
            </button>

            <input
                type="password"
                placeholder="Enter passkey (min 8 chars, incl. uppercase, number, special char)"
                value={passkey}
                onChange={onPasskeyChange}
                required
                className="rounded-md border border-gray-700 bg-gray-800 text-white p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Uploading..." : "Upload"}
            </button>
        </form>
    );
};

export default FileUploadForm;
