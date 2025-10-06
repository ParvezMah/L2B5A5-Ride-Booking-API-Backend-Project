import { z } from "zod";

const locationSchema = z.object({
  type: z.literal("Point"),
  coordinates: z
    .tuple([
      z.number({ error: "Longitude is required" }), 
      z.number({ error: "Latitude is required" }),
    ]),
  address: z.string().optional(),
});

const paymentMethodEnum = z.enum(["CASH", "CARD", "WALLET"]);
const paymentStatusEnum = z.enum(["PENDING", "PAID", "FAILED"]);

const riderFeedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().max(500).optional(),
});

const driverFeedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().max(500).optional(),
});


export const createRideZodSchema = z.object({
  driverId: z.string().optional(),
  pickupLocation: locationSchema,
  destination: locationSchema,
  rideStatus: z.enum(["REQUESTED", "ACCEPTED", "COMPLETED","PICKED_UP", "CANCELLED" ,"IN_TRANSIT","REJECTED"]).default("REQUESTED"),
  rejectedDrivers: z.array(z.string()).optional(),
  
  // ✅ Payment required on create
  paymentMethod: paymentMethodEnum,
  paymentStatus: paymentStatusEnum.default("PENDING"),
timestamps: z.object({
  requestedAt: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  acceptedAt: z.union([z.string(), z.date()]).optional().transform((val) => val ? new Date(val) : undefined),
  completedAt: z.union([z.string(), z.date()]).optional().transform((val) => val ? new Date(val) : undefined),
  cancelledAt: z.union([z.string(), z.date()]).optional().transform((val) => val ? new Date(val) : undefined),
}),
  fare: z.number().optional(),
  riderFeedback: riderFeedbackSchema.optional(),
  driverFeedback: driverFeedbackSchema.optional(),
});