import { Socket } from "socket.io-client";

export type SocketType = Socket | null;

export interface SocketContextType {
  socket: React.MutableRefObject<SocketType> | null;
  setSocket: (socketref: React.MutableRefObject<SocketType>) => void;
}

export interface UserContextType {
  email: string;
  display_name: string;
  setDetails: (email: string, display_name: string) => void;
}
