import { io, Socket } from "socket.io-client";

/**
 * ["by default i guess it uses pooling for data ,hence   transports: ["websocket"]=>not sure"]
 */

export const socket: Socket = io("http://localhost:8080", {
  transports: ["websocket"], 
});
