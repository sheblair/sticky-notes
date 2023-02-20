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

  // HERE IS THE PROBLEM:
  // when user clicks "pink", state is already initialized at null and thus there are no colors to use.
  // state is reset to pink, but that happens after the notes are rendered. that somehow happens at the end
  //
  // then when user clicks green, state is set to pink and the notes re-render based on this color scheme
  // the current theme held in state is misaligned with what the user is clicking. state is one step behind user,
  // so to speak. why though??? and how do i fix ??? arghhh

  // from ChatGPT:
  // The issue seems to be that the state of backgroundColors is not immediately updated when the theme changes,
  // and as a result, the notes may not render with the correct background color. One possible way to fix this is
  // to use the useEffect hook to update the background colors when the theme changes, and also to update the notes
  // with the new background colors.

  // In this updated version, the first useEffect hook fetches the new colors when the theme changes, and the second
  // useEffect hook updates the notes with the new background colors when the backgroundColors state changes. Note that
  // we only update the notes when backgroundColors has at least one color. This is to ensure that the notes are not updated
  // with an empty backgroundColors array.

  useEffect(() => {
    if (theme) {
      fetch(`https://www.thecolorapi.com/scheme?hex=${theme}&mode=analogic`)
        .then((response) => response.json())
        .then((data) => {
          const hexValues = data.colors.map((color) => color.hex.value);
          setBackgroundColors(hexValues);
          console.log(backgroundColors);
        });
    }
  }, [theme]);

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

  function switchTheme(clickedOptionHexVal) {
    setTheme(clickedOptionHexVal);
  }

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
    console.log(newNote.backgroundColor);
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
