import express, { Request, Response } from "express"
import router from "./app/routes";
import cors from "cors";

const app = express();
app.use(cors())
app.use(express.json())


app.use("/api/v1", router);


app.get("/", (req:Request, res:Response)=>{
    res.status(200).json({
        message: "Welcome to Our Organized Ride Booking API"
    })
})



export default app;