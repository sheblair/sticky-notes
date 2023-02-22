import React from "react";
import OptionsList from "./OptionsList";

export default function Header(props) {
  const callSearch = (event) => {
    props.onSearch(event.target.value);
  };

  return (
    <header className="header-wrapper">
      <h1 className="header-title">Sticky Notes</h1>
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
      <OptionsList
        switchTheme={props.switchTheme}
        themeOptions={props.themeOptions}
      />
    </header>
  );
}
