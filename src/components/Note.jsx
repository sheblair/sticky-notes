import React from "react";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Note(props) {
  const updateTitle = (event) => {
    const updatedValue = event.target.value;
    const changedNoteId = props.note.id;
    props.onType(changedNoteId, "title", updatedValue);
  };

  const updateBody = (event) => {
    const updatedValue = event.target.value;
    const changedNoteId = props.note.id;
    props.onType(changedNoteId, "body", updatedValue);
  };

  return (
    <li
      className="note"
      style={{ backgroundColor: props.note.backgroundColor }}
    >
      <input
        className="note-title"
        type="text"
        placeholder="Title"
        value={props.note.title}
        onChange={updateTitle}
      />
      <textarea
        className="note-body"
        placeholder="Body..."
        value={props.note.body}
        onChange={updateBody}
      />
      <FontAwesomeIcon
        className="note-delete"
        icon={faTrashAlt}
        onClick={() => props.removeNote(props.note.id)}
      />
    </li>
  );
}
