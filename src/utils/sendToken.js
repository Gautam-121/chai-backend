import User from "../models/user.model.js"
import ApiResponse from "./ApiResponse";
import {cookieOptions} from "../constants.js"

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

  } catch (error) {
    return next(
      new ApiError(
        "Something went wrong while generating refresh and access token",
        500
      )
    );
  }
};

const sendToken = async (user, statusCode, res) => {

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken();

  const loggedUser = await User.findById(user._id).select({
    password: 0,
    refreshToken: 0,
  });

  return res
  .status(statusCode)
  .cookie("accessToken", accessToken , cookieOptions)
  .cookie("refreshToken" , refreshToken , cookieOptions)
  .json(
    new ApiResponse(
        200,
        {
            user : loggedUser,
            accessToken,
            refreshToken
        },
        "User loggedIn successfull"
    )
  )
};

export default sendToken
