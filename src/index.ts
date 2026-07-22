import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import { userRouter } from './modules/users/user.route';
import { authRouter } from './modules/auth/auth.route';
import { GlobalErrorHandler } from './middlewares/global-error-hander';
import { workSpaceRouter } from './modules/workspace/workspace.route';
import socketConfig from './config/socket/socket.config';
import { taskRouter } from './modules/task/task.route';


const app= express();


// MIDDLEWARE
app.use(express.json())



// API
app.use('/api/v1/users',userRouter);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/workspace',workSpaceRouter);
app.use('/api/v1/task', taskRouter);

// NOT FOUNDED
app.use((req,res)=>{
    res.status(404).json({
        success:false,message:`This ${req.url}  Route not founded`
    })
})
// GlOBAL ERROR
app.use(GlobalErrorHandler);

// EXPORT APP
export default app;