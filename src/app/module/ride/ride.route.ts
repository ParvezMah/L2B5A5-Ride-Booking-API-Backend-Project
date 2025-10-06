import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RideControllers } from "./ride.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideZodSchema } from "./ride.validation";



const router = Router();

// Admin's Control
router.get("/all", checkAuth(Role.ADMIN), RideControllers.getAllRides);  


// Rider's Control
// Rider can reuest for ride
router.post("/request",checkAuth(Role.RIDER,Role.DRIVER,Role.ADMIN),validateRequest(createRideZodSchema),RideControllers.requestRide);
// Rider can check his own rides
router.get("/me",checkAuth(Role.RIDER),RideControllers.getRiderRides);
// Rider can cancels his rides
router.patch("/:id/cancel",checkAuth(Role.RIDER,Role.DRIVER),RideControllers.cancelRide);


router.patch("/:id/accept",checkAuth(Role.DRIVER),RideControllers.acceptRide);  // TEst kora jay nai ekhono
router.get("/earnings/me",checkAuth(Role.DRIVER),RideControllers.getDriverEarnings);
router.get("/available",checkAuth(Role.DRIVER),RideControllers.getAvailableRides);

export const RideRoutes = router;