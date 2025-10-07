/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/appError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { User } from "../user/user.model";
import { IDriver } from "./driver.interface";
import { Driver } from "./driver.model";
import { Ride } from "../ride/ride.model";


const applyAsDriver = async (user: any, payload: IDriver) => {
  // Check if user has already applied
  const existing = await Driver.findOne({ userId: user.userId });
  if (existing) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already applied as a driver");
  }

  const driverData = {
    ...payload,
    userId: user.userId,
    status: "Pending", // initially pending
  };

  const newDriver = await Driver.create(driverData);
  return newDriver;
};

const getMyProfile = async (driverId: string) => {
  // const driver =  await Driver.findOne({userId:driverId})
  const driver =  await Driver.findOne({userId:new Types.ObjectId(driverId)})
  return driver
};

const updateMyProfile = async (driverId: string, payload: any) => {
  return await Driver.findOneAndUpdate(
    { userId: driverId },
    { $set: payload },   
    { new: true }
  );
};

const getAllDrivers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Driver.find(), query);
  const driverData = queryBuilder.filter().search([]).sort().fields().paginate();

  const [data, meta] = await Promise.all([
    driverData.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getSingleDriver = async (id: string) => {
  const driver = await Driver.findById(id);
  
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }
  return driver;
};

const approveDriver = async (id: string) => {
  
  const driver = await Driver.findById(id); // It's not a best practise

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }


  if (driver.status === "Approved") {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver is already approved");
  }

  // Update the driver status
  driver.status = "Approved";
  await driver.save();

  // Update the user's role to 'DRIVER' if userId exists
  if (driver.userId) {
    await User.findByIdAndUpdate(driver.userId, { role: "DRIVER" });
  }

  return driver;
};

const suspendDriver = async (id: string) => {
  const driver = await Driver.findById(id);
  // const driver = await Driver.findOne({_id:driverId}); // It's not a best practise

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }

  if (driver.status === "Suspended") {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver is already suspended");
  }

  // Update the driver status
  driver.status = "Suspended";
  await driver.save();

  return driver;
};

const updateDriver = async (id: string, payload: Partial<IDriver>) => {
  const driver = await Driver.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }
  return driver;
};

const updateOnlineStatus = async (driverId: string, onlineStatus: 'Active' | 'Offline') => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }

  driver.onlineStatus = onlineStatus;
  await driver.save();
  return driver;
};

const updateLocation = async (driverId: string, payload : any) => {
  const location = payload
  
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }

  driver.location = {
    type: 'Point',
    coordinates: [location.coordinates[0], location.coordinates[1]],
  };
  await driver.save();
  return driver;
};

const updateRidingStatus = async (
  driverId: string,
  ridingStatus: 'idle' | 'waiting_for_pickup' | 'in_transit' | 'unavailable'
) => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }

  driver.ridingStatus = ridingStatus;
  await driver.save();

  // ✅ Sync with current active ride
  const activeRide = await Ride.findOne({
    driverId: driver._id,
    rideStatus: { $in: ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
  });

  if (activeRide) {
    switch (ridingStatus) {
      case "waiting_for_pickup":
        activeRide.rideStatus = "ACCEPTED";
        break;
      case "in_transit":
        activeRide.rideStatus = "IN_TRANSIT";
        break;
      case "idle":
      case "unavailable":
        // Optionally, cancel or pause ride if needed
        break;
    }
    await activeRide.save();
  }

  return driver;
};





export const DriverServices = {
    applyAsDriver,
    getMyProfile,
    updateMyProfile,
    getAllDrivers,
    getSingleDriver,
    approveDriver,
    suspendDriver,
    updateDriver,
    updateOnlineStatus,
    updateLocation,
    updateRidingStatus
}