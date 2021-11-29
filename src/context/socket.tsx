import React, { useRef } from "react";
import { SocketContextType, SocketType } from "./types";

export const SocketContext = React.createContext<SocketContextType>({
  socket: null,
  setSocket: () => {},
});

export const SocketProvider: React.FC = ({ children }) => {
  let socketRef = useRef<SocketType>(null);

  const setSocket = (sk: React.MutableRefObject<SocketType>) => {
    socketRef.current = sk.current;
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef,
        setSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
