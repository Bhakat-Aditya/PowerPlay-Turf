import User from '../models/User.js'; // <--- Import the User model

export const getUserData = async (req, res) => {
    try {
        // The middleware sets req.userId, NOT req.user
        const userId = req.userId; 

        // Fetch the user from MongoDB
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Now we can access the role
        res.json({ success: true, role: user.role });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching user data: " + error.message });
    }
}