import { Schema, model } from "mongoose";
import { IAuthProvider, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, enum: ["google", "credentials"], required: true },
    providerId: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const vehicleInfoSchema = new Schema(
  {
    model: { type: String, required: true },
    plateNumber: { type: String, required: true },
    color: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const locationSchema = new Schema(
  {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String },
    password: { type: String },
    picture: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
      default: Role.RIDER,
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
    rides: [{ type: Schema.Types.ObjectId, ref: "Ride" }],
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    address: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export const User = model<IUser>("User", userSchema);