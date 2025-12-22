import express from 'express';
import { checkAvailabilityAPI, createBooking, getUserBookings, cancelBooking } from '../controllers/bookingController.js'; // Import cancelBooking
import { protect } from '../middlewares/authMiddleware.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.put('/cancel/:id', protect, cancelBooking); // Add this line

export default bookingRouter;

