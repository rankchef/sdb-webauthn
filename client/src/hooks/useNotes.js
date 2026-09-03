import { useCallback, useEffect, useState } from 'react';
import { createNote, deleteNote, getNotes, updateNote } from '../actions/notes';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNotes();
      setNotes(data.notes);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addNote = async ({ title, content }) => {
    const data = await createNote({ title, content });
    setNotes((current) => [data.note, ...current]);
    return data.note;
  };

  const editNote = async (id, fields) => {
    const data = await updateNote(id, fields);
    setNotes((current) => current.map((note) => (note.id === data.note.id ? data.note : note)));
    return data.note;
  };

  const removeNote = async (id) => {
    await deleteNote(id);
    setNotes((current) => current.filter((note) => note.id !== id));
  };

  return { notes, isLoading, error, refresh, addNote, editNote, removeNote };
}
