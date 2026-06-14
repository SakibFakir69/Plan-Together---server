import app from ".";

if(!process.env.PORT)
{
    throw new Error( "PORT env not founded");
}

const PORT = process.env.PORT as string;


(()=>{

    try {
        app.listen(PORT, ()=>{
            console.log("[PORT]: [ SOCKET.IO, EXPRESS] APP RUNNING BY PORT",PORT )
        })
        
    } catch (error) {
        console.log(error);
        
    }

})();

// HANDEL ERRORFOR SERVER AND DEPLOY