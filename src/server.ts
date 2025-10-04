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



process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})