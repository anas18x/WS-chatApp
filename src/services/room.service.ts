import WebSocket from "ws";


export const createNewRoom = ()=>{}


export const joinRoom = ()=>{}


export const sendMessage = ()=>{}


export const leaveRoom = (socket: WebSocket, socketsInfo: Map<WebSocket, {roomId: string, name: string}>)=>{
    const userInfo = socketsInfo.get(socket);
    if(!userInfo) return;

    socketsInfo.delete(socket);
    console.log(`${userInfo.name} left the room ${userInfo.roomId}`);
     
}