import Booking from '../models/Booking.js';
import Turf from '../models/Turf.js';
import User from '../models/User.js';

// Helper: Convert "06:00 PM" to minutes
const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (hours === 12 && modifier === "AM") hours = 0;
    if (hours !== 12 && modifier === "PM") hours += 12;
    return hours * 60 + minutes;
};

// 1. Create Booking (User)
export const createBooking = async (req, res) => {
    try {
        const { turfId, date, timeSlot, paymentMethod } = req.body;
        const userId = req.userId;

        const [reqStartStr, reqEndStr] = timeSlot.split(" - ");
        const reqStart = parseTimeToMinutes(reqStartStr);
        let reqEnd = parseTimeToMinutes(reqEndStr);
        if (reqEnd <= reqStart) reqEnd += 24 * 60;

        // Check for conflicts
        const existingBookings = await Booking.find({
            turf: turfId,
            date: date,
            status: { $ne: 'cancelled' }
        });

        for (const booking of existingBookings) {
            const [existStartStr, existEndStr] = booking.timeSlot.split(" - ");
            const existStart = parseTimeToMinutes(existStartStr);
            let existEnd = parseTimeToMinutes(existEndStr);
            if (existEnd <= existStart) existEnd += 24 * 60;

            if (reqStart < existEnd && reqEnd > existStart) {
                return res.status(400).json({ success: false, message: "⚠️ Slot already booked!" });
            }
        }

        const turf = await Turf.findById(turfId);
        if (!turf) return res.status(404).json({ success: false, message: "Turf not found" });

        const durationHours = (reqEnd - reqStart) / 60;
        const totalAmount = turf.price * durationHours;

        const newBooking = new Booking({
            user: userId,
            turf: turfId,
            date,
            timeSlot,
            amount: totalAmount,
            paymentMethod: paymentMethod || 'Online',
            isPaid: false,
            status: 'booked'
        });

        await newBooking.save();

        if (paymentMethod === 'Cash') {
            return res.status(201).json({ success: true, message: "Booking Confirmed! Pay at venue.", booking: newBooking });
        }
        res.status(201).json({ success: true, message: "Slot reserved.", booking: newBooking });

    } catch (error) {
        console.error("Create Booking Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Admin: Mark as Paid
export const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isPaid } = req.body;
        await Booking.findByIdAndUpdate(id, { isPaid });
        res.json({ success: true, message: "Payment status updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get User Bookings
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.userId }).populate('turf').sort({ date: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Cancel Booking (User)
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const booking = await Booking.findById(id);

        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
        if (booking.user.toString() !== userId) return res.status(403).json({ success: false, message: "Unauthorized" });
        if (booking.status === 'cancelled') return res.status(400).json({ success: false, message: "Already cancelled" });

        const bookingDate = new Date(booking.date);
        const startMinutes = parseTimeToMinutes(booking.timeSlot.split(" - ")[0]);
        bookingDate.setMinutes(bookingDate.getMinutes() + startMinutes);

        const hoursDiff = (bookingDate - new Date()) / (1000 * 60 * 60);
        let refundAmount = hoursDiff < 24 ? booking.amount * 0.70 : booking.amount;

        booking.status = 'cancelled';
        booking.refundAmount = Math.floor(refundAmount);
        await booking.save();

        res.json({ success: true, message: "Cancelled", refundAmount: booking.refundAmount });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Get All Bookings (Admin)
export const getAllBookings = async (req, res) => {
    try {
        // Default to Page 1, Limit 60
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 40;
        const skip = (page - 1) * limit;

        // Get Total Count for Frontend Pagination Logic
        const totalBookings = await Booking.countDocuments();
        const totalPages = Math.ceil(totalBookings / limit);

        const bookings = await Booking.find({})
            .populate('user', 'name email image')
            .populate('turf', 'name sportType location')
            // Sort by Created Time (Newest First)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            bookings,
            pagination: {
                currentPage: page,
                totalPages,
                totalBookings,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Admin Cancel (Individual)
export const cancelBookingAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const adminUser = await User.findById(userId);
        if (!adminUser || adminUser.role !== 'owner') {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        if (booking.status === 'cancelled') return res.status(400).json({ success: false, message: "Already cancelled" });

        booking.status = 'cancelled';
        booking.refundAmount = booking.amount;

        await booking.save();
        res.json({ success: true, message: "Cancelled by Admin (Full Refund)", booking });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Bulk Booking (Offline/Free)
export const createBulkBooking = async (req, res) => {
    try {
        const { userEmail, turfId, timeSlot, startDate, endDate, selectedDays } = req.body;

        const user = await User.findOne({ email: userEmail });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        let start = new Date(startDate);
        const end = new Date(endDate);
        const datesToBook = [];

        while (start <= end) {
            if (selectedDays.includes(start.getDay())) {
                datesToBook.push(new Date(start));
            }
            start.setDate(start.getDate() + 1);
        }

        if (datesToBook.length === 0) return res.status(400).json({ success: false, message: "No dates selected" });

        const bookingPromises = datesToBook.map(dateObj => {
            return new Booking({
                user: user._id,
                turf: turfId,
                date: dateObj.toISOString().split('T')[0],
                timeSlot,
                amount: 0,
                paymentMethod: 'Offline/Bulk',
                isPaid: true,
                status: 'booked'
            }).save();
        });

        await Promise.all(bookingPromises);
        res.json({ success: true, message: `Created ${bookingPromises.length} bulk bookings` });

    } catch (error) {
        console.error("Bulk Create Error:", error);
        res.status(500).json({ success: false, message: "Bulk booking failed" });
    }
};

// 8. Bulk Cancel (Admin) - FIXED LOGIC
export const cancelBulkBookingsAdmin = async (req, res) => {
    try {
        const { bookingIds } = req.body;
        const userId = req.userId;

        // 1. Verify Admin
        const adminUser = await User.findById(userId);
        if (!adminUser || adminUser.role !== 'owner') {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
            return res.status(400).json({ success: false, message: "No bookings selected" });
        }

        // 2. FETCH active bookings (Instead of UpdateMany Pipeline)
        const bookingsToCancel = await Booking.find({
            _id: { $in: bookingIds },
            status: { $ne: 'cancelled' }
        });

        if (bookingsToCancel.length === 0) {
            return res.json({ success: true, message: "No active bookings found to cancel." });
        }

        // 3. Loop and Save (This avoids the MongooseError)
        const updates = bookingsToCancel.map(async (booking) => {
            booking.status = 'cancelled';
            booking.refundAmount = booking.amount; // Copy full amount
            return booking.save();
        });

        await Promise.all(updates);

        res.json({ success: true, message: `Successfully cancelled ${bookingsToCancel.length} bookings.` });

    } catch (error) {
        console.error("Bulk Cancel Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};