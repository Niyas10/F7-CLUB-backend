import express from "express"
import { emailOtpVerification, loginVerification, userSignup } from "../controllers/userController.js";

const userRoute = express()

userRoute.post("/signup",userSignup)
userRoute.post("/otp",emailOtpVerification)
userRoute.post("/login",loginVerification)


export default userRoute;