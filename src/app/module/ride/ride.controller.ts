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

const getRiderRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const rider = req.user as JwtPayload;
  const riderId = rider.userId;

  // query params from frontend
  const { page = 1, limit = 10, status, startDate, endDate, minFare, maxFare } = req.query;

  const result = await RideService.getRiderRides(
    riderId,
    Number(page),
    Number(limit),
    status as string,
    startDate as string,
    endDate as string,
    minFare ? Number(minFare) : undefined,
    maxFare ? Number(maxFare) : undefined
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rider's rides retrieved successfully",
    data: result,
  });
});

const cancelRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as JwtPayload; 
  const rideId = req.params.id;

 
  const result = await RideService.cancelRide(
    { userId: user.userId, role: user.role },
    rideId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Ride cancelled successfully",
    data: result,
  });
});


export const RideControllers = {
    getAllRides,

    // Rider's Control
    requestRide,
    getRiderRides,
    cancelRide

}