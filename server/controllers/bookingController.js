import Booking from '../models/Booking.js';
import Turf from '../models/Turf.js';

const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (hours === 12 && modifier === "AM") hours = 0;
    if (hours !== 12 && modifier === "PM") hours += 12;
    return hours * 60 + minutes;
};

// 1. Create Booking (Handles 'Cash' vs 'Online')
export const createBooking = async (req, res) => {
    try {
        const { turfId, date, timeSlot, paymentMethod } = req.body; // Expecting 'Cash' or 'Online'
        const userId = req.auth.userId;

        // --- 1. Overlap Check & Duration Calculation ---
        const [reqStartStr, reqEndStr] = timeSlot.split(" - ");
        const reqStart = parseTimeToMinutes(reqStartStr);
        let reqEnd = parseTimeToMinutes(reqEndStr);

        // Midnight crossing fix
        if (reqEnd <= reqStart) {
            reqEnd += 24 * 60;
        }

        const existingBookings = await Booking.find({
            turf: turfId,
            date: date,
            status: { $ne: 'cancelled' }
        });

        let isConflict = false;
        for (const booking of existingBookings) {
            const [existStartStr, existEndStr] = booking.timeSlot.split(" - ");
            const existStart = parseTimeToMinutes(existStartStr);
            let existEnd = parseTimeToMinutes(existEndStr);

            if (existEnd <= existStart) {
                existEnd += 24 * 60;
            }

            if (reqStart < existEnd && reqEnd > existStart) {
                isConflict = true;
                break;
            }
        }

        if (isConflict) {
            return res.status(400).json({ success: false, message: "⚠️ Slot already booked!" });
        }

        // --- 2. Calculate Amount ---
        const turf = await Turf.findById(turfId);
        if (!turf) return res.status(404).json({ success: false, message: "Turf not found" });

        const durationHours = (reqEnd - reqStart) / 60;
        const totalAmount = turf.price * durationHours;

        // --- 3. Save Booking ---
        const newBooking = new Booking({
            user: userId,
            turf: turfId,
            date: date,
            timeSlot: timeSlot,
            amount: totalAmount,
            paymentMethod: paymentMethod || 'Online', // Default to Online if missing
            isPaid: false, // Always starts as false
            status: 'booked'
        });

        const savedBooking = await newBooking.save();

        // --- 4. Branch Logic based on Payment Method ---

        // CASE A: Pay at Venue (Cash)
        if (paymentMethod === 'Cash') {
            return res.status(201).json({
                success: true,
                message: "Booking Confirmed! Please pay at the venue.",
                booking: savedBooking
            });
        }

        // CASE B: Online Payment
        // Here you would normally return a Stripe/Razorpay session ID
        return res.status(201).json({
            success: true,
            message: "Slot reserved. Proceeding to payment...",
            booking: savedBooking,
            // paymentSessionId: ... (Add your stripe logic here later)
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// 2. NEW: Admin Mark as Paid (For your Father)
export const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params; // Booking ID passed in URL
        const { isPaid } = req.body; // Boolean: true or false

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { isPaid: isPaid }, // Update the paid status
            { new: true } // Return the updated doc
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.json({
            success: true,
            message: `Payment status updated to ${isPaid ? 'Paid' : 'Unpaid'}`,
            booking: updatedBooking
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get User Bookings (Kept same)
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const bookings = await Booking.find({ user: userId })
            .populate('turf')
            .sort({ date: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 4. Cancel Booking (Kept same)
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.auth.userId;

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        if (booking.user.toString() !== userId) { // Added toString() for safety
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }
        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: "Already cancelled" });
        }

        const bookingDate = new Date(booking.date);
        const startMinutes = parseTimeToMinutes(booking.timeSlot.split(" - ")[0]);
        bookingDate.setMinutes(bookingDate.getMinutes() + startMinutes);

        const hoursDifference = (bookingDate - new Date()) / (1000 * 60 * 60);
        let refundAmount = hoursDifference < 24 ? booking.amount * 0.70 : booking.amount;

        booking.status = 'cancelled';
        booking.refundAmount = refundAmount;
        await booking.save();

        res.json({ success: true, message: `Cancelled. Refund Amount: ₹${refundAmount}`, refundAmount });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Get ALL Bookings (Admin Dashboard)
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('user', 'name email')
            .populate('turf', 'name')
            .sort({ date: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}