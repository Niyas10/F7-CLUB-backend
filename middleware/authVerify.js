import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import dotenv from 'dotenv';

dotenv.config();

const userSecret = process.env.USER_SECRET;

export const userTokenVerify = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(403).json({ message: 'Access Denied' });
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft();
        }

        // Verify JWT token
        const verified = jwt.verify(token, userSecret);
        req.user = verified;

        // Check user role and additional conditions
        if (verified.role !== 'user') {
            return res.status(403).json({ message: 'Access Denied' });
        }

        // Check if the user exists and is not blocked
        const user = await User.findOne({ email: verified.email });
        if (!user || user.isBlocked) {
            return res.status(403).json({ message: 'User is blocked or not found' });
        }

        // If all checks pass, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error in userTokenVerify middleware:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
