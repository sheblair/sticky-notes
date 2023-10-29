import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import NotesList from "./components/NotesList";

export default function App() {
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  );

  const [theme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme")) || "default"
  );

  const [selectedThemeOption, setSelectedThemeOption] = useState(
    JSON.parse(localStorage.getItem("theme")) || "default"
  );

  const [backgroundColors, setBackgroundColors] = useState([]);
  const [themeChanged, setThemeChanged] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  /*
   * default theme value must be an rgb value, not a hex value.
   * for the other themes, the browser will convert hex to rgb when the color
   * gets applied, but not for default. i am not sure why.
   */
  const themeOptions = [
    {
      id: "default",
      name: "default",
      value: "rgb(255, 255, 224)",
    },
    {
      id: "pink",
      name: "angel",
      value: "ffe6e9",
    },
    {
      id: "green",
      name: "garden",
      value: "fffacd",
    },
    {
      id: "lavender",
      name: "stardust",
      value: "fde6ff",
    },
  ];

  function handleMouseEnter() {
    setIsTooltipVisible(true);
  }
  function handleMouseLeave() {
    setIsTooltipVisible(false);
  }

  function switchTheme(selectedValue) {
    if (theme !== selectedValue) {
      setThemeChanged(true);

      if (selectedValue === "rgb(255, 255, 224)") {
        setTheme("default");
        setSelectedThemeOption("default");
        localStorage.setItem("theme", JSON.stringify("default"));
      } else {
        setTheme(selectedValue);
        setSelectedThemeOption(selectedValue);
        localStorage.setItem("theme", JSON.stringify(selectedValue));
      }
    }
  }

  useEffect(() => {
    if (theme === "default") {
      return;
    } else {
      fetch(`https://www.thecolorapi.com/scheme?hex=${theme}&mode=analogic`)
        .then((response) => response.json())
        .then((data) => {
          // pull in hex values that will get converted to rgb in browser
          const hexValues = data.colors.map((color) => color.hex.value);
          setBackgroundColors(hexValues);
        })
        .catch((error) => {
          console.log("Error fetching hex values from API", error);
          setNotes((prevNotes) =>
            prevNotes.map((note) => ({
              ...note,
              backgroundColor: "rgb(255, 255, 224)",
            }))
          );
          setSelectedThemeOption("default");
          alert(
            "Sorry! Looks like the theme-switcher is broken. Use the default theme for now."
          );
        });
    }
  }, [theme, themeChanged]);

  useEffect(() => {
    if (themeChanged) {
      setNotes((prevNotes) =>
        prevNotes.map((note) => ({
          ...note,
          backgroundColor:
            theme === "default"
              ? "rgb(255, 255, 224)"
              : backgroundColors[
                  Math.floor(Math.random() * backgroundColors.length)
                ],
        }))
      );
    }
  }, [theme, themeChanged, backgroundColors]);

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
      backgroundColor: theme === "default" ? "rgb(255, 255, 224)" : randomColor,
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
        theme={theme}
        addNote={addNote}
        onSearch={onSearch}
        searchText={searchText}
        switchTheme={switchTheme}
        themeOptions={themeOptions}
        selectedThemeOption={selectedThemeOption}
        isTooltipVisible={isTooltipVisible}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
      <NotesList notes={notes} onType={onType} removeNote={removeNote} />
    </div>
  );
}
