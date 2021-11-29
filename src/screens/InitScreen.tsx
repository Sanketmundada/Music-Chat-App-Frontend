import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const InitScreen = () => {
  const [joinData, setJoinData] = useState({
    room: "",
  });
  const [redirect, setRedirect] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setRedirect(true);
  };

  if (redirect) {
    console.log("redirect");
    return <Navigate to={`/chat/${joinData.room}`} />;
  }

  return (
    <div>
      <input
        type="text"
        name="room"
        placeholder="room"
        onChange={handleChange}
        value={joinData.room}
      />
      <button onClick={handleSubmit}>Click</button>
    </div>
  );
};

export default InitScreen;
