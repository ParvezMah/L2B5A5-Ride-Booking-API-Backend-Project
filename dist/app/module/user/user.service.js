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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const env_1 = require("../../config/env");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const driver_model_1 = require("../driver/driver.model");
const ride_model_1 = require("../ride/ride.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = payload, rest = __rest(payload, ["email", "password", "role"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign(Object.assign({ email, password: hashedPassword, auths: [authProvider], isApproved: true }, rest), { role: role !== null && role !== void 0 ? role : user_interface_1.Role.RIDER }));
    return user;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find();
    const totalUsers = yield user_model_1.User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserExist = yield user_model_1.User.findById(userId);
    if (!ifUserExist) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    // Role update restrictions
    if (payload.role) {
        if ([user_interface_1.Role.RIDER, user_interface_1.Role.DRIVER].includes(decodedToken.role)) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to change roles");
        }
        if (payload.role === user_interface_1.Role.SUPER_ADMIN && decodedToken.role === user_interface_1.Role.ADMIN) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to assign SUPER_ADMIN");
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, {
        $set: Object.assign({}, payload),
    }, { new: true, runValidators: true });
    if (!newUpdatedUser) {
        throw new appError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to update user");
    }
    return newUpdatedUser;
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId)
        .select("-password");
    return {
        data: user,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    return user;
});
const getAdminStatsService = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    // 1) Totals for users/drivers
    const [totalUsers, totalDrivers] = yield Promise.all([
        user_model_1.User.countDocuments({ role: { $ne: "ADMIN" } }), // optionally exclude admins
        driver_model_1.Driver.countDocuments({}), // or User.countDocuments({ role: "DRIVER" })
    ]);
    // 2) Total rides and revenue
    const ridesAgg = yield ride_model_1.Ride.aggregate([
        {
            $group: {
                _id: null,
                totalRides: { $sum: 1 },
                totalRevenue: { $sum: { $ifNull: ["$fare", 0] } },
                completedRides: { $sum: { $cond: [{ $eq: ["$rideStatus", "COMPLETED"] }, 1, 0] } },
            },
        },
    ]);
    const totalRides = (_b = (_a = ridesAgg[0]) === null || _a === void 0 ? void 0 : _a.totalRides) !== null && _b !== void 0 ? _b : 0;
    const totalRevenue = (_d = (_c = ridesAgg[0]) === null || _c === void 0 ? void 0 : _c.totalRevenue) !== null && _d !== void 0 ? _d : 0;
    const completedRides = (_f = (_e = ridesAgg[0]) === null || _e === void 0 ? void 0 : _e.completedRides) !== null && _f !== void 0 ? _f : 0;
    // 3) Rides by status
    const ridesByStatusArr = yield ride_model_1.Ride.aggregate([
        {
            $group: {
                _id: "$rideStatus",
                count: { $sum: 1 },
            },
        },
    ]);
    const ridesByStatus = {};
    ridesByStatusArr.forEach((r) => {
        ridesByStatus[r._id] = r.count;
    });
    // 4) Monthly rides & revenue trends (last 12 months)
    const now = new Date();
    const lastYear = new Date(now.getFullYear(), now.getMonth() - 11, 1); // start from month-11
    const monthlyAgg = yield ride_model_1.Ride.aggregate([
        {
            $match: {
                createdAt: { $gte: lastYear },
            },
        },
        {
            $project: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                fare: { $ifNull: ["$fare", 0] },
            },
        },
        {
            $group: {
                _id: { year: "$year", month: "$month" },
                rides: { $sum: 1 },
                revenue: { $sum: "$fare" },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    // convert aggregation into continuous last-12-months array with month labels
    const monthLabels = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthLabels.push({
            month: d.toLocaleString("en", { month: "short" }),
            year: d.getFullYear(),
            key: `${d.getFullYear()}-${d.getMonth() + 1}`,
        });
    }
    const monthlyMap = {};
    monthlyAgg.forEach((m) => {
        const key = `${m._id.year}-${m._id.month}`;
        monthlyMap[key] = { rides: m.rides, revenue: m.revenue };
    });
    const monthlyRides = monthLabels.map((lbl) => {
        var _a;
        const monthNum = lbl.year + "-" + (new Date(`${lbl.month} 1`).getMonth() + 1);
        // better key construction:
        const key = `${lbl.year}-${new Date(`${lbl.month} 1`).getMonth() + 1}`;
        const found = (_a = monthlyMap[key]) !== null && _a !== void 0 ? _a : { rides: 0, revenue: 0 };
        return { month: `${lbl.month} ${lbl.year}`, rides: found.rides };
    });
    const revenueTrends = monthLabels.map((lbl) => {
        var _a;
        const key = `${lbl.year}-${new Date(`${lbl.month} 1`).getMonth() + 1}`;
        const found = (_a = monthlyMap[key]) !== null && _a !== void 0 ? _a : { rides: 0, revenue: 0 };
        return { month: `${lbl.month} ${lbl.year}`, revenue: found.revenue };
    });
    // 5) Top drivers by earnings (sum of fares for rides they completed)
    const topDriversAgg = yield ride_model_1.Ride.aggregate([
        { $match: { driver: { $exists: true, $ne: null }, rideStatus: "COMPLETED" } },
        {
            $group: {
                _id: "$driverId",
                ridesCount: { $sum: 1 },
                earnings: { $sum: { $ifNull: ["$fare", 0] } },
            },
        },
        { $sort: { earnings: -1 } },
        { $limit: 10 },
        // populate driver fields by $lookup
        {
            $lookup: {
                from: "users", // collection name
                localField: "_id",
                foreignField: "_id",
                as: "driverInfo",
            },
        },
        {
            $unwind: { path: "$driverInfo", preserveNullAndEmptyArrays: true },
        },
        {
            $project: {
                driverId: "$_id",
                ridesCount: 1,
                earnings: 1,
                driverName: "$driverInfo.name",
                driverEmail: "$driverInfo.email",
                picture: "$driverInfo.picture",
            },
        },
    ]);
    // 6) Active drivers count (online now)
    const activeDriversCount = yield driver_model_1.Driver.countDocuments({ onlineStatus: true });
    // 7) Recent driver activity (last 7 days) — number of rides per day
    const last7 = new Date();
    last7.setDate(now.getDate() - 6);
    last7.setHours(0, 0, 0, 0);
    const last7Agg = yield ride_model_1.Ride.aggregate([
        { $match: { createdAt: { $gte: last7 } } },
        {
            $project: {
                day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            },
        },
        {
            $group: {
                _id: "$day",
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    const recentDriverActivity = last7Agg.map((d) => ({ date: d._id, rides: d.count }));
    return {
        totalUsers,
        totalDrivers,
        totalRides,
        completedRides,
        totalRevenue,
        ridesByStatus,
        monthlyRides,
        revenueTrends,
        topDrivers: topDriversAgg,
        activeDriversCount,
        recentDriverActivity,
    };
});
const updateUserStatus = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Object.values(user_interface_1.UserStatus).includes(status)) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid user status value");
    }
    const user = yield user_model_1.User.findById(userId);
    console.log(user);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    user.status = status;
    yield user.save();
    return user;
});
exports.UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    getMe,
    getSingleUser,
    getAdminStatsService,
    updateUserStatus
};
