import { roomService } from "../services/index.js";
import { WebSocket } from "ws";
import { messageSchema } from "../types/message.schema.js";

export const handleMessage = (
  message: WebSocket.RawData,
  socket: WebSocket,
  clients: Map<WebSocket, { roomId: string; name: string }> ) => {

  let parsedMessage ;
  try{
    parsedMessage = JSON.parse(message.toString());
  } catch{
    socket.send(JSON.stringify({ type: "error", payload : {
        message : "Invalid JSON format"
    }}));
    return;
  }

  const validation = messageSchema.safeParse(parsedMessage);
  if (!validation.success) {
    socket.send(JSON.stringify({ type: "error", payload: { message: "Invalid message format" } }));
    return;
  }

  if (validation.data.type === "create-new-room") {
    roomService.createNewRoom();
    return;
  }

  if (validation.data.type === "join-room") {
    roomService.joinRoom();
    return;
  }

  if (validation.data.type === "chat") {
    roomService.sendMessage();
    return;
  }

};
