import Booking from '../models/Booking.js';
import Turf from '../models/Turf.js';
import Razorpay from 'razorpay';
import "dotenv/config";

// --- 0. Initialize Razorpay (Required for Automatic Refunds) ---
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- HELPER: Convert "04:00 PM" to Minutes (e.g., 960) ---
const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (hours === 12 && modifier === "AM") hours = 0;
    if (hours !== 12 && modifier === "PM") hours += 12;
    return hours * 60 + minutes;
};

// --- API: Create Booking (With Overlap Check) ---
export const createBooking = async (req, res) => {
    try {
        const { turfId, date, timeSlot, paymentMethod = 'UPI' } = req.body;
        const userId = req.user.id; // Clerk ID

        // 1. Parse Requested Time
        const [reqStartStr, reqEndStr] = timeSlot.split(" - ");
        const reqStart = parseTimeToMinutes(reqStartStr);
        const reqEnd = parseTimeToMinutes(reqEndStr);

        // 2. Fetch active bookings to check overlaps
        const existingBookings = await Booking.find({
            turf: turfId,
            date: date,
            status: { $ne: 'cancelled' }
        });

        // 3. Overlap Logic
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

        // 4. Calculate Price
        const turf = await Turf.findById(turfId);
        if (!turf) return res.status(404).json({ success: false, message: "Turf not found" });

        const durationHours = (reqEnd - reqStart) / 60;
        const totalAmount = turf.price * durationHours;

        // 5. Save Booking
        const newBooking = new Booking({
            user: userId,
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
        const userId = req.user.id;
        const bookings = await Booking.find({ user: userId })
            .populate('turf', 'name location images')
            .sort({ date: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// --- API: Cancel Booking (With Automatic Razorpay Refund) ---
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        if (booking.user !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }
        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: "Already cancelled" });
        }

        // 1. Calculate Refund Amount
        const bookingDate = new Date(booking.date);
        const startTimeStr = booking.timeSlot.split(" - ")[0];
        const startMinutes = parseTimeToMinutes(startTimeStr);
        bookingDate.setMinutes(bookingDate.getMinutes() + startMinutes);

        const currentTime = new Date();
        const timeDifferenceMs = bookingDate - currentTime;
        const hoursDifference = timeDifferenceMs / (1000 * 60 * 60);

        let refundAmount = 0;
        let message = "";

        if (hoursDifference < 24) {
            refundAmount = booking.amount * 0.70; // 30% Deduction
            message = `Cancelled (<24hrs). 30% deducted. Refund: ₹${refundAmount.toFixed(0)}`;
        } else {
            refundAmount = booking.amount; // Full Refund
            message = `Cancelled. Full refund: ₹${refundAmount}`;
        }

        // 2. AUTOMATIC RAZORPAY REFUND
        if (booking.isPaid && booking.paymentId) {
            try {
                await razorpay.payments.refund(booking.paymentId, {
                    amount: Math.round(refundAmount * 100), // paise
                    speed: "normal",
                    notes: { reason: "User Cancellation" }
                });
            } catch (err) {
                console.error("Razorpay Refund Failed:", err);
                return res.status(500).json({
                    success: false,
                    message: "Cancellation failed: Could not process automatic refund."
                });
            }
        }

        // 3. Update Database
        booking.status = 'cancelled';
        booking.refundAmount = refundAmount;
        await booking.save();

        res.json({ success: true, message, refundAmount });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Optional Availability Check
export const checkAvailabilityAPI = async (req, res) => {
    res.json({ success: true });
};