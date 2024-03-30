import express from "express"
import { logOut, loginUser, refreshToken, registerUser } from "../controllers/user.controller.js"
import upload from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
const router = express.Router()


router.route("/register").post( upload.fields(
    [
        {
            name: "avatar",
            maxCount: 0
        },
        {
            name: "coverImage",
            maxCount: 0
        }
    ]
) , registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post( verifyJwt ,  logOut)

router.route("/refresh-token").post(refreshToken)







export default router