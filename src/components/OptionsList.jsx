import React from "react";
import Option from "./Option";

export default function OptionsList(props) {
  const renderOption = (option) => <Option key={option.id} option={option} />;
  const optionsListElements = props.themeOptions.map(renderOption);

  return (
    <div className="select-theme-wrapper">
      <label htmlFor="theme">Choose a theme:</label>
      <select
        name="theme"
        id="theme"
        className="select-menu"
        value={props.theme}
        onChange={(event) => props.switchTheme(event.target.value)}
      >
        {optionsListElements}
      </select>
    </div>
  );
}
