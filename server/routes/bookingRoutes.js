import express from 'express';
import { checkAvailabilityAPI, createBooking, getUserBookings } from '../controllers/bookingController';
import { protect } from '../middlewares/authMiddleware';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);

export default bookingRouter;