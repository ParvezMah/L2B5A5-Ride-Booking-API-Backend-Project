import { Server } from "http"
import app from "./app";
import { envVars } from "./app/config/env";
import mongoose from "mongoose";


let server: Server;


const startServer = async()=>{
    try {
        console.log(envVars.NODE_ENV);
        await mongoose.connect(envVars.DB_URL);
        console.log('Connected to DB!!')

        
        server = app.listen(envVars.PORT, ()=>{
            console.log(`Server is Listening at Port ${envVars.PORT}`);
        });
    } catch (error) {
        console.log(error)
    }
}

startServer()