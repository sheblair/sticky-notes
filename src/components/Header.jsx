import React from "react";
import OptionsList from "./OptionsList";

export default function Header({
  onSearch,
  addNote,
  searchText,
  switchTheme,
  themeOptions,
  selectedThemeOption,
}) {
  const callSearch = (e) => onSearch(e.target.value);

  return (
    <header className="header-wrapper">
      <h1 className="header-title">Sticky Notes</h1>
      <aside className="search-wrapper">
        <button onClick={addNote} className="add-new">
          + New Note
        </button>
        <input
          className="search"
          type="text"
          placeholder="Type here to search..."
          value={searchText}
          onChange={callSearch}
        />
      </aside>
      <OptionsList
        switchTheme={switchTheme}
        themeOptions={themeOptions}
        selectedThemeOption={selectedThemeOption}
      />
    </header>
  );
}
