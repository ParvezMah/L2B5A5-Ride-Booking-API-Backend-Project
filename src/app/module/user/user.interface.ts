import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export enum UserStatus {
  BLOCKED = "BLOCKED",
  UNBLOCKED = "UNBLOCKED"
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IVehicleInfo {
  model: string;
  plateNumber: string;
  color: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: Role;
  picture?: string;
  status?: UserStatus;
  isBlocked?: boolean;
  isActive?: boolean;
  auths: IAuthProvider[];
  isApproved?: boolean;
  vehicleInfo?: IVehicleInfo;
  totalEarnings?: number;
  currentLocation?: {
    type: "Point";
    coordinates: [number, number];
  };
  rides?: Types.ObjectId[];
  averageRating?: number;
  totalRatings?: number;
  address?: string;
}