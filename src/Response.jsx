import React from "react";
import Text from "/src/Text.jsx";

function Response({ message }) {
  return (
    <div className="wrap-res">
      <div className="res">
        <Text message={message} />
      </div>
    </div>
  );
}

export default Response;
