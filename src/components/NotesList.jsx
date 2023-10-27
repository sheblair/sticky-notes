import React from "react";
import Note from "../components/Note";

export default function NotesList({ notes, onType, removeNote }) {
  const filteredNotes = notes.filter((note) => note.doesMatchSearch);

  const renderNote = (note) => (
    <Note key={note.id} note={note} onType={onType} removeNote={removeNote} />
  );
  const notesListElements = filteredNotes.map(renderNote);

  return <ul className="notes-list">{notesListElements}</ul>;
}
