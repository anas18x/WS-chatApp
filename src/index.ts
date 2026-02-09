import { ENV } from "./config/env.config.js";
import { WebSocketServer, WebSocket } from "ws";
import { roomController } from "./controller/index.js";
import { roomService } from "./services/index.js";

const wss = new WebSocketServer({ port: ENV.PORT as number }, () => {
  console.log(`WebSocket server running on port ${ENV.PORT}`);
});

let clients = new Map<string, Set<WebSocket>>();

// socket is the client that is connecting to the server, it lets us send and receive messages
wss.on("connection", (socket) => {
  console.log("client connected to the server");

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());


    if (parsedMessage.type === "create-new-room") {
      if (!clients.has(parsedMessage.payload.roomId)) {
        clients.set(parsedMessage.payload.roomId, new Set());
      }

      // add socket to the room
      clients.get(parsedMessage.payload.roomId)?.add(socket);
      console.log(
        `${parsedMessage.payload.name} joined the room ${parsedMessage.payload.roomId}`,
      );
    }


    if (parsedMessage.type === "chat") {
      const currentUserRoom = clients.get(parsedMessage.payload.roomId);
       console.log("Chat received for room:", currentUserRoom);
       currentUserRoom?.forEach((clientSocket) => {
        if (clientSocket.readyState === WebSocket.OPEN) {
          clientSocket.send(JSON.stringify(parsedMessage.payload));
        }
      });
    }

  });


  socket.on("close", () => roomService.leaveRoom(socket, clients));

});
