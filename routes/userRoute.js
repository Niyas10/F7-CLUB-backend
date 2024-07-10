import express from "express"
import { emailOtpVerification, loginVerification, userSignup,resendOtp,workout, requestPasswordReset, requestPasswordOtpVerify, resetPassword, viewWorkout, blog, viewBlog, forgotResendOtp} from "../controllers/userController.js";
const userRoute = express()

userRoute.post("/signup",userSignup)
userRoute.post("/otp",emailOtpVerification)
userRoute.post("/login",loginVerification)
userRoute.post("/resendOtp", resendOtp);
userRoute.post('/requestPasswordReset',requestPasswordReset)
userRoute.post('/requestPasswordOtpVerify',requestPasswordOtpVerify)
userRoute.post('/passwordReset',resetPassword)
userRoute.post('/resendOtp/:id', forgotResendOtp);
userRoute.get('/workout',workout )
userRoute.get('/viewWorkout/:id',viewWorkout)
userRoute.get('/blog',blog)
userRoute.get('/viewBlog/:id',viewBlog)


export default userRoute;