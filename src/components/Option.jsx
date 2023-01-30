import React from "react";
// destructure props
export default function Option(props) {
  return (
    <div className="theme-switch-wrapper">
      <input
        type="radio"
        id={props.option.id}
        name="theme-switch"
        value={props.option.hexValue}
        onChange={() => props.switchTheme(props.option.hexValue)}
      />
      <label htmlFor={props.option.id}>{props.option.text}</label>
      <br />
    </div>
  );
}
