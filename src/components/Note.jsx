import React from "react";

const Note = (props) => {
  const updateTitle = (event) => {
    const updatedValue = event.target.value;
    const changedNoteId = props.note.id;
    props.onType(changedNoteId, "title", updatedValue);
  };

  const updateDescription = (event) => {
    const updatedValue = event.target.value;
    const changedNoteId = props.note.id;
    props.onType(changedNoteId, "description", updatedValue);
  };

  const handleClick = (e) => {
    e.preventDefault();
    props.removeNote(props.note.id);
  };

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
        value={props.note.description}
        onChange={updateDescription}
      />
      <span className="note__delete" onClick={handleClick}>
        x
      </span>
    </li>
  );
};

export default Note;
