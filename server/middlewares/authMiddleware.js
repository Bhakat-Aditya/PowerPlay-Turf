// NO IMPORTS NEEDED.
// We trust the Clerk Middleware in server.js to handle the token.

export const protect = (req, res, next) => {
  // Check if Clerk middleware successfully attached the auth object
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized: No token provided" 
    });
  }

  // Proceed. We will use req.auth.userId in the controllers.
  next();
};