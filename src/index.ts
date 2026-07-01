import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import initSocket from "./sockets/socket";
import http from 'http'
import { userRouter } from './modules/users/user.route';


const app= express();


// SOCKET
const httpServerApp =http.createServer(app);

initSocket(httpServerApp);


app.use('/api/v1/users',userRouter);

// not found
// global error


// EXPORT APP
export default app;