import React, { useState } from "react";
import Header from "./components/Header";
import NotesList from "./components/NotesList";
import notesColors from "./notesColors";

export default function App() {
  const [notes, setNotes] = useState([
    {
      id: Date.now(),
      title: "",
      body: "",
      doesMatchSearch: true,
      backgroundColor: "LemonChiffon",
    },
  ]);
  const [searchText, setSearchText] = useState("");

  // useEffect(() => {
  //   localStorage.setItem("notes", JSON.stringify(notes));
  // }, [notes]);

  function addNote() {
    const randomIndex = Math.floor(Math.random() * notesColors.length);
    const randomColor = notesColors[randomIndex];

    const newNote = {
      id: Date.now(),
      title: "",
      body: "",
      doesMatchSearch: true,
      backgroundColor: randomColor,
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

    setNotes((prevNotes) => {
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
      });
    });

    setSearchText(newSearchText);

    // const newSearchText = text.toLowerCase();

    // const searchedNotes = notes.map((note) => {
    //   if (!newSearchText) {
    //     note.doesMatchSearch = true;
    //     return note;
    //   } else {
    //     const title = note.title.toLowerCase();
    //     const body = note.body.toLowerCase();
    //     const titleMatch = title.includes(newSearchText);
    //     const bodyMatch = body.includes(newSearchText);
    //     const hasMatch = titleMatch || bodyMatch;
    //     note.doesMatchSearch = hasMatch;
    //     return note;
    //   }
    // });

    // setNotes({
    //   notes: searchedNotes,
    // });
    // setSearchText({ searchText: newSearchText });
  }

  return (
    <div className="App">
      <Header addNote={addNote} onSearch={onSearch} searchText={searchText} />
      <NotesList notes={notes} onType={onType} removeNote={removeNote} />
    </div>
  );
}
