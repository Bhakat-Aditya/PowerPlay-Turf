import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
// 1. Import both controller functions
import { getUserData, updateUserPhone } from '../controllers/userController.js';

const userRouter = express.Router();

// 2. Change path to '/data' to match App.jsx
// Final URL: /api/user/data
userRouter.get('/data', protect, getUserData);

// 3. Add the new route for saving the phone number
// Final URL: /api/user/update-phone
userRouter.post('/update-phone', protect, updateUserPhone);

export default userRouter;