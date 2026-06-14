import { Server } from "socket.io"
import http from 'http'

const socketConfig = (mainServer:http.Server)=>{

    return new Server(mainServer,{

        cors:{
            origin:"*",
            methods:["GET","POST","PATCH","DELETE","*"],
            credentials:true,

        }
    })

}

export default socketConfig;