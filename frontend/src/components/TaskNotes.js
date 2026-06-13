import React, { useState, useEffect } from "react";
import { getNotesByTask, createNote, deleteNote } from "../services/noteService";
import { Trash2, Send, FileText } from "lucide-react";

const TaskNotes = ({ taskId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const fetchNotes = async () => {
    try {
      const data = await getNotesByTask(taskId);
      setNotes(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const data = await createNote(taskId, newNote);
      setNotes([data.data, ...notes]);
      setNewNote("");
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  if (loading) return <div className="mt-4 text-sm text-slate-500">Loading notes...</div>;

  return (
    <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700/50">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
        <FileText className="h-4 w-4" /> Personal Notes
      </h4>

      <div className="mb-4 max-h-40 space-y-2 overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <p className="text-xs italic text-slate-400">No notes yet. Add one below!</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="group relative rounded-lg bg-slate-50 p-3 pr-8 dark:bg-slate-700/30">
              <p className="text-sm text-slate-600 dark:text-slate-300">{note.content}</p>
              <span className="mt-1 block text-[10px] text-slate-400">
                {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
              <button
                onClick={() => handleDeleteNote(note._id)}
                className="absolute right-2 top-2 hidden rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 group-hover:block dark:hover:bg-red-900/30"
                title="Delete Note"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddNote} className="flex gap-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Jot down a quick note..."
          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
        <button
          type="submit"
          disabled={!newNote.trim()}
          className="flex items-center justify-center rounded-lg bg-indigo-500 px-3 text-white transition-colors hover:bg-indigo-600 disabled:opacity-50"
          title="Save Note"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default TaskNotes;
