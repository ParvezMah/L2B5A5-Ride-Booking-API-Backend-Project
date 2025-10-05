/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelpers/appError"
import { setAuthCookie } from "../../utils/setAuthCookie"




const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthServices.credentialsLogin(req.body)

    setAuthCookie(res, loginInfo)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: loginInfo
    })
})


const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("refreshToken from cookies : ", refreshToken)

    // const refreshToken = req.headers.authorization;
    // console.log("getNewAccessToken refreshToken : ", refreshToken)

    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "There is No refresh token recieved from cookies")
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

    // res.cookie("accessToken", tokenInfo.accessToken, {
    //     httpOnly: true, // httpOnly: true This makes the cookie inaccessible to JavaScript running in the browser (it can't be read or modified by document.cookie). Purpose: Helps protect against XSS (Cross-Site Scripting) attacks.
    //     secure: false, // secure: false This means the cookie will be sent over both HTTP and HTTPS connections. Purpose: In development, you often use secure: false because you may not have HTTPS locally. In production, you should set secure: true so the cookie is only sent over HTTPS, making it more secure.
    // })


    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    })
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken
}