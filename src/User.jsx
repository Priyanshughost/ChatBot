import React from "react";
import Text from "/src/Text.jsx";

function User({ message }) {
  return (
    <div className="wrap-user">
      <div className="res">
        <Text message={message} />
      </div>
    </div>
  );
}

export default User;
