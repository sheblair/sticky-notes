import React from "react";

export default function Option(props) {
  return <option value={props.option.hexValue}>{props.option.text}</option>;
}
