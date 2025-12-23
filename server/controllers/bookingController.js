import Booking from '../models/Booking.js';
import Turf from '../models/Turf.js';
import Razorpay from 'razorpay';
import "dotenv/config";

// --- 0. Initialize Razorpay ---
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- HELPER: Convert "04:00 PM" to Minutes ---
const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (hours === 12 && modifier === "AM") hours = 0;
    if (hours !== 12 && modifier === "PM") hours += 12;
    return hours * 60 + minutes;
};

// --- API: Create Booking ---
export const createBooking = async (req, res) => {
    try {
        const { turfId, date, timeSlot, paymentMethod = 'UPI' } = req.body;

        // FIX: Use req.auth.userId (The Clerk ID) directly
        const userId = req.auth.userId;

        // 1. Overlap Logic
        const [reqStartStr, reqEndStr] = timeSlot.split(" - ");
        const reqStart = parseTimeToMinutes(reqStartStr);
        const reqEnd = parseTimeToMinutes(reqEndStr);

        const existingBookings = await Booking.find({
            turf: turfId,
            date: date,
            status: { $ne: 'cancelled' }
        });

        let isConflict = false;
        for (const booking of existingBookings) {
            const [existStartStr, existEndStr] = booking.timeSlot.split(" - ");
            const existStart = parseTimeToMinutes(existStartStr);
            const existEnd = parseTimeToMinutes(existEndStr);

            if (reqStart < existEnd && reqEnd > existStart) {
                isConflict = true;
                break;
            }
        }

        if (isConflict) {
            return res.status(400).json({
                success: false,
                message: "⚠️ Slot already booked! Please choose another time."
            });
        }

        // 2. Price Calculation
        const turf = await Turf.findById(turfId);
        if (!turf) return res.status(404).json({ success: false, message: "Turf not found" });

        const durationHours = (reqEnd - reqStart) / 60;
        const totalAmount = turf.price * durationHours;

        // 3. Save Booking
        const newBooking = new Booking({
            user: userId, // Saving the Clerk ID string
            turf: turfId,
            date: date,
            timeSlot: timeSlot,
            amount: totalAmount,
            paymentMethod: paymentMethod,
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

// --- API: Get User Bookings ---
export const getUserBookings = async (req, res) => {
    try {
        // FIX: Find bookings where 'user' field matches the Clerk ID
        const userId = req.auth.userId;

        const bookings = await Booking.find({ user: userId })
            .populate('turf', 'name location images') // Fetches details from 'turves' collection
            .sort({ date: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.error("Get Bookings Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// --- API: Cancel Booking ---
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.auth.userId; // FIX: Use Clerk ID

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        // Verify Ownership
        if (booking.user !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }
        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: "Already cancelled" });
        }

        // 1. Calculate Refund
        const bookingDate = new Date(booking.date);
        const startTimeStr = booking.timeSlot.split(" - ")[0];
        const startMinutes = parseTimeToMinutes(startTimeStr);
        bookingDate.setMinutes(bookingDate.getMinutes() + startMinutes);

        const hoursDifference = (bookingDate - new Date()) / (1000 * 60 * 60);

        let refundAmount = 0;
        let message = "";

        if (hoursDifference < 24) {
            refundAmount = booking.amount * 0.70; // 30% Deduction
            message = `Cancelled (<24hrs). 30% deducted. Refund: ₹${refundAmount.toFixed(0)}`;
        } else {
            refundAmount = booking.amount; // Full Refund
            message = `Cancelled. Full refund: ₹${refundAmount}`;
        }

        // 2. Automatic Razorpay Refund
        if (booking.isPaid && booking.paymentId) {
            try {
                await razorpay.payments.refund(booking.paymentId, {
                    amount: Math.round(refundAmount * 100), // paise
                    speed: "normal"
                });
            } catch (err) {
                console.error("Razorpay Refund Failed:", err);
                // We continue to mark as cancelled in DB even if refund API hiccups, 
                // but usually you might want to stop here.
            }
        }

        // 3. Update DB
        booking.status = 'cancelled';
        booking.refundAmount = refundAmount;
        await booking.save();

        res.json({ success: true, message, refundAmount });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const checkAvailabilityAPI = async (req, res) => {
    res.json({ success: true });
};