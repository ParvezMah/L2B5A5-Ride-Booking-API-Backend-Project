import { JwtPayload } from "jsonwebtoken"
import httpStatus from "http-status-codes";
import { envVars } from "../config/env"
import { IUser } from "../module/user/user.interface"
import { generateToken, verifyToken } from "./jwt"
import { User } from "../module/user/user.model"
import AppError from "../errorHelpers/appError"


export const createUserTokens = (user: Partial<IUser>)=> {
        const jwtPayload = {
            userId: user._id,
            email: user.email,
            role: user.role
        }
        const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    
        const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

        return {
            accessToken,
            refreshToken
        }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {

    // newly typed
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload


    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }
    if (!isUserExist.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = generateToken(
        jwtPayload, 
        envVars.JWT_ACCESS_SECRET, 
        envVars.JWT_ACCESS_EXPIRES
    )

    return accessToken
}
