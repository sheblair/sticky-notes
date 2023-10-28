import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import NotesList from "./components/NotesList";

export default function App() {
  // initialize notes from browser storage or empty array
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  );

  // initialize theme from browser storage or default
  const [theme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme")) || "default"
  );

  // initialize theme from browser storage or default
  const [selectedThemeOption, setSelectedThemeOption] = useState(
    JSON.parse(localStorage.getItem("theme")) || "default"
  );

  // initialize backgroundColors as empty array
  const [backgroundColors, setBackgroundColors] = useState([]);

  // initialize themeChanged as false
  const [themeChanged, setThemeChanged] = useState(false);

  // initialize searchText as empty string
  const [searchText, setSearchText] = useState("");

  // define array of objects to determine theme options
  // for reasons unknown to me, the default theme has to have a rgb value
  // it doesn't get converted like the other values do. this is a mystery i have yet to solve
  const themeOptions = [
    {
      id: "default",
      name: "Default",
      value: "rgb(255, 255, 224)",
    },
    {
      id: "pink",
      name: "Angel",
      value: "ffe6e9",
    },
    {
      id: "green",
      name: "Garden",
      value: "fffacd",
    },
    {
      id: "lavender",
      name: "Stardust",
      value: "fde6ff",
    },
  ];

  // gets called when user selects from theme dropdown menu
  function switchTheme(selectedValue) {
    // if the selection is different from the current theme, flip themeChanged to true
    if (theme !== selectedValue) {
      setThemeChanged(true);

      // if the user selected the default value, set theme, selectedThemeOption to default and store in browser
      if (selectedValue === "rgb(255, 255, 224)") {
        setTheme("default");
        setSelectedThemeOption("default");
        localStorage.setItem("theme", JSON.stringify("default"));
        // if the user selected anything other than default, set theme, selectedThemeOption and store in browser
      } else {
        setTheme(selectedValue);
        setSelectedThemeOption(selectedValue);
        localStorage.setItem("theme", JSON.stringify(selectedValue));
      }
    }
  }

  // effect that runs anytime theme, themeChanged are updated
  useEffect(() => {
    // if the theme is default, don't do anything here
    if (theme === "default") {
      return;
      // if the theme is anything other than default, fetch colors from API according to which theme is active
    } else {
      fetch(`https://www.thecolorapi.com/scheme?hex=${theme}&mode=analogic`)
        .then((response) => response.json())
        .then((data) => {
          /*
           * something i don't understand - i am pulling hex values here but
           * later somehow they will be converted to rgb when they get
           * inserted into the HTML structure - i need to figure out why/how
           * */
          const hexValues = data.colors.map((color) => color.hex.value);
          // set the background colors array to be the hex values we fetched
          setBackgroundColors(hexValues);
        })
        .catch((error) => {
          /* if the API fails, throw an error, set all note background color to default,
          set selected theme option to default, and alert the user that feature is broken */
          console.log("Error fetching hex values from API", error);
          setNotes((prevNotes) =>
            prevNotes.map((note) => ({
              ...note,
              backgroundColor: "rgb(255, 255, 224)",
            }))
          );
          setSelectedThemeOption("default");
          alert("Oops! Looks like the theme-switcher is broken.");
        });
    }
  }, [theme, themeChanged]);

  // effect that runs anytime theme, themeChanged, or backgroundColors are updated
  useEffect(() => {
    // if we have a theme change, time to map over the notes and update the colors to reflect the new theme
    if (themeChanged) {
      setNotes((prevNotes) =>
        prevNotes.map((note) => ({
          ...note,
          backgroundColor:
            /* if the theme is default, they should all be the same color (must be rgb val not hex val)
            if not default, they should be random from the array of hex values we fetched */
            theme === "default"
              ? "rgb(255, 255, 224)"
              : backgroundColors[
                  Math.floor(Math.random() * backgroundColors.length)
                ],
        }))
      );
    }
  }, [theme, themeChanged, backgroundColors]);

  // effect that runs every time notes is updated; stores notes in local browser
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  /*
   * add a new note - if the theme is default, the color will be default,
   * if not it will be a random color from our background colors array.
   * if the color is default, it has to be set as a rgb value, and not a hex value.
   * i have no idea why this is happening. it shouldn't be
   */
  function addNote() {
    const randomColor =
      backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

    const newNote = {
      id: Date.now(),
      title: "",
      body: "",
      doesMatchSearch: true,
      backgroundColor: theme === "default" ? "rgb(255, 255, 224)" : randomColor,
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  }

  // remove a note
  function removeNote(clickedId) {
    setNotes((oldNotes) => oldNotes.filter((note) => note.id !== clickedId));
  }

  // update a note's title or body text
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

  // search through the active notes
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
        theme={theme}
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
