import ApiError from "../utils/ApiError"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const verifyJwt = async (req,res,next)=>{

    try {

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")
    
        if(!token){
            return next(
                new ApiError(
                    "Unauthorized request",
                    401
                )
            )
        }

        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

        if((!decodedToken)){
            return next(
                new ApiError(
                    "Invalid Token or Token has been expired",
                    401
                )
            )
        }

        const user = await User.findById(decodedToken._id).select({
          password: 0,
          refreshToken: 0,
        });

        if(!user){
            return next(
                new ApiError(
                    "Invalid token",
                    401
                )
            )
        }

        req.user = user
        next()

    } catch (error) {
        return next(
            new ApiError(
                error?.message || "Invalid token",
                401
            )
        )
    }
    
}