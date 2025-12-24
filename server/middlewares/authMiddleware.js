import "dotenv/config";

export const protect = (req, res, next) => {
  try {
    // 1. Log the auth object to see what Clerk found
    console.log("🔍 Auth Check:", req.auth);

    // 2. Check if userId exists
    if (!req.auth || !req.auth.userId) {
      console.log("❌ Auth Failed: No userId found.");
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: No valid session found" 
      });
    }

    // 3. Success
    console.log("✅ Auth Success! User ID:", req.auth.userId);
    req.userId = req.auth.userId;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};