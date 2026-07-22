import { Server } from "socket.io"
import http from 'http'

let io: Server | null = null;

const socketConfig = (mainServer: http.Server) => {

    if (io) return io;

    io = new Server(mainServer, {

        cors: {
            origin: "*",
            methods: ["GET", "POST", "PATCH", "DELETE", "*"],
            credentials: true,

        }
    })

    return io;

}

export const getIo = (): Server => {

    if (!io) throw new Error("Socket.io not initialized.");
    return io;

}

export default socketConfig;

