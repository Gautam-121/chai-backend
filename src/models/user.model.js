import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true , "Username is Required"],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true , "Email is Required"],
        unique: true,
        trim: true,
    },
    fullName:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        required: true
    },
    coverImage:{
        type: String,
    },
    password:{
        type: String,
        required: [true , "Password is Required"]
    },
    refreshToken:{
        type: String,
        default: undefined
    },

    otp : String,
    otpExpire: String

},{timestamps: true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password , 10)
    next()
})

userSchema.methods.isPasswordCompare = async function(password){
    return await bcrypt.compare(password , this.password)
}

userSchema.method.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.userSchema
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
        }
    )
}

userSchema.method.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE
        }
    )
}

userSchema.method.generateSixDigitOtp = function(){

    const randomNumber = "0123456789"
    let otp = ""
    let len = 6

    for(let i=0 ; i<len; i++){
        otp+= randomNumber[Math.floor(Math.random() * randomNumber.length)];
    }
}

export default User = mongoose.model("User", userSchema)