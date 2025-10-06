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



export const DriverRoutes = router