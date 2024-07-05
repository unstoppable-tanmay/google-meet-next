import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const socketInstance = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/mediasoup`, {
        transports: ['websocket'],
      });
      setSocket(socketInstance);

      // Cleanup on component unmount
      return () => {
        socketInstance.close();
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
