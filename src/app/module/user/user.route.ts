import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


const router = Router();

router.post("/register",validateRequest(createUserZodSchema),UserControllers.createUser);
router.get("/all-users",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers);
router.patch("/:id", UserControllers.updateUser)

export const UserRoutes = router;