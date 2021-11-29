import React, { useRef, useState } from "react";
import { UserContextType } from "./types";

export const UserContext = React.createContext<UserContextType>({
  email: "",
  display_name: "",
  setDetails: () => {},
});

export const UserProvider: React.FC = ({ children }) => {
  const [userState, setUserState] = useState({
    email: "",
    display_name: "",
  });

  const { email, display_name } = userState;

  const setDetails = (a: string, b: string) => {
    setUserState((prev) => {
      return {
        ...prev,
        email: a,
        display_name: b,
      };
    });
  };

  return (
    <UserContext.Provider value={{ email, display_name, setDetails }}>
      {children}
    </UserContext.Provider>
  );
};
