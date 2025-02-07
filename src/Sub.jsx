import React from 'react';

function Sub({ url }) {
  // Extract website name safely
  const getWebsiteName = (url) => {
    if (!url) return "Unknown";
    try {
      return url.split("//")[1]?.split("/")[0] || "Unknown";
    } catch (error) {
      console.error("Error processing URL:", url, error);
      return "Unknown";
    }
  };

  const websiteName = getWebsiteName(url);

  return (
    <div className="sub">
      <h4>{websiteName}</h4>
    </div>
  );
}

export default Sub;
