import { useState } from 'react';
import { useNotes } from '../hooks/useNotes';

const NotesPage = () => {
  const { notes, isLoading, error, addNote, editNote, removeNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ title: '', content: '' });
  const [formError, setFormError] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await addNote({ title, content });
      setTitle('');
      setContent('');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setDraft({ title: note.title, content: note.content || '' });
  };

  const handleSave = async (id) => {
    setFormError(null);
    try {
      await editNote(id, { title: draft.title, content: draft.content });
      setEditingId(null);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id) => {
    setFormError(null);
    try {
      await removeNote(id);
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="notes-page">
      <div className="notes-stack">
        <div className="auth-card notes-create-card">
          <div className="auth-header">
            <h2>Нова белешка</h2>
            <p className="subtitle">Додајте наслов и содржина.</p>
          </div>

          <form className="auth-form" onSubmit={handleCreate}>
            <div className="field">
              <label htmlFor="note-title">Наслов</label>
              <input
                id="note-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="на пр. Состанок"
              />
            </div>
            <div className="field">
              <label htmlFor="note-content">Содржина</label>
              <textarea
                id="note-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Запишете нешто..."
              />
            </div>
            <button className="btn-primary" type="submit" disabled={!title.trim()}>
              Додај
            </button>
          </form>

          {(error || formError) && (
            <div className="feedback error">{formError || error}</div>
          )}
        </div>

        {isLoading ? (
          <p className="subtitle notes-empty">Се вчитува...</p>
        ) : notes.length === 0 ? (
          <p className="subtitle notes-empty">Нема белешки.</p>
        ) : (
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note.id} className="auth-card note-card">
                {editingId === note.id ? (
                  <form
                    className="auth-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSave(note.id);
                    }}
                  >
                    <div className="field">
                      <label>Наслов</label>
                      <input
                        type="text"
                        value={draft.title}
                        onChange={(e) => setDraft((current) => ({ ...current, title: e.target.value }))}
                      />
                    </div>
                    <div className="field">
                      <label>Содржина</label>
                      <textarea
                        value={draft.content}
                        onChange={(e) => setDraft((current) => ({ ...current, content: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    <div className="note-actions">
                      <button className="btn-primary" type="submit" disabled={!draft.title.trim()}>
                        Зачувај
                      </button>
                      <button className="btn-secondary" type="button" onClick={() => setEditingId(null)}>
                        Откажи
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="auth-header">
                      <h2>{note.title}</h2>
                      {note.content && <p className="subtitle note-content">{note.content}</p>}
                    </div>
                    <div className="note-actions">
                      <button className="btn-secondary" type="button" onClick={() => startEdit(note)}>
                        Уреди
                      </button>
                      <button className="btn-secondary" type="button" onClick={() => handleDelete(note.id)}>
                        Избриши
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
