"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, enum: ["google", "credentials"], required: true },
    providerId: { type: String, required: true },
}, { _id: false, versionKey: false });
const vehicleInfoSchema = new mongoose_1.Schema({
    model: { type: String, required: true },
    plateNumber: { type: String, required: true },
    color: { type: String, required: true },
}, { _id: false, versionKey: false });
const locationSchema = new mongoose_1.Schema({
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
}, { _id: false, versionKey: false });
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String },
    password: { type: String },
    picture: { type: String },
    status: {
        type: String,
        enum: Object.values(user_interface_1.UserStatus),
        default: user_interface_1.UserStatus.UNBLOCKED,
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        required: true,
        default: user_interface_1.Role.RIDER,
    },
    isBlocked: { type: Boolean, default: false },
    isActive: {
        type: Boolean,
        default: true,
    },
    auths: { type: [authProviderSchema] },
    currentLocation: { type: locationSchema },
    isApproved: { type: Boolean, default: false },
    vehicleInfo: { type: vehicleInfoSchema },
    totalEarnings: { type: Number, default: 0 },
    rides: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Ride" }],
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    address: { type: String },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
