import z from "zod";
import { Role } from "./user.interface";


export const createUserZodSchema = z.object({
        name: z
            .string({ error: "Name must be string" })
            .min(2, { message: "Name must be at least 2 characters long." })
            .max(50, { message: "Name cannot exceed 50 characters." }),
        email: z
            .string({ error: "Email must be string" })
            .email({ message: "Invalid email address format." })
            .min(5, { message: "Email must be at least 5 characters long." })
            .max(100, { message: "Email cannot exceed 100 characters." }),
        password: z
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
        phone: z
            .string({ error: "Phone Number must be string" })
            .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
                message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
            })
            .optional(),
        address: z
            .string({ error: "Address must be string" })
            .max(200, { message: "Address cannot exceed 200 characters." })
            .optional()
}) 

export const updateUserZodSchema = z.object({
    name: z
        .string({ error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }).optional(),
    password: z
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
    phone: z
        .string({ error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),
    role: z
        // .enum(["ADMIN", "GUIDE", "USER", "SUPER_ADMIN"])
        .enum(Object.values(Role) as [string])
        .optional(),
    isActive: z.boolean().optional(),
    isDeleted: z
        .boolean({ error: "isDeleted must be true or false" })
        .optional(),
    isApproved: z
        .boolean({ error: "isVerified must be true or false" })
        .optional(),
    address: z
        .string({ error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    currentLocation: z
        .object({
        type: z.literal("Point"),
        coordinates: z
            .array(z.number())
            .length(2, { message: "Coordinates must be an array of [lng, lat]" }),
        })
        .optional(),
    isBlocked: z.boolean().optional(),
    vehicleInfo: z
        .object({
    model: z
        .string({ error: "Vehicle model must be string" })
        .min(2, { message: "Vehicle model must be at least 2 characters long." })
        .max(100, { message: "Vehicle model cannot exceed 100 characters." }),
    plateNumber: z
        .string({ error: "Vehicle plate number must be string" })
        .min(2, { message: "Vehicle plate number must be at least 2 characters long." })
        .max(20, { message: "Vehicle plate number cannot exceed 20 characters." }),
    color: z
        .string({ error: "Vehicle color must be string" })
        .min(2, { message: "Vehicle color must be at least 2 characters long." })
        .max(50, { message: "Vehicle color cannot exceed 50 characters." })
        })
        .optional(),

    
})
