import React from "react";

function Sub({ title, url }) {
  return (
    <div className="sub">
      <img
        src="https://raw.githubusercontent.com/Priyanshughost/ChatBot/main/src/book.svg"
        alt="Website Icon"
      />
      <h4>
        <a href={url} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </h4>
    </div>
  );
}

export default Sub;
