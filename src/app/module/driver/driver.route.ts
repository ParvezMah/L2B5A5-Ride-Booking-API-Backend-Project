import { validateRequest } from '../../middlewares/validateRequest';
import { DriverControllers } from './driver.controller';
import { Router } from "express";
import { createDriverZodSchema, updateDriverZodSchema } from './driver.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';



const router = Router()


router.post( "/apply-driver", checkAuth(Role.RIDER), validateRequest(createDriverZodSchema), DriverControllers.applyAsDriver);
router.get("/me", checkAuth(Role.DRIVER), DriverControllers.getMyProfile);

// first make get all drivers for admin
router.get("/",checkAuth(Role.ADMIN), DriverControllers.getAllDrivers);
router.patch("/approve/:id",checkAuth(Role.ADMIN), DriverControllers.approveDriver);
router.get("/:id",checkAuth(Role.ADMIN,Role.DRIVER), DriverControllers.getSingleDriver);
router.patch('/suspend/:id', checkAuth(Role.ADMIN), DriverControllers.suspendDriver);


router.patch("/:id",  checkAuth(Role.DRIVER), validateRequest(updateDriverZodSchema), DriverControllers.updateDriver);
router.patch("/online-status/:id", checkAuth(Role.DRIVER), DriverControllers.updateOnlineStatus);
router.patch("/location/:id", checkAuth(Role.DRIVER), DriverControllers.updateLocation);
router.patch("/riding-status/:id", checkAuth(Role.DRIVER), DriverControllers.updateRidingStatus);


export const DriverRoutes = router