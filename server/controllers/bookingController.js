import Booking from '../models/Booking.js'; // Go up one folder (..), then into models
import Turf from '../models/Turf.js';
import User from '../models/User.js';

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

// ... existing imports

// 5. Get ALL Bookings (Admin)
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('user', 'name email image') // <--- MUST BE HERE
            .populate('turf', 'name sportType location')
            .sort({ date: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Bulk Booking (Recurring)
export const createBulkBooking = async (req, res) => {
    try {
        const { userEmail, turfId, timeSlot, startDate, endDate, selectedDays } = req.body;
        // selectedDays: Array of numbers [0, 1, ... 6] where 0=Sunday, 1=Monday

        // 1. Find the User
        const user = await User.findOne({ email: userEmail });
        if (!user) return res.status(404).json({ success: false, message: "User not found. Ask client to register first." });

        // 2. Generate Dates
        let start = new Date(startDate);
        const end = new Date(endDate);
        const datesToBook = [];

        while (start <= end) {
            if (selectedDays.includes(start.getDay())) {
                datesToBook.push(new Date(start)); // Copy date
            }
            start.setDate(start.getDate() + 1);
        }

        if (datesToBook.length === 0) return res.status(400).json({ success: false, message: "No matching days in range." });

        // 3. Check Conflicts & Calculate Price
        const turf = await Turf.findById(turfId);
        let conflictDate = null;

        // Helper to parse time
        const parseTime = (str) => {
            const [time, mod] = str.split(' ');
            let [h, m] = time.split(':').map(Number);
            if (h === 12 && mod === 'AM') h = 0;
            if (h !== 12 && mod === 'PM') h += 12;
            return h * 60 + m;
        }
        const [reqStartStr, reqEndStr] = timeSlot.split(" - ");
        const reqStart = parseTime(reqStartStr);
        const reqEnd = parseTime(reqEndStr);

        for (const dateObj of datesToBook) {
            // Check conflicts for this specific date
            const existing = await Booking.find({
                turf: turfId,
                date: dateObj.toISOString().split('T')[0], // YYYY-MM-DD
                status: { $ne: 'cancelled' }
            });

            for (const b of existing) {
                const [existStartStr, existEndStr] = b.timeSlot.split(" - ");
                const existStart = parseTime(existStartStr);
                const existEnd = parseTime(existEndStr);

                if (reqStart < existEnd && reqEnd > existStart) {
                    conflictDate = dateObj.toISOString().split('T')[0];
                    break;
                }
            }
            if (conflictDate) break;
        }

        if (conflictDate) {
            return res.status(400).json({ success: false, message: `Conflict found on ${conflictDate}. Bulk booking failed.` });
        }

        // 4. Create All Bookings
        const duration = (reqEnd - reqStart) / 60;
        const singlePrice = turf.price * duration;

        const bookingPromises = datesToBook.map(dateObj => {
            return new Booking({
                user: user._id,
                turf: turfId,
                date: dateObj.toISOString().split('T')[0],
                timeSlot,
                amount: singlePrice,
                paymentMethod: 'Cash', // Usually bulk is paid offline/cash
                isPaid: false,
                status: 'booked'
            }).save();
        });

        await Promise.all(bookingPromises);

        res.json({ success: true, message: `Successfully created ${bookingPromises.length} bookings!` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const cancelBookingAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId; // ID of the Admin making the request

        // 1. Verify Admin Role
        const adminUser = await User.findById(userId);
        if (adminUser.role !== 'owner') {
            return res.status(403).json({ success: false, message: "Access Denied. Admins only." });
        }

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: "Booking is already cancelled" });
        }

        // 2. Admin Cancel = 100% Refund
        booking.status = 'cancelled';
        booking.refundAmount = booking.amount; // Full Refund

        await booking.save();

        res.json({
            success: true,
            message: "Booking cancelled by Admin. Full refund generated.",
            booking
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ... existing imports

// 6. Bulk Cancel (Admin)
export const cancelBulkBookingsAdmin = async (req, res) => {
    try {
        const { bookingIds } = req.body; // Array of IDs
        const userId = req.userId;

        // 1. Verify Admin
        const adminUser = await User.findById(userId);
        if (adminUser.role !== 'owner') {
            return res.status(403).json({ success: false, message: "Access Denied. Admins only." });
        }

        if (!bookingIds || bookingIds.length === 0) {
            return res.status(400).json({ success: false, message: "No bookings selected." });
        }

        // 2. Cancel all selected bookings that are NOT already cancelled
        // We use an aggregation pipeline inside updateMany to set refundAmount = amount
        const result = await Booking.updateMany(
            { 
                _id: { $in: bookingIds },
                status: { $ne: 'cancelled' } // Only target active bookings
            },
            [
                { 
                    $set: { 
                        status: 'cancelled', 
                        refundAmount: "$amount" // Copy value from 'amount' to 'refundAmount'
                    } 
                }
            ]
        );

        res.json({ 
            success: true, 
            message: `Successfully cancelled ${result.modifiedCount} bookings. Full refunds generated.` 
        });

    } catch (error) {
        console.error("Bulk Cancel Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};