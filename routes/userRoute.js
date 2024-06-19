import express from "express"
import { emailOtpVerification, loginVerification, userSignup,resendOtp,workout, requestPasswordReset, requestPasswordOtpVerify, resetPassword} from "../controllers/userController.js";
const userRoute = express()

userRoute.post("/signup",userSignup)
userRoute.post("/otp",emailOtpVerification)
userRoute.post("/login",loginVerification)
userRoute.post("/resendOtp", resendOtp);
userRoute.post('/requestPasswordReset',requestPasswordReset)
userRoute.post('/requestPasswordOtpVerify',requestPasswordOtpVerify)
userRoute.post('/passwordReset',resetPassword)
userRoute.get('/workout',workout )



export default userRoute;