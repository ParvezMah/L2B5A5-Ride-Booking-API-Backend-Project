import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/appError";
import { IRide } from "./ride.interface";
import { Ride } from "./ride.model";
import { Driver } from "../driver/driver.model";
import { haversineDistance } from "../../utils/haversine";

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

export const RideService = {
    getAllRides,

    // Rider's Control
    requestRide
}