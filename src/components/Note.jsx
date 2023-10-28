import React from "react";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Note({ note, onType, removeNote }) {
  const updateTitle = (e) => {
    const updatedValue = e.target.value;
    const changedNoteId = note.id;
    onType(changedNoteId, "title", updatedValue);
  };

  const updateBody = (e) => {
    const updatedValue = e.target.value;
    const changedNoteId = note.id;
    onType(changedNoteId, "body", updatedValue);
  };

  return (
    <li className="note" style={{ backgroundColor: note.backgroundColor }}>
      <input
        className="note-title"
        type="text"
        placeholder="Title"
        value={note.title}
        onChange={updateTitle}
      />
      <textarea
        className="note-body"
        placeholder="Body..."
        value={note.body}
        onChange={updateBody}
      />
      <FontAwesomeIcon
        className="note-delete"
        icon={faTrashAlt}
        onClick={() => removeNote(note.id)}
        style={{ backgroundColor: note.backgroundColor }}
      />
    </li>
  );
}
