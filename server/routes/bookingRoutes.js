import express from 'express';
import { createBooking, getUserBookings, cancelBooking, getAllBookings, updatePaymentStatus } from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to create a new booking
router.post('/book', protect, createBooking);

// Route to get all bookings for the logged-in user
router.get('/user', protect, getUserBookings);

// Route to cancel a booking
router.put('/cancel/:id', protect, cancelBooking);

// Route to get all bookings (admin only)
router.get('/all', protect, getAllBookings);

// NEW: Route to update payment status (admin only)+
router.put('/update-payment/:id', protect, updatePaymentStatus);

export default router;