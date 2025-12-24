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

// 1. Create Booking
export const createBooking = async (req, res) => {
    try {
        const { turfId, date, timeSlot, paymentMethod } = req.body;

        // FIX: Use req.userId (set by our updated middleware)
        const userId = req.userId;

        // --- 1. Overlap Check ---
        const [reqStartStr, reqEndStr] = timeSlot.split(" - ");
        const reqStart = parseTimeToMinutes(reqStartStr);
        let reqEnd = parseTimeToMinutes(reqEndStr);

        if (reqEnd <= reqStart) reqEnd += 24 * 60;

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

            if (existEnd <= existStart) existEnd += 24 * 60;

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
            paymentMethod: paymentMethod || 'Online',
            isPaid: false,
            status: 'booked'
        });

        const savedBooking = await newBooking.save();

        if (paymentMethod === 'Cash') {
            return res.status(201).json({
                success: true,
                message: "Booking Confirmed! Please pay at the venue.",
                booking: savedBooking
            });
        }

        return res.status(201).json({
            success: true,
            message: "Slot reserved. Proceeding to payment...",
            booking: savedBooking
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Admin: Mark as Paid
export const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isPaid } = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { isPaid: isPaid },
            { new: true }
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

// 3. Get User Bookings
export const getUserBookings = async (req, res) => {
    try {
        // --- FIX IS HERE: Use req.userId ---
        const userId = req.userId;
        
        const bookings = await Booking.find({ user: userId })
            .populate('turf')
            .sort({ date: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 4. Cancel Booking
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        // FIX: Use req.userId
        const userId = req.userId;

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        if (booking.user.toString() !== userId) {
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

// 5. Get ALL Bookings (Admin)
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('user', 'name email')
            .populate('turf', 'name')
            .sort({ date: -1 }); // Newest first

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}