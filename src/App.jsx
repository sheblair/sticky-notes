import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import NotesList from "./components/NotesList";

export default function App() {
  const [notes, setNotes] = useState(
    []
    // JSON.parse(localStorage.getItem("notes")) || []
  );
  const [searchText, setSearchText] = useState("");
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

  // set the default background color to be light yellow
  // set up options
  // when user clicks option,
  // state theme is set at hex value for option
  // useEffect fetches array of hex values based on option from color API
  //

  const [theme, setTheme] = useState(null);
  const [backgroundColors, setBackgroundColors] = useState([]);

  function switchTheme(clickedOptionHexVal) {
    // BLOCKER: how can i make the component re-render at the right time so that i immediately get the new state
    // when the user clicks the option, and populate it in the background colors of all the notes?
    // my basic problem is that my state setter function is updating the state for theme after i need it,
    // at the wrong point in my component life cycle
    setTheme(clickedOptionHexVal);
    console.log(theme);
  }

  // useEffect(() => {
  //   if (theme) {
  //     fetch(`https://www.thecolorapi.com/scheme?hex=${theme}&mode=analogic`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         const hexValues = data.colors.map((color) => color.hex.value);
  //         setBackgroundColors(hexValues);
  //       });
  //   }

  //   setNotes((prevNotes) =>
  //     prevNotes.map((note) => ({
  //       ...note,
  //       backgroundColor:
  //         backgroundColors[Math.floor(Math.random() * backgroundColors.length)],
  //     }))
  //   );
  //   console.log("useEffect ran");
  //   console.log(theme);
  // }, [theme]);

  // when user clicks option:
  // function switchTheme(clickedOptionHexVal) {
  //   // theme is set to hex value that was clicked:
  //   setTheme(clickedOptionHexVal);
  //   console.log(clickedOptionHexVal);
  //   // map over notes and replace all old background colors with new background colors

  //   console.log("switchTheme ran");
  // }

  // save notes to local storage:
  // useEffect(() => {
  //   localStorage.setItem("notes", JSON.stringify(notes));
  // }, [notes]);

  function addNote() {
    const randomColor =
      backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

    const newNote = {
      id: Date.now(),
      title: "",
      body: "",
      doesMatchSearch: true,
      backgroundColor: theme ? randomColor : "LemonChiffon",
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
