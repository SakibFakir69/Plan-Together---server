
import mongoose from "mongoose";
import http from 'http';
import httpServerApp from ".";
import initSocket from "./sockets/socket";

if(!process.env.PORT)
{
    throw new Error( "PORT env not founded");
}

const PORT = process.env.PORT as string;

// SOCKET
const httpServerAppSocket =http.createServer(httpServerApp);
initSocket(httpServerAppSocket);


(async()=>{

    try {
        if(!process.env.MONGO_URL)
        {
            throw new Error("Please provide mongodb url")
        }
       await mongoose.connect(process.env.MONGO_URL)
        .then((res)=>{
            console.log("[ MongoDB connected ]")
        })
        .catch((error)=>{
            console.log("[MongoDB]", error)
        })

        httpServerApp.listen(PORT, ()=>{
            console.log("[PORT]: [ SOCKET.IO, EXPRESS] APP RUNNING BY PORT",PORT )
        })
        
    } catch (error) {
        console.log(error);
        
    }

})();

// HANDEL ERRORFOR SERVER AND DEPLOY