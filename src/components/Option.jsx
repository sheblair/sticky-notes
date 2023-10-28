import React from "react";

export default function Option({ option }) {
  return <option value={option.value}>{option.name}</option>;
}
