"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: zod_1.default
        .string({ error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: zod_1.default
        .string({ error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
    phone: zod_1.default
        .string({ error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    address: zod_1.default
        .string({ error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    role: zod_1.default
        .enum(Object.values(user_interface_1.Role))
        .optional()
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }).optional(),
    password: zod_1.default
        .string({ error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }).optional(),
    phone: zod_1.default
        .string({ error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    role: zod_1.default
        // .enum(["ADMIN", "GUIDE", "USER", "SUPER_ADMIN"])
        .enum(Object.values(user_interface_1.Role))
        .optional(),
    isActive: zod_1.default.boolean().optional(),
    isDeleted: zod_1.default
        .boolean({ error: "isDeleted must be true or false" })
        .optional(),
    isApproved: zod_1.default
        .boolean({ error: "isVerified must be true or false" })
        .optional(),
    address: zod_1.default
        .string({ error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    currentLocation: zod_1.default
        .object({
        type: zod_1.default.literal("Point"),
        coordinates: zod_1.default
            .array(zod_1.default.number())
            .length(2, { message: "Coordinates must be an array of [lng, lat]" }),
    })
        .optional(),
    isBlocked: zod_1.default.boolean().optional(),
    vehicleInfo: zod_1.default
        .object({
        model: zod_1.default
            .string({ error: "Vehicle model must be string" })
            .min(2, { message: "Vehicle model must be at least 2 characters long." })
            .max(100, { message: "Vehicle model cannot exceed 100 characters." }),
        plateNumber: zod_1.default
            .string({ error: "Vehicle plate number must be string" })
            .min(2, { message: "Vehicle plate number must be at least 2 characters long." })
            .max(20, { message: "Vehicle plate number cannot exceed 20 characters." }),
        color: zod_1.default
            .string({ error: "Vehicle color must be string" })
            .min(2, { message: "Vehicle color must be at least 2 characters long." })
            .max(50, { message: "Vehicle color cannot exceed 50 characters." })
    })
        .optional(),
});
