import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


const router = Router();

router.post("/register",validateRequest(createUserZodSchema),UserControllers.createUser);
router.patch("/:id", validateRequest(updateUserZodSchema),checkAuth(...Object.values(Role)), UserControllers.updateUser)
router.get("/me", checkAuth(...Object.values(Role)),UserControllers.getMe);

// Admin's Control
router.get("/admin", checkAuth(Role.ADMIN), UserControllers.getAdminStatsController); 
router.get("/all-users",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers);
router.get("/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser);
router.patch("/block/:id", checkAuth(Role.ADMIN), UserControllers.updateUserStatus);


export const UserRoutes = router;