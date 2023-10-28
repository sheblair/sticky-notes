import React from "react";
import OptionsList from "./OptionsList";
import ToolTip from "./ToolTip";

export default function Header({
  onSearch,
  addNote,
  searchText,
  switchTheme,
  themeOptions,
  selectedThemeOption,
  handleMouseEnter,
  handleMouseLeave,
}) {
  const callSearch = (e) => onSearch(e.target.value);

  return (
    <header className="header-wrapper">
      <h1 className="header-title">Sticky Notes</h1>
      <div className="theme-info-wrapper">
        <OptionsList
          switchTheme={switchTheme}
          themeOptions={themeOptions}
          selectedThemeOption={selectedThemeOption}
        />
        <ToolTip
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      </div>
      <aside className="search-wrapper">
        <button
          onClick={addNote}
          className="add-new"
          style={{ backgroundColor: "#eee" }}
        >
          + New Note
        </button>
        <label htmlFor="search"></label>
        <input
          className="search"
          id="search"
          type="text"
          placeholder="Type here to search..."
          value={searchText}
          onChange={callSearch}
        />
      </aside>
    </header>
  );
}
