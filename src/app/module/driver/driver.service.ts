/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/appError";
import { IDriver } from "./driver.interface";
import { Driver } from "./driver.model";


const applyAsDriver = async (user: any, payload: IDriver) => {
  // Check if user has already applied
  const existing = await Driver.findOne({ userId: user.userId });
  console.log(existing)
  if (existing) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already applied as a driver");
  }

  const driverData = {
    ...payload,
    userId: user.userId,
    status: "Pending", // initially pending
  };

  console.log(driverData)

  const newDriver = await Driver.create(driverData);
  return newDriver;
};

const getMyProfile = async (driverId: string) => {
  return await Driver.findOne({userId:driverId})
};

export const DriverServices = {
    applyAsDriver,
    getMyProfile
}