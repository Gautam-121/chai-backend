import User from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import {
    isValidEmail,
    isValidLengthUsername,
    isValidPassword
} from "../utils/validation.js"

export const registerUser = asyncHandler(async(req,res,next)=>{

    // Take all neccessary Input from Frontent
    // Validate the Input field
    // check user already exist with username or email
    // handle uploading file (avatar and coverImage)
    // create a object for registerUser
    // after store data in database , verified successfully created
    // send respond to the user

    const {fullName , email , password ,username } = req.body

    if(
        [fullName,email,password,username].some(field => field?.trim() === "")
    ){
        return next(
            new ApiError(
                "All field is Required",
                400
            )
        )
    }

    if(!isValidEmail(email)){
        return next(
            new ApiError(
                "Invalid Email Id",
                400
            )
        )
    }

    if(!isValidPassword(password)){
        return next(
          new ApiError(
            "Password should contain at least 8 character in which one uppercase letter one lowercase letter one number and one special character",
            400
          )
        );
    }

    if(!isValidLengthUsername(username)){
        return next(
            new ApiError(
                "Username should between 4 to 20 character",
                400
            )
        )
    }

    const isUserExisted = await User.findOne({
        $or:[{email},{username}]
    })

    if(isUserExisted){
        return next(
            new ApiError(
                "User already has registered with email or username",
                409
            )
        )
    }

    if(!(req.files && req.files[0] && req.files[0].avatar && req.files[0].avatar.path)){
        return next(
            new ApiError(
                "Avatar is required",
                400
            )
        )
    }

    const avatarLocalFile = req.files[0].avatar.path

    avatarLocalFile = await uploadOnCloudinary(avatarLocalFile)

    if(!avatarLocalFile){
        return next(
            new ApiError(
                "Something went wrong while uploading file on cloudinary",
                500
            )
        )
    }

    let coverImageLocalPath = req.files?.[0]?.avatar?.path

    if(coverImageLocalPath){
        coverImageLocalPath = await uploadOnCloudinary(coverImageLocalPath)

        if(!coverImageLocalPath){
            return next(
                new ApiError(
                    "Something went wrong while uploading coverImage on Cloudinary",
                    500
                )
            )
        }
    }else{
        coverImageLocalPath = ""
    }

    const user = await User.create({
        username,
        email,
        password,
        fullName,
        avatar: avatarLocalFile,
        coverImage: coverImageLocalPath 
    })

    const createdUser = await User.findById(user._id).select({
      password: 0,
      refreshToken: 0,
    });

    if(!createdUser){
        return next(
            new ApiError(
                "Something went wrong while registring a User",
                500
            )
        )
    }

    return res.status(201).json(
        new ApiResponse(
            200,
            createdUser,
            "User register Successfully"
        )
    )
})