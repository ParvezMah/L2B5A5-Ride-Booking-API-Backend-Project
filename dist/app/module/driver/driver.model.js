"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const DriverSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    vehicle: {
        vehicleNumber: { type: String, required: true },
        vehicleType: { type: String, enum: ['Bike', 'Car'], required: true },
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    onlineStatus: {
        type: String,
        enum: ['Active', 'Offline'],
        default: 'Offline',
    },
    ridingStatus: {
        type: String,
        enum: ['idle', 'waiting_for_pickup', 'in_transit', 'Complete', 'unavailable'],
        default: 'idle',
    },
    isOnRide: {
        type: Boolean,
        default: false,
    },
    totalEarning: {
        type: Number,
        default: 0,
    },
    drivingLicense: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Approved', 'Pending', 'Suspended'],
        default: 'Pending',
    },
    rating: {
        type: Number,
        default: 0,
    },
    rideHistory: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Ride',
        },
    ],
}, {
    timestamps: true,
});
exports.Driver = (0, mongoose_1.model)('Driver', DriverSchema);
