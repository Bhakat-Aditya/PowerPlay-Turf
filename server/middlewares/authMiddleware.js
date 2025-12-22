// INCORRECT: import User from "../models/User";
// CORRECT: Add .js at the end
import User from "../models/User.js"; 

export const protect = async (req, res, next) => {
    // ... rest of your code is fine
    const { userId } = req.auth;
    if (!userId) {
        res.json({ message: "Not authorized", success: false });
    } else {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ message: "User not found", success: false });
        }
        req.user = user;
        next();
    }
}