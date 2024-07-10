import mongoose from "mongoose"

const otpSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // 5 minutes
    expiresAt: { type: Date, required: true }
});

export default mongoose.model("Otp",otpSchema)