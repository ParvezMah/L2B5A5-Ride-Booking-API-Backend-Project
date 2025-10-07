import express, { Request, Response } from "express"
import router from "./app/routes";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";
import cors from "cors";
import expressSession from "express-session"
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import passport from "passport";

const app = express();
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.set("trust proxy", 1);
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


app.use(passport.initialize())
app.use(passport.session())
app.use(expressSession({
    secret : envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
))


app.use("/api/v1", router);


app.get("/", (req:Request, res:Response)=>{
    res.status(200).json({
        message: "Welcome to Our Organized Ride Booking API"
    })
})

// Global Error Handler
app.use(globalErrorHandler);


// Route Not Found
app.use(notFound)



export default app;