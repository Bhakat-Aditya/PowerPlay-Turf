import User from "../models/User";

export const protect = async (req, res, next) => {
    const { userId } = req.auth;
    if (!userId) {
        res.json({ message: "Not authorized", success: false });
    }else{
        const user = await User.findById(userId);
        if (!user) {
            return  res.json({ message: "User not found", success: false });
        }
        req.user = user;
        next();
    }
}