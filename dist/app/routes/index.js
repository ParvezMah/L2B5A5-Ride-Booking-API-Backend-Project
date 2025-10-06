"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../module/user/user.route");
const auth_route_1 = require("../module/auth/auth.route");
const driver_route_1 = require("../module/driver/driver.route");
const ride_route_1 = require("../module/ride/ride.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/driver",
        route: driver_route_1.DriverRoutes
    },
    {
        path: "/ride",
        route: ride_route_1.RideRoutes
    }
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
