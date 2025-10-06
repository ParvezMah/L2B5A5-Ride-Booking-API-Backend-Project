"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const ride_controller_1 = require("./ride.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const ride_validation_1 = require("./ride.validation");
const router = (0, express_1.Router)();
// Admin's Control
router.get("/all", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), ride_controller_1.RideControllers.getAllRides); // Postman e pore test korbo
// Rider's Control
// Rider can reuest for ride
router.post("/request", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER, user_interface_1.Role.DRIVER, user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(ride_validation_1.createRideZodSchema), ride_controller_1.RideControllers.requestRide);
// Rider can check his own rides
router.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER), ride_controller_1.RideControllers.getRiderRides);
// Rider can cancels his rides
router.patch("/:id/cancel", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER, user_interface_1.Role.DRIVER), ride_controller_1.RideControllers.cancelRide);
router.patch("/:id/accept", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), ride_controller_1.RideControllers.acceptRide);
exports.RideRoutes = router;
