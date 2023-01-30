import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import NotesList from "./components/NotesList";

export default function App() {
  const [notes, setNotes] = useState(
    JSON.parse(localStorage.getItem("notes")) || []
  );
  const [searchText, setSearchText] = useState("");
  const [backgroundColors, setBackgroundColors] = useState([]);
  const [theme, setTheme] = useState("fffacd");
  const [themeOptions, setThemeOptions] = useState([
    {
      id: "pink",
      text: "pink",
      hexValue: "ffe4e1",
    },
    {
      id: "green",
      text: "green",
      hexValue: "fffacd",
    },
  ]);

  // find a way to default to light yellow and then add hex vals
  function switchTheme(clickedOptionHexVal) {
    setTheme(clickedOptionHexVal);
    setNotes((prevNotes) =>
      prevNotes.map((note) => ({
        ...note,
        backgroundColor:
          backgroundColors[Math.floor(Math.random() * backgroundColors.length)],
      }))
    );
    console.log(clickedOptionHexVal);
    console.log(theme);
  }

  useEffect(() => {
    fetch(`https://www.thecolorapi.com/scheme?hex=${theme}&mode=analogic`)
      .then((response) => response.json())
      .then((data) => {
        const hexValues = data.colors.map((color) => color.hex.value);
        setBackgroundColors(hexValues);
      });
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function addNote() {
    const newNote = {
      id: Date.now(),
      title: "",
      body: "",
      doesMatchSearch: true,
      backgroundColor:
        backgroundColors[Math.floor(Math.random() * backgroundColors.length)],
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  }

  function removeNote(clickedId) {
    setNotes((oldNotes) => oldNotes.filter((note) => note.id !== clickedId));
  }

  function onType(changedNoteId, updatedKey, updatedValue) {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id !== changedNoteId) {
          return note;
        } else {
          if (updatedKey === "title") {
            return { ...note, title: updatedValue };
          } else {
            return { ...note, body: updatedValue };
          }
        }
      })
    );
  }

  function onSearch(text) {
    const newSearchText = text.toLowerCase();

    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (!newSearchText) {
          note.doesMatchSearch = true;
          return note;
        } else {
          const title = note.title.toLowerCase();
          const body = note.body.toLowerCase();
          const titleMatch = title.includes(newSearchText);
          const bodyMatch = body.includes(newSearchText);
          const hasMatch = titleMatch || bodyMatch;
          note.doesMatchSearch = hasMatch;
          return note;
        }
      })
    );
    setSearchText(newSearchText);
  }

  return (
    <div className="App">
      <Header
        addNote={addNote}
        onSearch={onSearch}
        searchText={searchText}
        switchTheme={switchTheme}
        themeOptions={themeOptions}
      />
      <NotesList notes={notes} onType={onType} removeNote={removeNote} />
    </div>
  );
}
