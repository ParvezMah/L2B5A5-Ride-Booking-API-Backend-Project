import { Server } from "http"
import app from "./app";


let server: Server;

const PORT = 5000;


const startServer = async()=>{
    try {
        server = app.listen(PORT, ()=>{
            console.log(`Server is Listening at Port ${PORT}`);
        });
    } catch (error) {
        console.log(error)
    }
}

startServer()