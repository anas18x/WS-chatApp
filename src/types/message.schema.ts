import { z } from "zod";

export const createRoomSchema = z.object({
    type: z.literal("create-new-room"),
    payload: z.object({
        Username : z.string(),
    })
})

export const joinRoomSchema = z.object({
    type: z.literal("join-room"),
    payload : z.object({
        Username : z.string(),
        roomId : z.string(),
    })
})
 
export const chatSchema = z.object({
    type: z.literal("chat"),
    payload : z.object({
        roomId : z.string(),
        message : z.string(),
    })
})

export const messageSchema = z.union([createRoomSchema, joinRoomSchema, chatSchema])