import express from 'express';
// Import 'getKey' here:
import { createOrder, verifyPayment, getKey } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const paymentRouter = express.Router();

paymentRouter.post('/create-order', protect, createOrder);
paymentRouter.post('/verify', protect, verifyPayment);
// Add this new line:
paymentRouter.get('/get-key', protect, getKey); 

export default paymentRouter;