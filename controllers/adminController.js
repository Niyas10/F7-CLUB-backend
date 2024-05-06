import dotenv from 'dotenv'
dotenv.config();
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken'



export const adminLogin = (req, res) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const userName = 'Admin';

    try {
        const { email, password } = req.body;
       
        if (email === adminEmail) {
            if (adminPassword === password) {
                // Generate JWT token
                const token = jwt.sign(
                    {
                        name: userName,
                        email: adminEmail,
                        role: "admin"
                    },
                    process.env.ADMIN_SECRET,
                    {
                        expiresIn: '1h'
                    }
                );

                // Return success response with token
                return res.status(200).json({ userName, token, message: `Welcome ${userName}` });
            } else {
                // Incorrect password
                return res.status(403).json({ message: "Incorrect Password" });
            }
        } else {
            // Incorrect email
            return res.status(401).json({ message: "Incorrect Email" });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: "Internal Server Error" });
    }
};


export const userList = async (req,res)=>{
    try{
        const users = await User.find()
        res.status(200).json({users})
    }catch(error){
console.log(error.message)
res.status(200).json({status:"internal server error"})
    }
}

export const userBlock = async (req,res)=>{
    try{
        const {userId,status} = req.body
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const updatedStatus = !status

        await  User.findByIdAndUpdate(
            {_id:userId},
            {$set:{isBlocked:updatedStatus}}
        );
        let message = ""
        if(updatedStatus){
            message = "User is Blocked"
        }  else {
            message = "User is Unblocked"
        }
        res.status(200).json({message})
    } catch(error){
        console.log(error.message)
        res.status(500).json({status:"internal server error"})
    }
}


