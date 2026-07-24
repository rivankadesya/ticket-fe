import { io } from 'socket.io-client';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';
const SERVER_URL = API_BASE_URL.replace('/api', '');

let socket = null;

export const connectSocket = () => {
  if (socket?.connected) return socket;

  socket = io(SERVER_URL, {
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    // console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    // console.log('Socket disconnected:', reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};

export const onEvent = (event, callback) => {
  if (!socket) connectSocket();
  socket.on(event, callback);
};

export const offEvent = (event, callback) => {
  if (!socket) return;
  if (callback) {
    socket.off(event, callback);
  } else {
    socket.off(event);
  }
};

export { socket };
