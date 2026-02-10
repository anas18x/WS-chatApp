import { ENV } from "./config/env.config.js";
import { WebSocketServer, WebSocket } from "ws";
import { roomController } from "./controller/index.js";
import { roomService } from "./services/index.js";

const wss = new WebSocketServer({ port: ENV.PORT as number }, () => {
  console.log(`WebSocket server running on port ${ENV.PORT}`);
});


let socketsInfo = new Map< WebSocket, {roomId: string, name: string}>();

// socket is the client that is connecting to the server, it lets us send and receive messages
wss.on("connection", (socket) => {
  console.log("client connected to the server");

  socket.on("message", (message) => roomController.handleMessage(message, socket, socketsInfo));

  socket.on("close", () => roomService.leaveRoom(socket, socketsInfo));

  socket.on("error", (error) => {
    console.error("WebSocket error:", error.message);
  });

});

