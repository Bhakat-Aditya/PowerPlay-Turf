import Booking from '../models/Booking.js';
import Turf from '../models/Turf.js';

// --- HELPER: Check if a slot is free ---
const checkTurfAvailability = async (turfId, date, timeSlot) => {
    try {
        // Find if any booking exists for this specific turf, date, and slot
        const bookings = await Booking.find({
            turf: turfId,
            date: date,
            timeSlot: timeSlot
        });

        // If array is empty, it's available
        return bookings.length === 0;
    } catch (error) {
        console.log("Availability Check Error:", error.message);
        return false; // Assume unavailable on error to prevent double booking
    }
}

// --- API: Check Availability (Public) ---
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { turfId, date, timeSlot } = req.body;
        const isAvailable = await checkTurfAvailability(turfId, date, timeSlot);
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: "Error checking availability: " + error.message });
    }
}

// --- API: Create Booking (Protected) ---
export const createBooking = async (req, res) => {
    try {
        const { turfId, date, timeSlot, paymentMethod } = req.body;

        // Ensure user is attached by authMiddleware
        const userId = req.user._id;

        // 1. Check Availability Again (Concurrency safety)
        const isAvailable = await checkTurfAvailability(turfId, date, timeSlot);
        if (!isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Slot already booked. Please choose another time."
            });
        }

        // 2. Fetch Turf Details to get the accurate PRICE
        const turf = await Turf.findById(turfId);
        if (!turf) {
            return res.status(404).json({ success: false, message: "Turf not found" });
        }

        // 3. Create the Booking
        const newBooking = new Booking({
            user: userId,          // Store Clerk ID
            turf: turfId,
            date: date,
            timeSlot: timeSlot,
            amount: turf.price,    // Use price from DB, not frontend
            paymentMethod: paymentMethod || 'UPI',
            isPaid: false,         // Default to false until payment gateway callback
            status: 'booked'
        });

        await newBooking.save();

        res.status(201).json({
            success: true,
            message: "Booking Confirmed!",
            booking: newBooking
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// --- API: Get User Bookings (For 'My Bookings' Page) ---
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find bookings and POPULATE turf details (name, image, location)
        const bookings = await Booking.find({ user: userId })
            .populate('turf', 'name location images') // <--- This fills in turf details
            .sort({ date: -1 }); // Sort by newest first

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}