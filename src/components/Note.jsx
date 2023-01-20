import React from "react";

export default function Note(props) {
  function updateTitle(event) {
    const updatedValue = event.target.value;
    const changedNoteId = props.note.id;
    props.onType(changedNoteId, "title", updatedValue);
  }

  function updateBody(event) {
    const updatedValue = event.target.value;
    const changedNoteId = props.note.id;
    props.onType(changedNoteId, "body", updatedValue);
  }

  function handleClick(e) {
    e.preventDefault();
    props.removeNote(props.note.id);
  }

  return (
    <li
      className="note"
      style={{ backgroundColor: props.note.backgroundColor }}
    >
      <input
        className="note__title"
        type="text"
        placeholder="Title"
        value={props.note.title}
        onChange={updateTitle}
      />
      <textarea
        className="note__description"
        placeholder="Description..."
        value={props.note.body}
        onChange={updateBody}
      />
      <span className="note__delete" onClick={handleClick}>
        x
      </span>
    </li>
  );
}
