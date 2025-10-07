import { Router } from "express";
import { UserRoutes } from "../module/user/user.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { DriverRoutes } from "../module/driver/driver.route";
import { RideRoutes } from "../module/ride/ride.route";


const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/driver",
        route: DriverRoutes
    },
    {
        path: "/ride",
        route: RideRoutes
    }
]

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route);
})

export default router;