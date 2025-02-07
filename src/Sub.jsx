import React from 'react';

function Sub({ url }) {
  if (!url) return null; // Don't render if no URL is provided

  // Extract domain name from URL
  const getDomainName = (url) => {
    try {
      return url.split("//")[1].split("/")[0]; // Extract domain name
    } catch (error) {
      return "Unknown Source";
    }
  };

  return (
    <div className='sub'>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <h4>{getDomainName(url)}</h4>
      </a>
    </div>
  );
}

export default Sub;
