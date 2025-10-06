/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { IDriver } from "./driver.interface";
import { DriverServices } from "./driver.service";
import { sendResponse } from "../../utils/sendResponse";


// Apply as Driver (for RIDERs)
const applyAsDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as JwtPayload;

  // const payload =  {
  //   ...req.body,
  //   drivingLicense: req.file?.path,
  // }
  const payload:IDriver = {
 userId: user.userId,
  vehicle: {
    vehicleNumber: req.body.vehicle.vehicleNumber,
    vehicleType: req.body.vehicle.vehicleType,
  },
  location: {
    type: "Point",
    coordinates: req.body.location.coordinates || [90.4125, 23.8103]
  },
  drivingLicense: req.file?.path,
};


  console.log(payload)

  const result = await DriverServices.applyAsDriver(user, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver application submitted successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const driver = req.user as JwtPayload;

  // console.log(driver)

  const result = await DriverServices.getMyProfile(driver.userId);

  // console.log(result)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver profile retrieved successfully",
    data: result,
  });
});







export const DriverControllers = {
    applyAsDriver,
    getMyProfile
}