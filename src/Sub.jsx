import React from 'react';

function Sub({ title, url }) {
  return (
    <div className='sub'>
      <img src="https://raw.githubusercontent.com/Priyanshughost/ChatBot/main/src/book.svg" alt="Resource" />
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <h4>{url.split("//")[1].split("/")[0]}</h4>
        </a>
      ) : (
        <h4>{title}</h4>
      )}
    </div>
  );
}

export default Sub;
