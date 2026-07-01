import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import initSocket from "./sockets/socket";
import http from 'http'
import { userRouter } from './modules/users/user.route';
import { authRouter } from './modules/auth/user.route';


const app= express();


// MIDDLEWARE
app.use(express.json())

// SOCKET
const httpServerApp =http.createServer(app);
initSocket(httpServerApp);

// API
app.use('/api/v1/users',userRouter);
app.use('/api/v1/auth',authRouter);


// NOT FOUNDED
app.use((req,res)=>{
    res.status(404).json({
        success:false,message:`This ${req.url}  Route not founded`
    })
})
// GlOBAL ERROR



// EXPORT APP
export default httpServerApp;