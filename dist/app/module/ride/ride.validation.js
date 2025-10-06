"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRideZodSchema = void 0;
const zod_1 = require("zod");
const locationSchema = zod_1.z.object({
    type: zod_1.z.literal("Point"),
    coordinates: zod_1.z
        .tuple([
        zod_1.z.number({ error: "Longitude is required" }),
        zod_1.z.number({ error: "Latitude is required" }),
    ]),
    address: zod_1.z.string().optional(),
});
const paymentMethodEnum = zod_1.z.enum(["CASH", "CARD", "WALLET"]);
const paymentStatusEnum = zod_1.z.enum(["PENDING", "PAID", "FAILED"]);
const riderFeedbackSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5),
    feedback: zod_1.z.string().max(500).optional(),
});
const driverFeedbackSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5),
    feedback: zod_1.z.string().max(500).optional(),
});
exports.createRideZodSchema = zod_1.z.object({
    driverId: zod_1.z.string().optional(),
    pickupLocation: locationSchema,
    destination: locationSchema,
    rideStatus: zod_1.z.enum(["REQUESTED", "ACCEPTED", "COMPLETED", "PICKED_UP", "CANCELLED", "IN_TRANSIT", "REJECTED"]).default("REQUESTED"),
    rejectedDrivers: zod_1.z.array(zod_1.z.string()).optional(),
    // ✅ Payment required on create
    paymentMethod: paymentMethodEnum,
    paymentStatus: paymentStatusEnum.default("PENDING"),
    timestamps: zod_1.z.object({
        requestedAt: zod_1.z.union([zod_1.z.string(), zod_1.z.date()]).transform((val) => new Date(val)),
        acceptedAt: zod_1.z.union([zod_1.z.string(), zod_1.z.date()]).optional().transform((val) => val ? new Date(val) : undefined),
        completedAt: zod_1.z.union([zod_1.z.string(), zod_1.z.date()]).optional().transform((val) => val ? new Date(val) : undefined),
        cancelledAt: zod_1.z.union([zod_1.z.string(), zod_1.z.date()]).optional().transform((val) => val ? new Date(val) : undefined),
    }),
    fare: zod_1.z.number().optional(),
    riderFeedback: riderFeedbackSchema.optional(),
    driverFeedback: driverFeedbackSchema.optional(),
});
