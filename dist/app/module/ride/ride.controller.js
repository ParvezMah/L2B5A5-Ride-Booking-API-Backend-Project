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
exports.RideControllers = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const ride_service_1 = require("./ride.service");
const getAllRides = (0, catchAsync_1.catchAsync)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_service_1.RideService.getAllRides();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All rides retrieved successfully",
        data: result,
    });
}));
// Rider's Control
const requestRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rider = req.user;
    const riderId = rider.userId;
    const rideData = req.body;
    const result = yield ride_service_1.RideService.requestRide(riderId, rideData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Ride requested and driver matched successfully",
        data: result,
    });
}));
const getRiderRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rider = req.user;
    const riderId = rider.userId;
    // query params from frontend
    const { page = 1, limit = 10, status, startDate, endDate, minFare, maxFare } = req.query;
    const result = yield ride_service_1.RideService.getRiderRides(riderId, Number(page), Number(limit), status, startDate, endDate, minFare ? Number(minFare) : undefined, maxFare ? Number(maxFare) : undefined);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Rider's rides retrieved successfully",
        data: result,
    });
}));
const cancelRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const rideId = req.params.id;
    const result = yield ride_service_1.RideService.cancelRide({ userId: user.userId, role: user.role }, rideId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Ride cancelled successfully",
        data: result,
    });
}));
// Now Driver can accept ride
const acceptRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = req.user;
    const driverId = driver.userId;
    const rideId = req.params.id;
    const result = yield ride_service_1.RideService.acceptRide(driverId, rideId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Ride accepted successfully",
        data: result,
    });
}));
const getDriverEarnings = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = req.user;
    const driverId = driver.userId;
    const result = yield ride_service_1.RideService.getDriverEarnings(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Driver earnings retrieved successfully",
        data: result,
    });
}));
const getAvailableRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_service_1.RideService.getAvailableRides();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Available rides retrieved successfully",
        data: result,
    });
}));
exports.RideControllers = {
    getAllRides,
    // Rider's Control
    requestRide,
    getRiderRides,
    cancelRide,
    acceptRide, // test kora jay nai
    getDriverEarnings,
    getAvailableRides
};
