import React from "react";

export default function Header(props) {
  const callSearch = (event) => {
    const { value } = event.target;
    props.onSearch(value);
  };

  return (
    <header className="app-header__controls">
      <h1 className="app-header__title">Super Sticky Notes</h1>
      <aside>
        <button onClick={props.addNote} className="add-new">
          + New Note
        </button>
        <input
          className="search"
          type="text"
          placeholder="Type here to search..."
          value={props.searchText}
          onChange={callSearch}
        />
      </aside>
    </header>
  );
}
