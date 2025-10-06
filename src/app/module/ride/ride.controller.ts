/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes"
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { RideService } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";



const getAllRides = catchAsync(async (_req: Request, res: Response, next: NextFunction) => {
  const result = await RideService.getAllRides();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All rides retrieved successfully",
    data: result,
  });
});

// Rider's Control
 const requestRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rider = req.user as JwtPayload;
    const riderId = rider.userId;
    const rideData = req.body;

    

    const result = await RideService.requestRide(riderId, rideData);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Ride requested and driver matched successfully",
      data: result,
    });
  }
);


export const RideControllers = {
    // Rider's Control
    requestRide,
    getAllRides
}