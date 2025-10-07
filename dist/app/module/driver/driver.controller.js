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
exports.DriverControllers = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const driver_service_1 = require("./driver.service");
const sendResponse_1 = require("../../utils/sendResponse");
// Apply as Driver (for RIDERs)
const applyAsDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    // const payload =  {
    //   ...req.body,
    //   drivingLicense: req.file?.path,
    // }
    const payload = {
        userId: user.userId,
        vehicle: {
            vehicleNumber: req.body.vehicle.vehicleNumber,
            vehicleType: req.body.vehicle.vehicleType,
        },
        location: {
            type: "Point",
            coordinates: req.body.location.coordinates || [90.4125, 23.8103]
        },
        drivingLicense: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
    };
    const result = yield driver_service_1.DriverServices.applyAsDriver(user, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Driver application submitted successfully",
        data: result,
    });
}));
const getMyProfile = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = req.user;
    const result = yield driver_service_1.DriverServices.getMyProfile(driver.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Driver profile retrieved successfully",
        data: result,
    });
}));
const updateMyProfile = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = req.user;
    const result = yield driver_service_1.DriverServices.updateMyProfile(driver.userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Driver profile updated successfully",
        data: result,
    });
}));
const getAllDrivers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield driver_service_1.DriverServices.getAllDrivers(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All drivers retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield driver_service_1.DriverServices.getSingleDriver(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Driver retrieved successfully",
        data: result,
    });
}));
const approveDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const result = yield driver_service_1.DriverServices.approveDriver(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Driver approved and role updated successfully",
        data: result,
    });
}));
const suspendDriver = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const result = yield driver_service_1.DriverServices.suspendDriver(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Driver suspended successfully',
        data: result,
    });
}));
const updateDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payload = req.body;
    const result = yield driver_service_1.DriverServices.updateDriver(id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Driver updated successfully",
        data: result,
    });
}));
const updateOnlineStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const { onlineStatus } = req.body;
    const updatedDriver = yield driver_service_1.DriverServices.updateOnlineStatus(driverId, onlineStatus);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Driver online status updated successfully",
        data: updatedDriver,
    });
}));
const updateLocation = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const updatedDriver = yield driver_service_1.DriverServices.updateLocation(driverId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Driver location updated successfully",
        data: updatedDriver,
    });
}));
const updateRidingStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const { ridingStatus } = req.body;
    const updatedDriver = yield driver_service_1.DriverServices.updateRidingStatus(driverId, ridingStatus);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Driver riding status updated successfully",
        data: updatedDriver,
    });
}));
exports.DriverControllers = {
    applyAsDriver,
    getMyProfile,
    updateMyProfile,
    getAllDrivers,
    getSingleDriver,
    approveDriver,
    suspendDriver,
    updateDriver,
    updateOnlineStatus,
    updateLocation,
    updateRidingStatus
};
