import React from "react";
import Option from "./Option";

export default function OptionsList(props) {
  const renderOption = (option) => (
    <Option key={option.id} option={option} switchTheme={props.switchTheme} />
  );
  const optionsListElements = props.themeOptions.map(renderOption);

  return <ul>{optionsListElements}</ul>;
}
