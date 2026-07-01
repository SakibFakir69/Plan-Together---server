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
app.use((req,res)=>{
    res.status(404).json({
        success:false,message:`This ${req.url}  Route not founded`
    })
})
// global error


// EXPORT APP
export default app;