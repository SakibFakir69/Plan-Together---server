
import { Server } from "socket.io";
import http from 'http';
import socketConfig from "../config/socket/socket.config";

let io:Server;

 

const initSocket = (mainServer:http.Server)=>{
   

   io=socketConfig(mainServer); 

   
    io.on("connection",(socket)=>{

        console.log("[Conncted User] : =>", socket.id)



      

        // 1-> pass socket argument to emitter
        // 2-> emitter conneect with socket and pass emitter ans listerner;
        // 3 -> send event to emmiter
        // 4 -> send  listner to emitter

        





        socket.on("disconnect",( )=>{
            console.log("[Disconnect] : this user => ",socket.id)
        })

    })



}


export default initSocket;




