import { useContext, useState, useEffect } from "react";
import { NotesContext } from "../context/NotesContext";
import Note from "../Components/NoteListItem";
import CustomButton from "../Util/Button";
import NoteUtil from "../Util/NoteUtil";

// RENAMED from NotesService to NotesPage for clarity
const NotesPage = () => {
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [selectedNoteIds, setSelectedNoteIds] = useState([]);
    const [selectMode, setSelectMode] = useState(false);

    const { notes, isLoading, deleteNotes, fetchNotes } = useContext(NotesContext);

    // ✅ CRITICAL FIX: This now runs only ONCE on component mount, stopping the infinite loop.
    useEffect(() => {
        const loadNotes = async () => {
            await fetchNotes();
        };
        loadNotes();
    }, [fetchNotes]); // Depends on the stable fetchNotes function

    const handleCreateClick = () => {
        setEditingNote(null);
        setShowNoteForm(true);
    };

    const handleUpdateClick = (note) => {
        setEditingNote(note);
        setShowNoteForm(true);
    };

    const handleFormClose = () => {
        setShowNoteForm(false);
        setEditingNote(null);
    };

    const handleDeleteSelected = async () => {
        if (selectedNoteIds.length > 0) {
            await deleteNotes(selectedNoteIds);
            setSelectedNoteIds([]);
            setSelectMode(false);
        }
    };

    const handleNoteSelect = (id) => {
        setSelectedNoteIds((prev) =>
            prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
        );
    };

    const toggleSelectMode = () => {
        if (selectMode) setSelectedNoteIds([]);
        setSelectMode(!selectMode);
    };

    const primaryStyles = "px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold shadow-lg transition-all duration-300 ease-in-out text-base";
    const secondaryStyles = "px-6 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 font-semibold shadow-lg transition-all duration-300 ease-in-out text-base";
    const deleteStyles = "px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold shadow-lg transition-all duration-300 ease-in-out text-base disabled:bg-red-800 disabled:opacity-70 disabled:cursor-not-allowed";

    if (isLoading && notes.length === 0) {
        return <p className="text-center text-gray-400">Loading notes...</p>;
    }

    return (
        <div className="bg-gray-950/80 backdrop-blur-md rounded-2xl border border-gray-800 p-8 max-w-4xl mx-auto min-h-[30vh] text-gray-200">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-200 border-b-2 border-red-600/50 pb-3">
                Your Notes
            </h1>

            <div className="space-y-4 mb-8">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <Note
                            key={note.id}
                            ele={note}
                            onUpdateClick={() => handleUpdateClick(note)}
                            onSelectChange={() => handleNoteSelect(note.id)}
                            isSelected={selectedNoteIds.includes(note.id)}
                            select={selectMode}
                        />
                    ))
                ) : (
                    <p className="text-gray-400 text-center py-10 text-lg">
                        No notes found. Click "Create New Note" to get started!
                    </p>
                )}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
                <CustomButton text="Create New Note" handleOnclick={handleCreateClick} className={primaryStyles} />

                {selectMode && (
                    <CustomButton
                        text={`Delete Selected (${selectedNoteIds.length})`}
                        handleOnclick={handleDeleteSelected}
                        disabled={selectedNoteIds.length === 0}
                        className={deleteStyles}
                    />
                )}

                {notes.length > 0 && (
                    <CustomButton
                        text={selectMode ? "Cancel Selection" : "Select Notes"}
                        handleOnclick={toggleSelectMode}
                        className={secondaryStyles}
                    />
                )}
            </div>

            {showNoteForm && <NoteUtil note={editingNote} onClose={handleFormClose} />}
        </div>
    );
};

export default NotesPage;