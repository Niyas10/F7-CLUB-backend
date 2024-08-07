import User from "../models/userModel.js";
import Blog from "../models/blogModel.js";
import Otp from "../models/otpModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMailOtp from "../utils/nodeMailer.js";
import securePassword from "../utils/securePassword.js";
import Workout from "../models/workoutModel.js";

let otpId;

export const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email: email });
    const hashedPassword = await securePassword(password);

    if (userExist) {
      return res
        .status(401)
        .json({ message: "user alredy registered with this email" });
    }
    const user = new User({
      name: name,
      email: email,
      password: password,
      password: hashedPassword,
    });

    const userData = await user.save();
    otpId = await sendMailOtp(userData.name, userData.email, userData._id);

    return res.status(201).json({
      message: `Otp has been sent to ${email}`,
      user: userData,
      otpId: otpId,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const emailOtpVerification = async (req, res) => {
  try {
    const { otp, userId } = req.body;

    const otpData = await Otp.find({ userId: userId });

    const { expiresAt } = otpData[otpData.length - 1];
    const correctOtp = otpData[otpData.length - 1].otp;
    if (otpData && expiresAt < Date.now) {
      return res.status(401).json({ message: "Email OTP has expired" });
    }
    if (correctOtp === otp) {
      await User.updateOne({ _id: userId }, { $set: { isVerified: true } });

      res.status(200).json({
        status: true,
        message: "User registered successfully,You can login now",
      });
    } else {
      res.status(400).json({ status: false, message: "Incorrect OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const { _id, name, email } = await User.findOne({ email: userEmail });
    const otpId = sendMailOtp(name, email, _id);
    if (otpId) {
      res.status(200).json({ message: `An OTP has been resent to ${email}` });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Failed to send OTP. Please try again later.",
    });
  }
};

export const loginVerification = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }

    if (user.isVerified) {
      if (user.isBlocked === false) {
        const correctPassword = await bcrypt.compare(password, user.password);

        if (correctPassword) {
          const token = jwt.sign(
            {
              name: user.name,
              email: user.email,
              id: user._id,
              role: "user",
            },
            process.env.USER_SECRET,
            {
              expiresIn: "1h",
            }
          );

          return res
            .status(200)
            .json({ user, token, message: `Welcome ${user.name}` });
        } else {
          return res.status(403).json({ message: "Incorrect Password" });
        }
      } else {
        return res.status(403).json({ message: "User is Blocked" });
      }
    } else {
      return res.status(401).json({ message: "Email is not verified" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Issue" });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otpId = await sendMailOtp(user.name, user.email, user._id);
    return res.status(200).json({
      message: `OTP has been sent to ${email}`,
      otpId: otpId,
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal servere error" });
  }
};

export const requestPasswordOtpVerify = async (req, res) => {
  try {
    const { otp, userId } = req.body;

    if (!otp || !userId) {
      return res.status(400).json({ message: "OTP and userId are required" });
    }
    const otpData = await Otp.find({ userId: userId });
    if (otpData.length === 0) {
      return res.status(401).json({ message: "Email OTP not found" });
    }
    const { expiresAt, otp: correctOtp } = otpData[otpData.length - 1];
    if (expiresAt < Date.now()) {
      return res.status(401).json({ message: "Email OTP has expired" });
    }
    if (correctOtp === otp) {
      return res.status(200).json({
        status: true,
        message: "You can change your password",
      });
    } else {
      return res.status(400).json({ status: false, message: "Incorrect OTP" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password, userId } = req.body;
    console.log(password, userId + "hey");
    if (!password || !userId) {
      return res.status(400).json({ message: "Password and userId required" });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await securePassword(password);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successfull" });
  } catch (error) {
    console.log("hey its me ", error);
    return res.status(500).json({ message: "internal Server Error" });
  }
};

export const workout = async (req, res) => {
  try {
    const workoutData = await Workout.find();
    if (workoutData) {
      res.status(200).json({ workout: workoutData });
    } else {
      res
        .status(500)
        .json({ message: "something wrong finding workout data " });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const viewWorkout = async (req, res) => {
  try {
    const workoutId = req.params.id;
    const workout = await Workout.findById(workoutId);

    if (workout) {
      res.status(200).json({ workout });
    } else {
      res.status(404).json({ message: "Workout not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const blog = async (req, res) => {
  try {
    const blogData = await Blog.find();
    if (blogData) {
      res.status(200).json({ message: blogData });
    } else {
      res.status(500).josn({ message: "somthing wrong finding blog data " });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error:", error });
  }
};

export const forgotResendOtp = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Generate new OTP
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Create or update OTP document
    let otpDoc = await Otp.findOne({ userId: user._id });
    if (!otpDoc) {
      otpDoc = new Otp({ userId: user._id });
    }

    otpDoc.otp = newOtp;
    otpDoc.createdAt = new Date();
    otpDoc.expiresAt = new Date(new Date().getTime() + 5 * 60000); // 5 minutes expiry
    await otpDoc.save();

    // Send OTP via email
    try {
      const otpId = await sendMailOtp(user.name, user.email, userId);
      console.log(otpId);
      res
        .status(200)
        .json({ status: true, message: "OTP resent successfully" });
    } catch (emailError) {
      return res.status(500).json({
        status: false,
        message: "Failed to send OTP email",
        error: emailError.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const viewBlog = async (req, res) => {
  console.log("hey");
  try {
    const blogId = req.params.id;
    console.log(blogId + "hey");
    const blog = await Blog.findById(blogId);
    if (blog) {
      res.status(200).json({ blog });
    } else {
      res.status(404).json({ message: "blog not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
