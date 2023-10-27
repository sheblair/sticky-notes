import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import NotesList from "./components/NotesList";

export default function App() {
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  );
  const [theme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme")) || ""
  );

  const [selectedThemeOption, setSelectedThemeOption] = useState(
    JSON.parse(localStorage.getItem("theme")) || "default"
  );

  const [backgroundColors, setBackgroundColors] = useState([]);
  const [themeChanged, setThemeChanged] = useState(false);
  const [searchText, setSearchText] = useState("");

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

  useEffect(() => {
    if (selectedThemeOption === "default") {
      setNotes((prevNotes) =>
        prevNotes.map((note) => ({
          ...note,
          backgroundColor: "ffffe0",
        }))
      );
    } else if (theme) {
      fetch(`https://www.thecolorapi.com/scheme?hex=${theme}&mode=analogic`)
        .then((response) => response.json())
        .then((data) => {
          const hexValues = data.colors.map((color) => color.hex.value);
          setBackgroundColors(hexValues);
        })
        .catch((error) =>
          console.log("Error fetching hex values from API", error)
        );
    }
  }, [theme, themeChanged]);

  // when user selects a theme option, set theme to that hex value
  function switchTheme(selectedHexVal) {
    if (theme !== selectedHexVal) {
      setThemeChanged(true);
    } else if (selectedHexVal === "default") {
      setThemeChanged(false);
    }
    setTheme(selectedHexVal);
    setSelectedThemeOption(selectedHexVal); // Update the selected theme option
    localStorage.setItem("theme", JSON.stringify(selectedHexVal));

    console.log(theme);
    console.log(selectedHexVal);
    console.log("switchTheme ran");
  }

  // if we have hex values in the backgroundColors array, map over notes and change colors
  useEffect(() => {
    if (themeChanged && backgroundColors.length) {
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
  }, [backgroundColors, themeChanged, theme]);

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
      backgroundColor: theme ? randomColor : "ffffe0",
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
