import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RideControllers } from "./ride.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideZodSchema } from "./ride.validation";



const router = Router();


router.get("/all", checkAuth(Role.ADMIN), RideControllers.getAllRides);  // Postman e pore test korbo


// Rider's Control
router.post("/request",checkAuth(Role.RIDER,Role.DRIVER,Role.ADMIN),validateRequest(createRideZodSchema),RideControllers.requestRide);


export const RideRoutes = router;