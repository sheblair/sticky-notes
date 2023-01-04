import React from "react";
import Note from "./Note";

const NotesList = (props) => {
  const filterCallback = (note) => note.doesMatchSearch;
  const filteredNotes = props.notes.filter(filterCallback);
  const renderNote = (note) => (
    <Note
      key={note.id}
      note={note}
      onType={props.onType}
      removeNote={props.removeNote}
    />
  );
  const notesListElements = filteredNotes.map(renderNote);

  return <ul className="notes-list">{notesListElements}</ul>;
};

export default NotesList;
