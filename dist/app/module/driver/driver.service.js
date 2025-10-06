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
exports.DriverServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_model_1 = require("../user/user.model");
const driver_model_1 = require("./driver.model");
const ride_model_1 = require("../ride/ride.model");
const applyAsDriver = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user has already applied
    const existing = yield driver_model_1.Driver.findOne({ userId: user.userId });
    console.log(existing);
    if (existing) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You have already applied as a driver");
    }
    const driverData = Object.assign(Object.assign({}, payload), { userId: user.userId, status: "Pending" });
    console.log(driverData);
    const newDriver = yield driver_model_1.Driver.create(driverData);
    return newDriver;
});
const getMyProfile = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    // const driver =  await Driver.findOne({userId:driverId})
    const driver = yield driver_model_1.Driver.findOne({ userId: new mongoose_1.Types.ObjectId(driverId) });
    console.log("getMyProfile drive : ", driver);
    return driver;
});
const updateMyProfile = (driverId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield driver_model_1.Driver.findOneAndUpdate({ userId: driverId }, { $set: payload }, { new: true });
});
const getAllDrivers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(driver_model_1.Driver.find(), query);
    const driverData = queryBuilder.filter().search([]).sort().fields().paginate();
    const [data, meta] = yield Promise.all([
        driverData.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const getSingleDriver = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(id);
    if (!driver) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    return driver;
});
const approveDriver = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("DriverService userId : ", id);
    const driver = yield driver_model_1.Driver.findById(id); // It's not a best practise
    console.log("approveDriver Driver : ", driver);
    if (!driver) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    if (driver.status === "Approved") {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver is already approved");
    }
    // Update the driver status
    driver.status = "Approved";
    yield driver.save();
    // Update the user's role to 'DRIVER' if userId exists
    if (driver.userId) {
        yield user_model_1.User.findByIdAndUpdate(driver.userId, { role: "DRIVER" });
    }
    return driver;
});
const suspendDriver = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(id);
    // const driver = await Driver.findOne({_id:driverId}); // It's not a best practise
    if (!driver) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    if (driver.status === "Suspended") {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver is already suspended");
    }
    // Update the driver status
    driver.status = "Suspended";
    yield driver.save();
    return driver;
});
const updateDriver = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!driver) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    return driver;
});
const updateOnlineStatus = (driverId, onlineStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(driverId);
    if (!driver) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    driver.onlineStatus = onlineStatus;
    yield driver.save();
    return driver;
});
const updateLocation = (driverId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const location = payload;
    const driver = yield driver_model_1.Driver.findById(driverId);
    if (!driver) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    driver.location = {
        type: 'Point',
        coordinates: [location.coordinates[0], location.coordinates[1]],
    };
    yield driver.save();
    return driver;
});
const updateRidingStatus = (driverId, ridingStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(driverId);
    if (!driver) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    driver.ridingStatus = ridingStatus;
    yield driver.save();
    // ✅ Sync with current active ride
    const activeRide = yield ride_model_1.Ride.findOne({
        driverId: driver._id,
        rideStatus: { $in: ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
    });
    if (activeRide) {
        switch (ridingStatus) {
            case "waiting_for_pickup":
                activeRide.rideStatus = "ACCEPTED";
                break;
            case "in_transit":
                activeRide.rideStatus = "IN_TRANSIT";
                break;
            case "idle":
            case "unavailable":
                // Optionally, cancel or pause ride if needed
                break;
        }
        yield activeRide.save();
    }
    return driver;
});
exports.DriverServices = {
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
