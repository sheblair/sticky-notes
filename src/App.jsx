import React, { Component } from "react";
import Header from "./components/Header";
import NotesList from "./components/NotesList";
import notesColors from "./notesColors";

class App extends Component {
  state = {
    notes: [
      {
        id: Date.now(),
        title: "",
        description: "",
        doesMatchSearch: true,
        backgroundColor: "LemonChiffon",
      },
    ],
    searchText: "",
  };

  // componentDidMount() {
  //   const stringifiedNotes = localStorage.getItem("stringifiedNotes");
  //   if (stringifiedNotes) {
  //     const savedNotes = JSON.parse(stringifiedNotes);
  //     this.setState({ notes: savedNotes });
  //   }
  // }

  // componentDidUpdate() {
  //   const stringifiedNotes = JSON.stringify(this.state.notes);
  //   console.log(stringifiedNotes);
  //   localStorage.setItem("stringifiedNotes", stringifiedNotes);
  // }

  addNote = () => {
    const randomIndex = Math.floor(Math.random() * notesColors.length);
    const randomColor = notesColors[randomIndex];

    const note = {
      id: Date.now(),
      title: "",
      description: "",
      doesMatchSearch: true,
      backgroundColor: randomColor,
    };

    const newNotes = [note, ...this.state.notes];
    this.setState({ notes: newNotes });
  };

  removeNote = (clickedId) => {
    const filterCallback = (note, id) => note.id !== clickedId;
    const newNotes = this.state.notes.filter(filterCallback);
    this.setState({ notes: newNotes });
  };

  onType = (changedNoteId, updatedKey, updatedValue) => {
    const updatedNotes = this.state.notes.map((note) => {
      if (note.id !== changedNoteId) {
        return note;
      } else {
        if (updatedKey === "title") {
          note.title = updatedValue;
          return note;
        } else {
          note.description = updatedValue;
          return note;
        }
      }
    });

    this.setState({ notes: updatedNotes });
  };

  onSearch = (text) => {
    const newSearchText = text.toLowerCase();

    const searchedNotes = this.state.notes.map((note) => {
      if (!newSearchText) {
        note.doesMatchSearch = true;
        return note;
      } else {
        const title = note.title.toLowerCase();
        const description = note.description.toLowerCase();
        const titleMatch = title.includes(newSearchText);
        const descriptionMatch = description.includes(newSearchText);
        const hasMatch = titleMatch || descriptionMatch;
        note.doesMatchSearch = hasMatch;
        return note;
      }
    });

    this.setState({
      notes: searchedNotes,
      searchText: newSearchText,
    });
  };

  render() {
    return (
      <div className="App">
        <Header
          onSearch={this.onSearch}
          addNote={this.addNote}
          searchText={this.state.searchText}
        />
        <NotesList
          notes={this.state.notes}
          onType={this.onType}
          removeNote={this.removeNote}
        />
      </div>
    );
  }
}

export default App;
