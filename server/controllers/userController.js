import User from '../models/User.js';

export const getUserData = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // FIX: Return 'phone' so the frontend knows it exists!
        res.json({
            success: true,
            role: user.role,
            phone: user.phone  // <--- ADD THIS LINE
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching user data" });
    }
}

export const updateUserPhone = async (req, res) => {
    try {
        const userId = req.userId;
        const { phone } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { phone: phone },
            { new: true }
        );

        res.json({ success: true, message: "Phone number saved!", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};