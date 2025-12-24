import "dotenv/config";

export const protect = (req, res, next) => {
  try {
    // FIX: Handle req.auth whether it's a function (New Clerk) or object (Old Clerk)
    const authObj = typeof req.auth === "function" ? req.auth() : req.auth;

    if (!authObj || !authObj.userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: No token provided" 
      });
    }

    // Attach userId to the request object for easy access in controllers
    req.userId = authObj.userId;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};