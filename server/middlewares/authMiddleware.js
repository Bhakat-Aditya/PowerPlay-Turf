import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

// This function acts as the bridge between Clerk and your Database
export const protect = async (req, res, next) => {
  try {
    // 1. Check if Clerk authenticated the request
    if (!req.auth.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No Clerk ID" });
    }

    // 2. Find the user in YOUR MongoDB using the Clerk ID
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found in database" });
    }

    // 3. Attach the full MongoDB user object to req.user
    req.user = user; 
    
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ success: false, message: "Authentication Failed" });
  }
};