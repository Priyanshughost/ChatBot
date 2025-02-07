import React from 'react';

function Sub({ url }) {
  // Extract domain name from URL
  const getDomainName = (url) => {
    try {
      return new URL(url).hostname.replace("www.", ""); // Remove 'www.'
    } catch (error) {
      return "Unknown Source"; // Fallback for invalid URLs
    }
  };

  return (
    <div className='sub'>
      <img src="https://raw.githubusercontent.com/Priyanshughost/ChatBot/main/src/book.svg" alt="Resource" />
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <h4>{getDomainName(url)}</h4>
        </a>
      ) : (
        <h4>Unknown Source</h4>
      )}
    </div>
  );
}

export default Sub;
