import React from "react";
import Option from "./Option";

export default function OptionsList({
  themeOptions,
  selectedThemeOption,
  switchTheme,
}) {
  const renderOption = (option) => <Option key={option.id} option={option} />;
  const optionsListElements = themeOptions.map(renderOption);

  return (
    <div className="select-theme-wrapper">
      <label htmlFor="theme">theme: </label>
      <select
        name="theme"
        id="theme"
        className="select-menu"
        value={selectedThemeOption}
        onChange={(e) => switchTheme(e.target.value)}
      >
        {optionsListElements}
      </select>
    </div>
  );
}
