import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import NotesList from "./components/NotesList";

export default function App() {
  const [notes, setNotes] = useState(
    JSON.parse(localStorage.getItem("notes")) || []
  );
  const [searchText, setSearchText] = useState("");
  const [theme, setTheme] = useState(null);
  const [backgroundColors, setBackgroundColors] = useState([]);
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

  // if there is a theme set in state, fetch hex values from colors API
  useEffect(() => {
    if (theme) {
      fetch(`https://www.thecolorapi.com/scheme?hex=${theme}&mode=analogic`)
        .then((response) => response.json())
        .then((data) => {
          const hexValues = data.colors.map((color) => color.hex.value);
          setBackgroundColors(hexValues);
        })
        .catch((error) =>
          console.log(
            "Error fetching hex values from API. User will not be able to change color scheme."
          )
        );
    }
  }, [theme]);

  // if we have hex values populating the backgroundColors array, map over notes and change colors
  useEffect(() => {
    if (backgroundColors.length > 0) {
      setNotes((prevNotes) =>
        prevNotes.map((note) => ({
          ...note,
          backgroundColor:
            backgroundColors[
              Math.floor(Math.random() * backgroundColors.length)
            ],
        }))
      );
    }
  }, [backgroundColors]);

  // when user selects a theme option, set theme to that hex value
  function switchTheme(clickedOptionHexVal) {
    setTheme(clickedOptionHexVal);
  }

  // save notes to local storage in the browser
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function addNote() {
    const randomColor =
      backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

    const newNote = {
      id: Date.now(),
      title: "",
      body: "",
      doesMatchSearch: true,
      backgroundColor: theme ? randomColor : "lightyellow",
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
