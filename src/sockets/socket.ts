
import { Server } from "socket.io";
import http from 'http';
import socketConfig from "../config/socket/socket.config";
import { ACCEPT_INVITE, RECEIVE_INVITE, REJECT_INVITE, SEND_INVITE } from "./emitters/emitter.invite";
import { ACCEPT_INVITE_FN, REJECT_INVITE_FN, SEND_AND_RECEIVE_INVITE, SEND_AND_RECEIVE_INVITE_FN } from "./events/event.invite";

let io: Server;

const onlineUsers = new Map<string, string>();


const initSocket = (mainServer: http.Server) => {



    io = socketConfig(mainServer);


    io.on("connection", (socket) => {

        console.log("[Conncted User] : =>", socket.id)
        onlineUsers.set("name", socket.id);



        socket.on(SEND_INVITE, (data) => {
          SEND_AND_RECEIVE_INVITE_FN(io,socket,data);
        })

        socket.on(ACCEPT_INVITE,(data)=>{
            ACCEPT_INVITE_FN(io,socket,data);
         
        })
        socket.on(REJECT_INVITE,(data)=>{
          REJECT_INVITE_FN(io,socket,data);
        })
        // TASK SHARE   
        


   




        console.log(onlineUsers);


        socket.on("disconnect", () => {
            console.log("[Disconnect] : this user => ", socket.id)
        })

    })



}


export default initSocket;




