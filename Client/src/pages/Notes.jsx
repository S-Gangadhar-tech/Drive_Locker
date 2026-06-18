import { useState, useEffect } from "react";
import { useNotes } from "../hooks/useNotes";
import Note from "../components/NoteListItem";
import NoteForm from "../components/notes/NoteForm";
import { FiSearch, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";

const NotesPage = () => {
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [selectedNoteIds, setSelectedNoteIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const selectMode = selectedNoteIds.length > 0;
    
    // Unified Delete Confirmation State
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [notesToDelete, setNotesToDelete] = useState([]);

    const { notes, loading, deleteNotes, fetchNotes, createNote, updateNote } = useNotes();

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

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

    const handleFormSubmit = async (data) => {
        if (editingNote) {
            await updateNote(editingNote.id, data);
        } else {
            await createNote(data);
        }
        handleFormClose();
    };

    const handleSingleDeleteClick = (note) => {
        setNotesToDelete([note.id]);
        setShowConfirmDelete(true);
    };

    const onDeleteSelected = () => {
        if (selectedNoteIds.length > 0) {
            setNotesToDelete(selectedNoteIds);
            setShowConfirmDelete(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (notesToDelete.length === 0) return;
        await deleteNotes(notesToDelete);
        setShowConfirmDelete(false);
        setNotesToDelete([]);
        setSelectedNoteIds([]);
    };

    const handleCancelDelete = () => {
        setShowConfirmDelete(false);
        setNotesToDelete([]);
    };

    const handleToggleFavourite = async (note) => {
        await updateNote(note.id, {
            title: note.title,
            notes: note.notes,
            isFavourate: !note.isFavourate
        });
    };

    const handleNoteSelect = (id) => {
        setSelectedNoteIds((prev) =>
            prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
        );
    };



    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.notes.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pinnedNotes = filteredNotes.filter((note) => note.isFavourate);
    const regularNotes = filteredNotes.filter((note) => !note.isFavourate);

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            {/* Header section with Actions */}
            <Card className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                <div>
                    <h1 className="text-2xl font-bold text-white">Your Notes</h1>
                    <p className="text-sm text-gray-400 mt-1">Keep track of your thoughts, ideas, and passwords safely.</p>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={handleCreateClick}
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-6 rounded-xl shadow-md shadow-red-600/10 transition-colors text-sm"
                    >
                        <FiPlus size={16} /> Create Note
                    </Button>
                </div>
            </Card>

            {/* Search Bar */}
            <div className="flex gap-4 items-center justify-between">
                <div className="relative flex items-center w-full sm:max-w-md">
                    <FiSearch className="absolute left-3.5 text-gray-500 z-10" size={18} />
                    <Input
                        type="text"
                        placeholder="Search notes by title or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-6 rounded-xl text-sm text-white glass-input outline-none transition-all"
                    />
                </div>
            </div>

            {/* Loading Indicator */}
            {loading && notes.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filteredNotes.length === 0 ? (
                <Card className="text-center py-20 border border-dashed border-white/5 rounded-2xl bg-white/5">
                    <p className="text-gray-400">No notes found.</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {searchQuery ? "Try searching for another keyword" : "Click 'Create Note' to start writing"}
                    </p>
                </Card>
            ) : (
                <div className="space-y-8">
                    {/* Pinned Notes Section */}
                    {pinnedNotes.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pl-1">Pinned Notes</h3>
                            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" layout>
                                <AnimatePresence>
                                    {pinnedNotes.map((note) => (
                                        <Note
                                            key={note.id}
                                            ele={note}
                                            onUpdateClick={() => handleUpdateClick(note)}
                                            onSelectChange={() => handleNoteSelect(note.id)}
                                            isSelected={selectedNoteIds.includes(note.id)}
                                            select={selectMode}
                                            onDeleteClick={handleSingleDeleteClick}
                                            onToggleFavourite={() => handleToggleFavourite(note)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    )}

                    {/* Regular Notes Section */}
                    {regularNotes.length > 0 && (
                        <div className="space-y-3">
                            {pinnedNotes.length > 0 && (
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pl-1">Other Notes</h3>
                            )}
                            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" layout>
                                <AnimatePresence>
                                    {regularNotes.map((note) => (
                                        <Note
                                            key={note.id}
                                            ele={note}
                                            onUpdateClick={() => handleUpdateClick(note)}
                                            onSelectChange={() => handleNoteSelect(note.id)}
                                            isSelected={selectedNoteIds.includes(note.id)}
                                            select={selectMode}
                                            onDeleteClick={handleSingleDeleteClick}
                                            onToggleFavourite={() => handleToggleFavourite(note)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    )}
                </div>
            )}

            {/* Note Creation / Editing Modal */}
            <Dialog open={showNoteForm} onOpenChange={(open) => !open && handleFormClose()}>
                <DialogContent className="glass-card border border-white/10 rounded-2xl p-6 md:p-8 max-w-md">
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-xl font-bold text-white">
                            {editingNote ? "Update Note" : "Create New Note"}
                        </DialogTitle>
                    </DialogHeader>
                    <NoteForm
                        note={editingNote}
                        onSubmit={handleFormSubmit}
                        onClose={handleFormClose}
                    />
                </DialogContent>
            </Dialog>

            {/* Unified Delete Confirmation Dialog */}
            <Dialog open={showConfirmDelete} onOpenChange={(open) => !open && handleCancelDelete()}>
                <DialogContent className="glass-card border border-white/10 rounded-2xl p-8 max-w-sm text-center" showCloseButton={false}>
                    <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-500 mb-4 border border-red-500/20 mx-auto">
                        <FiTrash2 size={24} />
                    </div>
                    <DialogTitle className="text-gray-200 text-base font-semibold mb-2">Delete Notes?</DialogTitle>
                    <DialogDescription className="text-gray-400 text-xs mb-6">
                        Are you sure you want to permanently delete <strong className="text-red-500">{notesToDelete.length}</strong> selected note(s)? This action cannot be undone.
                    </DialogDescription>
                    <div className="flex gap-3">
                        <Button 
                            onClick={handleConfirmDelete} 
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                        >
                            Delete
                        </Button>
                        <Button 
                            onClick={handleCancelDelete} 
                            variant="outline"
                            className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Premium Bottom Floating Selection Bar */}
            <AnimatePresence>
                {selectedNoteIds.length > 0 && (
                    <motion.div
                        initial={{ y: 80, x: "-50%", opacity: 0 }}
                        animate={{ y: 0, x: "-50%", opacity: 1 }}
                        exit={{ y: 80, x: "-50%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-6 left-1/2 z-50 flex items-center justify-between gap-6 px-6 py-4 rounded-2xl bg-neutral-900/90 border border-white/10 backdrop-blur-xl shadow-2xl min-w-[320px] sm:min-w-[450px]"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-white">
                                {selectedNoteIds.length} {selectedNoteIds.length === 1 ? 'note' : 'notes'} selected
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => {
                                    if (selectedNoteIds.length === filteredNotes.length) {
                                        setSelectedNoteIds([]);
                                    } else {
                                        setSelectedNoteIds(filteredNotes.map(n => n.id));
                                    }
                                }}
                                variant="outline"
                                className="px-3 py-1.5 h-auto text-xs font-semibold border bg-white/5 border-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                            >
                                {selectedNoteIds.length === filteredNotes.length ? 'Deselect All' : 'Select All'}
                            </Button>
                            <Button
                                onClick={onDeleteSelected}
                                className="flex items-center gap-1.5 px-4 py-2 h-auto rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow transition"
                            >
                                <FiTrash2 size={13} />
                                <span>Delete</span>
                            </Button>
                            <Button
                                onClick={() => setSelectedNoteIds([])}
                                variant="ghost"
                                className="p-2 h-auto rounded-lg text-gray-400 hover:text-white bg-transparent hover:bg-transparent"
                            >
                                Cancel
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotesPage;