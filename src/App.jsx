import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import NotesList from "./components/NotesList";

export default function App() {
  // if there are notes in browser's local storage, initialize with those;
  // otherwise, initialize with an empty array
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  );

  // initialize search text as an empty string
  const [searchText, setSearchText] = useState("");

  // if there is a selected theme in browser's local storage, initalize with that;
  // otherwise, initalize with default
  const [theme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme")) || "ffffe0"
  );
  // Initialize the theme dropdown based on the theme in local storage
  const [selectedThemeOption, setSelectedThemeOption] = useState(
    JSON.parse(localStorage.getItem("theme")) || "default"
  );
  const [backgroundColors, setBackgroundColors] = useState([]);
  const themeOptions = [
    {
      id: "default",
      name: "Default",
      hexValue: "ffffe0",
    },
    {
      id: "pink",
      name: "Angel",
      hexValue: "ffe6e9",
    },
    {
      id: "green",
      name: "Garden",
      hexValue: "fffacd",
    },
    {
      id: "lavender",
      name: "Stardust",
      hexValue: "fde6ff",
    },
  ];

  // to switch theme
  useEffect(() => {
    // if the user selects "default", all notes are light yellow
    if (theme === "ffffe0") {
      setNotes((prevNotes) =>
        prevNotes.map((note) => ({
          ...note,
          backgroundColor: "lightyellow",
        }))
      );
      // otherwise the background colors come from the colors API
    } else if (theme) {
      fetch(`https://www.thecolorapi.com/scheme?hex=${theme}&mode=analogic`)
        .then((response) => response.json())
        .then((data) => {
          const hexValues = data.colors.map((color) => color.hex.value);
          setBackgroundColors(hexValues);
        })
        .catch((error) => console.log("Error fetching hex values from API"));
    }
  }, [theme]);

  // when user selects a theme option, set theme to that hex value
  function switchTheme(selectedHexVal) {
    setTheme(selectedHexVal);
    setSelectedThemeOption(selectedHexVal); // Update the selected theme option
    localStorage.setItem("theme", JSON.stringify(selectedHexVal));
    console.log("switchTheme ran");
    console.log(theme);
  }

  // if we have hex values in the backgroundColors array, map over notes and change colors
  useEffect(() => {
    if (backgroundColors.length) {
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
        selectedThemeOption={selectedThemeOption}
      />
      <NotesList notes={notes} onType={onType} removeNote={removeNote} />
    </div>
  );
}
