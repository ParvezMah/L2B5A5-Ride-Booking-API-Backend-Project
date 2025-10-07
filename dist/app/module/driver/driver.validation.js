"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDriverZodSchema = exports.createDriverZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDriverZodSchema = zod_1.default.object({
    vehicle: zod_1.default.object({
        vehicleNumber: zod_1.default
            .string({ error: "Vehicle number is required" })
            .min(3, { message: "Vehicle number must be at least 3 characters." }),
        vehicleType: zod_1.default.enum(["Bike", "Car"], { message: "Vehicle type must be 'Bike' or 'Car'" }),
    }),
    location: zod_1.default.object({
        type: zod_1.default.literal('Point'),
        coordinates: zod_1.default.tuple([zod_1.default.number(), zod_1.default.number()])
    }),
    onlineStatus: zod_1.default
        .enum(["Active", "Offline"])
        .optional(),
    ridingStatus: zod_1.default
        .enum(["idle", "waiting_for_pickup", "in_transit", "unavailable"])
        .optional(),
    isOnRide: zod_1.default.boolean().optional(),
    totalEarning: zod_1.default
        .number()
        .min(0)
        .default(0)
        .optional(),
    status: zod_1.default
        .enum(["Approved", "Pending", "Suspended"])
        .optional(),
    rating: zod_1.default.number().min(0).max(5).optional(),
    rideHistory: zod_1.default
        .array(zod_1.default.string())
        .optional(),
});
exports.updateDriverZodSchema = zod_1.default.object({
    vehicle: zod_1.default
        .object({
        vehicleNumber: zod_1.default.string().min(3).optional(),
        vehicleType: zod_1.default.enum(["Bike", "Car"]).optional(),
    })
        .optional(),
    location: zod_1.default.object({
        type: zod_1.default.literal('Point'),
        coordinates: zod_1.default.tuple([zod_1.default.number(), zod_1.default.number()])
    }),
    onlineStatus: zod_1.default.enum(["Active", "Offline"]).optional(),
    ridingStatus: zod_1.default
        .enum(["idle", "waiting_for_pickup", "in_transit", "unavailable"])
        .optional(),
    isOnRide: zod_1.default.boolean().optional(),
    totalEarning: zod_1.default.number().min(0).optional(),
    nid: zod_1.default.string().optional(),
    drivingLicense: zod_1.default.string().optional(),
    status: zod_1.default.enum(["Approved", "Pending", "Suspended"]).optional(),
    rating: zod_1.default.number().min(0).max(5).optional(),
    rideHistory: zod_1.default.array(zod_1.default.string()).optional(),
});
