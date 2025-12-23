import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Ensure you have this

const paymentRouter = express.Router();

paymentRouter.post('/create-order', protect, createOrder);
paymentRouter.post('/verify', protect, verifyPayment);

export default paymentRouter;