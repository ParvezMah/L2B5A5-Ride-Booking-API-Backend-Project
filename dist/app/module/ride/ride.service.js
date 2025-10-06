"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const ride_model_1 = require("./ride.model");
const driver_model_1 = require("../driver/driver.model");
const haversine_1 = require("../../utils/haversine");
const mongoose_1 = require("mongoose");
const user_interface_1 = require("../user/user.interface");
const getAllRides = () => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({}).sort({ "timestamps.requestedAt": -1 });
    return rides;
});
const requestRide = (riderId, rideData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // 1. Check if rider already has an ongoing ride
    const ongoingRide = yield ride_model_1.Ride.findOne({
        riderId,
        rideStatus: { $in: ["REQUESTED", "ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
    });
    if (ongoingRide) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already have an ongoing ride.");
    }
    // 2. Get all drivers who are online and idle
    const allAvailableDrivers = yield driver_model_1.Driver.find({
        onlineStatus: "Active",
        ridingStatus: "idle",
        location: { $exists: true },
    });
    // 3. Find the nearest driver using Haversine
    const [pickupLng, pickupLat] = ((_a = rideData.pickupLocation) === null || _a === void 0 ? void 0 : _a.coordinates) || [0, 0];
    let nearestDriver = null;
    let minDistance = Infinity;
    for (const driver of allAvailableDrivers) {
        if (!((_b = driver.location) === null || _b === void 0 ? void 0 : _b.coordinates))
            continue;
        const [driverLng, driverLat] = driver.location.coordinates;
        const distance = (0, haversine_1.haversineDistance)(pickupLat, pickupLng, driverLat, driverLng);
        if (distance < minDistance && distance <= 5000) {
            minDistance = distance;
            nearestDriver = driver;
        }
    }
    if (!nearestDriver) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "No available drivers nearby.");
    }
    // 4. Create ride
    const ride = yield ride_model_1.Ride.create({
        riderId,
        driverId: nearestDriver._id,
        pickupLocation: rideData.pickupLocation,
        destination: rideData.destination,
        paymentMethod: rideData.paymentMethod || "CASH",
        rideStatus: "REQUESTED",
        timestamps: { requestedAt: new Date() },
        fare: rideData.fare || 0,
    });
    // 5. Update driver status
    // nearestDriver.ridingStatus = "waiting_for_pickup";
    // await nearestDriver.save();
    return {
        ride,
        allAvailableDrivers,
    };
});
const getRiderRides = (riderId, page, limit, rideStatus, startDate, endDate, minFare, maxFare) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = { riderId };
    // filter by status
    if (rideStatus) {
        filter.rideStatus = rideStatus;
    }
    // filter by date range
    if (startDate && endDate) {
        filter.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }
    // filter by fare range
    if (minFare !== undefined || maxFare !== undefined) {
        filter.fare = {};
        if (minFare !== undefined)
            filter.fare.$gte = minFare;
        if (maxFare !== undefined)
            filter.fare.$lte = maxFare;
    }
    const skip = (page - 1) * limit;
    const rides = yield ride_model_1.Ride.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("driverId", "name vehicleType phone")
        .exec();
    const total = yield ride_model_1.Ride.countDocuments(filter);
    return {
        rides,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
});
const cancelRide = (user, rideId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride)
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found.");
    const userId = new mongoose_1.Types.ObjectId(user.userId);
    // Rider can cancel only their own rides
    if (user.role === user_interface_1.Role.RIDER && !ride.riderId.equals(userId)) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You can only cancel your own rides.");
    }
    // Driver can cancel only assigned rides
    if (user.role === user_interface_1.Role.DRIVER && !((_a = ride.driverId) === null || _a === void 0 ? void 0 : _a.equals(userId))) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You can only cancel rides assigned to you.");
    }
    // Only REQUESTED or ACCEPTED rides can be cancelled
    if (!["REQUESTED", "ACCEPTED"].includes((_b = ride.rideStatus) !== null && _b !== void 0 ? _b : "")) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride can only be cancelled before pickup.");
    }
    ride.rideStatus = "CANCELLED";
    ride.timestamps.cancelledAt = new Date(); // cancel timestamp
    yield ride.save();
    return ride;
});
// Now Driver can accept ride
const acceptRide = (driverId, rideId) => __awaiter(void 0, void 0, void 0, function* () {
    const driverDoc = yield driver_model_1.Driver.findOne({ userId: driverId });
    if (!driverDoc)
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver profile not found.");
    if (driverDoc.status !== "Approved")
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Driver is not approved.");
    if (driverDoc.isOnRide)
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver is already on another ride.");
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride)
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found.");
    if (ride.rideStatus !== "REQUESTED")
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride already accepted or not available.");
    ride.driverId = new mongoose_1.Types.ObjectId(driverId);
    ride.rideStatus = "ACCEPTED";
    ride.timestamps.acceptedAt = new Date();
    yield ride.save();
    driverDoc.isOnRide = true;
    driverDoc.ridingStatus = "waiting_for_pickup";
    yield driverDoc.save();
    return ride;
});
exports.RideService = {
    getAllRides,
    // Rider's Control
    requestRide,
    getRiderRides,
    cancelRide,
    acceptRide
};
