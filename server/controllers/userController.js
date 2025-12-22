export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        res.json({ success: true, role });
    } catch (error) {
        res.json({ success: false, message: "Error fetching user data" + error.message });
    }
}