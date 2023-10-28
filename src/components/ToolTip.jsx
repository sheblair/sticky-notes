import React from "react";

export default function ToolTip({ handleMouseEnter, handleMouseLeave }) {
  return (
    <aside className="tooltip-container">
      <span
        className="question-mark"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        ?
      </span>
      <div className="tooltip">
        <p>
          any notes you create are automatically saved to your browser's
          storage. if you clear your browsing data, you will lose your saved
          notes.
        </p>
      </div>
    </aside>
  );
}
