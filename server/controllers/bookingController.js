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

export const createBooking = async (req, res) => {
    try {
        const { turfId, date, timeSlot, paymentMethod = 'UPI' } = req.body;
        const userId = req.auth.userId;

        // 1. Overlap Check & Duration Calculation
        const [reqStartStr, reqEndStr] = timeSlot.split(" - ");
        const reqStart = parseTimeToMinutes(reqStartStr);
        let reqEnd = parseTimeToMinutes(reqEndStr); // Changed to 'let'

        // FIX: Handle midnight crossing (e.g., 10 PM - 12 AM)
        // If end time is smaller or equal to start, it means it's the next day
        if (reqEnd <= reqStart) {
            reqEnd += 24 * 60; // Add 24 hours (1440 mins)
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

            // Apply the same midnight fix to existing bookings for accurate comparison
            if (existEnd <= existStart) {
                existEnd += 24 * 60;
            }

            // Standard overlap check logic
            if (reqStart < existEnd && reqEnd > existStart) {
                isConflict = true;
                break;
            }
        }

        if (isConflict) {
            return res.status(400).json({ success: false, message: "⚠️ Slot already booked!" });
        }

        // 2. Save
        const turf = await Turf.findById(turfId);
        if (!turf) return res.status(404).json({ success: false, message: "Turf not found" });

        // Calculate positive duration now
        const durationHours = (reqEnd - reqStart) / 60;
        const totalAmount = turf.price * durationHours;

        const newBooking = new Booking({
            user: userId,
            turf: turfId,
            date: date,
            timeSlot: timeSlot,
            amount: totalAmount, // This will now be positive
            paymentMethod,
            isPaid: false,
            status: 'booked'
        });

        await newBooking.save();
        res.status(201).json({ success: true, message: "Booking Confirmed!", booking: newBooking });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

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

export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.auth.userId;

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        if (booking.user !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }
        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: "Already cancelled" });
        }

        // Refund Calculation (No API call)
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