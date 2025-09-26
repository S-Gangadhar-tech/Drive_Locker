import React from 'react';
import {
    FiFile, FiImage, FiFileText, FiFilm, FiMusic,
} from 'react-icons/fi';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint } from 'react-icons/fa';

const FileIcon = ({ fileType }) => {
    // Default icon size and color
    const iconProps = { size: 32, className: "text-gray-400 flex-shrink-0" };

    // Return an icon based on the file's MIME type
    switch (true) {
        case fileType.startsWith('image/'):
            return <FiImage {...iconProps} />;
        case fileType.startsWith('video/'):
            return <FiFilm {...iconProps} />;
        case fileType.startsWith('audio/'):
            return <FiMusic {...iconProps} />;
        case fileType === 'application/pdf':
            return <FaFilePdf {...iconProps} />;
        case fileType.includes('wordprocessingml'): // .docx
            return <FaFileWord {...iconProps} />;
        case fileType.includes('spreadsheetml'): // .xlsx
            return <FaFileExcel {...iconProps} />;
        case fileType.includes('presentationml'): // .pptx
            return <FaFilePowerpoint {...iconProps} />;
        case fileType === 'text/plain':
            return <FiFileText {...iconProps} />;

        default:
            return <FiFile {...iconProps} />; // Generic fallback icon
    }
};

export default FileIcon;