/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/appError";
import { IRide } from "./ride.interface";
import { Ride } from "./ride.model";
import { Driver } from "../driver/driver.model";
import { haversineDistance } from "../../utils/haversine";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { Role } from "../user/user.interface";

const getAllRides = async () => {
  const rides = await Ride.find({}).sort({ "timestamps.requestedAt": -1 });
  return rides;
};

const requestRide = async (riderId: string, rideData: Partial<IRide>) => {
  // 1. Check if rider already has an ongoing ride
  const ongoingRide = await Ride.findOne({
    riderId,
    rideStatus: { $in: ["REQUESTED", "ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
  });

  if (ongoingRide) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have an ongoing ride."
    );
  }

  // 2. Get all drivers who are online and idle
  const allAvailableDrivers = await Driver.find({
    onlineStatus: "Active",
    ridingStatus: "idle",
    location: { $exists: true },
  });

  // 3. Find the nearest driver using Haversine
  const [pickupLng, pickupLat] = rideData.pickupLocation?.coordinates || [0, 0];

  let nearestDriver = null;
  let minDistance = Infinity;
  for (const driver of allAvailableDrivers) {
    if (!driver.location?.coordinates) continue;

    const [driverLng, driverLat] = driver.location.coordinates;

    const distance = haversineDistance(
      pickupLat,
      pickupLng,
      driverLat,
      driverLng
    );
 

    if (distance < minDistance && distance <= 5000) {
      minDistance = distance;
      nearestDriver = driver;
    }
  }

  if (!nearestDriver) {
    throw new AppError(httpStatus.NOT_FOUND, "No available drivers nearby.");
  }

  // 4. Create ride
  const ride = await Ride.create({
    riderId,
    driverId: nearestDriver._id,
    pickupLocation: rideData.pickupLocation,
    destination: rideData.destination,
   paymentMethod: rideData.paymentMethod || "CASH",
    rideStatus: "REQUESTED",
    timestamps: { requestedAt: new Date() },
    fare: rideData.fare || 0,
  });

  // 5. Update driver status
  // nearestDriver.ridingStatus = "waiting_for_pickup";
  // await nearestDriver.save();

  return {
    ride,
    allAvailableDrivers,
  };
};

const getRiderRides = async (
  riderId: string,
  page: number,
  limit: number,
  rideStatus?: string,
  startDate?: string,
  endDate?: string,
  minFare?: number,  
  maxFare?: number
) => {
  const filter: any = { riderId };
  

  // filter by status
  if (rideStatus) {
    filter.rideStatus = rideStatus;
  }

  // filter by date range
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // filter by fare range
  if (minFare !== undefined || maxFare !== undefined) {
    filter.fare = {};
    if (minFare !== undefined) filter.fare.$gte = minFare;
    if (maxFare !== undefined) filter.fare.$lte = maxFare;
  }

  const skip = (page - 1) * limit;

  const rides = await Ride.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("driverId", "name vehicleType phone")
    .exec();

  const total = await Ride.countDocuments(filter);

  return {
    rides,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

 const cancelRide = async (user: JwtPayload, rideId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError(httpStatus.NOT_FOUND, "Ride not found.");

  const userId = new Types.ObjectId(user.userId);

  // Rider can cancel only their own rides
  if (user.role === Role.RIDER && !ride.riderId.equals(userId)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only cancel your own rides."
    );
  }

  // Driver can cancel only assigned rides
  if (user.role === Role.DRIVER && !ride.driverId?.equals(userId)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only cancel rides assigned to you."
    );
  }

  // Only REQUESTED or ACCEPTED rides can be cancelled
  if (!["REQUESTED", "ACCEPTED"].includes(ride.rideStatus?? "")) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Ride can only be cancelled before pickup."
    );
  }

  ride.rideStatus = "CANCELLED";
  ride.timestamps.cancelledAt = new Date(); // cancel timestamp

  await ride.save();
  return ride;
};

// Now Driver can accept ride
const acceptRide = async (driverId: string, rideId: string) => {
  const driverDoc = await Driver.findOne({ userId: driverId });
  if (!driverDoc)
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not found.");
  if (driverDoc.status !== "Approved")
    throw new AppError(httpStatus.FORBIDDEN, "Driver is not approved.");
  if (driverDoc.isOnRide)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Driver is already on another ride."
    );

  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError(httpStatus.NOT_FOUND, "Ride not found.");
  if (ride.rideStatus !== "REQUESTED")
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Ride already accepted or not available."
    );

  ride.driverId = new Types.ObjectId(driverId);
  ride.rideStatus = "ACCEPTED";
  ride.timestamps.acceptedAt = new Date();
  await ride.save();

  driverDoc.isOnRide = true;
  driverDoc.ridingStatus = "waiting_for_pickup";
  await driverDoc.save();

  return ride;
};

const getDriverEarnings = async (driverId: string) => {
  const rides = await Ride.find({
    driverId,
    rideStatus: "COMPLETED",
  })
    .sort({ completedAt: -1 })
    .select("fare timestamps.completedAt riderId")
    .populate("riderId", "name phone");

  const totalEarnings = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0);

  return { totalEarnings, rideCount: rides.length, rides };
};

const getAvailableRides = async () => {
  const rides = await Ride.find({ rideStatus: "REQUESTED" }).sort({
    "timestamps.requestedAt": 1,
  });
  return rides;
};


export const RideService = {
    getAllRides,


    // Rider's Control
    requestRide,
    getRiderRides,
    cancelRide,

    acceptRide, // test kora jay nai
    getDriverEarnings,
    getAvailableRides
}