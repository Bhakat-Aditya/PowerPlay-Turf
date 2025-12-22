import Booking from '../models/Booking.js';
import Turf from '../models/Turf.js';

// --- HELPER: Check if a slot is free ---
const checkTurfAvailability = async (turfId, date, timeSlot) => {
    try {
        const bookings = await Booking.find({
            turf: turfId,
            date: date,
            timeSlot: timeSlot
        });
        // If array is empty, it's available. 
        // Note: Exclude cancelled bookings from this check if you want them to be re-bookable.
        const activeBookings = bookings.filter(b => b.status !== 'cancelled');
        return activeBookings.length === 0;
    } catch (error) {
        console.log("Availability Check Error:", error.message);
        return false;
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

// --- API: Create Booking ---
export const createBooking = async (req, res) => {
    try {
        // Default paymentMethod to 'UPI' if not provided
        const { turfId, date, timeSlot, paymentMethod = 'UPI' } = req.body;
        const userId = req.user._id;

        // 1. Check Availability
        const isAvailable = await checkTurfAvailability(turfId, date, timeSlot);
        if (!isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Slot already booked. Please choose another time."
            });
        }

        // 2. Fetch Turf Details for Price
        const turf = await Turf.findById(turfId);
        if (!turf) {
            return res.status(404).json({ success: false, message: "Turf not found" });
        }

        // 3. Create Booking
        const newBooking = new Booking({
            user: userId,
            turf: turfId,
            date: date,
            timeSlot: timeSlot,
            amount: turf.price,
            paymentMethod: paymentMethod, 
            isPaid: false,
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

// --- API: Get User Bookings ---
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await Booking.find({ user: userId })
            .populate('turf', 'name location images')
            .sort({ date: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// --- API: Cancel Booking (With 30% Deduction Logic) ---
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const booking = await Booking.findById(id);

        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        // Verify Owner
        if (booking.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: "Booking is already cancelled" });
        }

        // --- 1. Calculate Time Difference ---
        // Construct the full Date object for the booking slot
        const bookingDateTime = new Date(booking.date);
        
        // Extract start time (e.g., "04:00 PM")
        const startTimeString = booking.timeSlot.split(" - ")[0]; 
        const [time, modifier] = startTimeString.split(" ");
        let [hours, mins] = time.split(":");

        if (hours === "12") hours = "00";
        if (modifier === "PM") hours = parseInt(hours, 10) + 12;
        
        bookingDateTime.setHours(parseInt(hours), parseInt(mins), 0, 0);

        const currentTime = new Date();
        const timeDifferenceMs = bookingDateTime - currentTime;
        const hoursDifference = timeDifferenceMs / (1000 * 60 * 60);

        let refundAmount = 0;
        let message = "";

        // --- 2. Apply Refund Logic ---
        if (hoursDifference < 24) {
            // Less than 24 hours left: Owner keeps 30%, Refund 70%
            refundAmount = booking.amount * 0.70;
            message = `Booking cancelled (<24hrs left). 30% deduction applied. Refund: ₹${refundAmount.toFixed(2)}`;
        } else {
            // More than 24 hours left: Full Refund
            refundAmount = booking.amount;
            message = `Booking cancelled. Full refund of ₹${refundAmount} initiated.`;
        }

        // --- 3. Update Database ---
        booking.status = 'cancelled';
        await booking.save();

        res.json({ success: true, message, refundAmount });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};