import { useEffect, createContext, useState, useContext } from "react";
import { io } from "socket.io-client";
const URL = "http://localhost:5000";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io(URL, {
      transports: ["websocket"],
    });
    newSocket.on("connect", () => {
      console.log("Socket connected with id:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      console.log("socket disconnected");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
