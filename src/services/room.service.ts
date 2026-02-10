import WebSocket from "ws";
import { nanoid } from "nanoid";


export const createNewRoom = (
     socket:WebSocket,
     payload: { Username: string },
     socketsInfo: Map<WebSocket, {roomId: string, name: string}>)=>{
        const roomId = nanoid(6);
        socketsInfo.set(socket,{
            roomId,
            name : payload.Username,
        })

        socket.send(JSON.stringify({ type: "room-created", payload: { roomId } }));
}



export const joinRoom = (
    socket: WebSocket,
    payload: { Username: string; roomId: string },
    socketsInfo: Map<WebSocket, {roomId: string, name: string}>)=>{
        let roomExists = false;
        socketsInfo.forEach((info)=>{
            if(info.roomId === payload.roomId){
                roomExists = true;
            }
        })

        if(!roomExists){
            socket.send(JSON.stringify({ type: "error", payload: { message: "Room doesn't exist" }}));
            return;
        }

        socketsInfo.set(socket,{
            roomId : payload.roomId,
            name : payload.Username,
        })
        socket.send(JSON.stringify({ type: "room-joined", payload: { roomId: payload.roomId } }));
}



export const sendMessage = (
    socket: WebSocket,
    payload: { roomId: string; message: string },
    socketsInfo: Map<WebSocket, {roomId: string, name: string}>)=>{
        const senderInfo = socketsInfo.get(socket);
        if(!senderInfo) return;

        socketsInfo.forEach((socketKey, clientSocket)=>{
            if(socketKey.roomId === payload.roomId && clientSocket.readyState === WebSocket.OPEN){
                clientSocket.send(JSON.stringify({ type: "chat", payload: {
                    message : payload.message,
                    sender : senderInfo.name,
                }}))
            }
        })
}



export const leaveRoom = (socket: WebSocket, socketsInfo: Map<WebSocket, {roomId: string, name: string}>)=>{
    const userInfo = socketsInfo.get(socket);
    if(!userInfo) return;

    socketsInfo.delete(socket);
    console.log(`${userInfo.name} left the room ${userInfo.roomId}`);  
}