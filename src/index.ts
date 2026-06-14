import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import initSocket from "./sockets/socket";
import http from 'http'


const app= express();


// SOCKET
const httpServerApp =http.createServer(app);
initSocket(httpServerApp);



// EXPORT APP
export default app;