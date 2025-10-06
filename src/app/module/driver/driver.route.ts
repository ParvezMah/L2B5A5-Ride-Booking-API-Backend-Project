import { validateRequest } from '../../middlewares/validateRequest';
import { DriverControllers } from './driver.controller';
import { Router } from "express";
import { createDriverZodSchema } from './driver.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';



const router = Router()


router.post(  "/apply-driver",  
    checkAuth(Role.RIDER),  
    // multerUpload.single("file"),  
    validateRequest(createDriverZodSchema),  
    DriverControllers.applyAsDriver
);

router.get("/me", checkAuth(Role.DRIVER), DriverControllers.getMyProfile);
router.patch("/me",checkAuth(Role.DRIVER),DriverControllers.updateMyProfile); // Not tested in Postman

// first make get all drivers for admin
router.get("/",checkAuth(Role.ADMIN),DriverControllers.getAllDrivers);
router.patch("/approve/:id",checkAuth(Role.ADMIN),DriverControllers.approveDriver);
router.get("/:id",checkAuth(Role.ADMIN,Role.DRIVER),DriverControllers.getSingleDriver);


export const DriverRoutes = router