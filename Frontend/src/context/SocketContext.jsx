import { createContext, useMemo, useContext } from "react";
import { io, Socket } from "socket.io-client";

export const socketContext = createContext();

export const useSocket = () => {
  const socket = useContext(socketContext);
  return socket;
};

function SocketContext({ children }) {

    const socket = useMemo(() => io("http://localhost:5500"))

    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    )
}

export default SocketContext