import Booking from '../models/Booking.js';
import Turf from '../models/Turf.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';

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

        // --- EMAIL LOGIC: Pay at Venue Confirmation ---
        try {
            const user = await User.findById(userId);
            if (user && user.email && paymentMethod === 'Cash') {
                const subject = "✅ Booking Confirmed (Pay at Venue)";
                const message = `Hi ${user.name},\n\nYour booking is confirmed!\n\n🏟 Turf: ${turf.name}\n📅 Date: ${date}\n⏰ Time: ${timeSlot}\n💰 Amount to Pay: ₹${totalAmount}\n\nPlease pay at the venue before your match starts.\n\nEnjoy your game!\n- PowerPlay Team`;
                sendEmail(user.email, subject, message);
            }
        } catch (emailError) {
            console.log("Email failed:", emailError.message);
        }
        // ----------------------------------------------

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

        // Populating turf so we can use turf name in the email
        const booking = await Booking.findById(id).populate('turf');

        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
        if (booking.user.toString() !== userId) return res.status(403).json({ success: false, message: "Unauthorized" });
        if (booking.status === 'cancelled') return res.status(400).json({ success: false, message: "Already cancelled" });

        const bookingDate = new Date(booking.date);
        const startMinutes = parseTimeToMinutes(booking.timeSlot.split(" - ")[0]);
        bookingDate.setMinutes(bookingDate.getMinutes() + startMinutes);

        const hoursDiff = (bookingDate - new Date()) / (1000 * 60 * 60);
        let refundAmount = 0;

        // Only calculate refund if paid
        if (booking.isPaid) {
            refundAmount = hoursDiff < 24 ? booking.amount * 0.70 : booking.amount;
        }

        booking.status = 'cancelled';
        booking.refundAmount = Math.floor(refundAmount);
        await booking.save();

        // --- EMAIL LOGIC: User Cancellation ---
        try {
            const user = await User.findById(userId);
            if (user && user.email) {
                const subject = "❌ Booking Cancelled";
                let message = `Hi ${user.name},\n\nYour booking for ${booking.turf?.name || 'Turf'} on ${booking.date} has been cancelled as requested.`;

                if (booking.isPaid) {
                    message += `\n\n💰 Refund Status: Since you paid online, a refund of ₹${booking.refundAmount} will be processed to your original payment method within 5-7 business days.`;
                } else {
                    message += `\n\n💰 No refund is applicable as this was a 'Pay at Venue' booking.`;
                }
                sendEmail(user.email, subject, message);
            }
        } catch (emailError) {
            console.log("Email failed:", emailError.message);
        }
        // ---------------------------------------

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
            // Added 'phone' here!
            .populate('user', 'name email image phone')
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

        // Populate user and turf for email details
        const booking = await Booking.findById(id)
            .populate('user')
            .populate('turf');

        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        if (booking.status === 'cancelled') return res.status(400).json({ success: false, message: "Already cancelled" });

        booking.status = 'cancelled';
        booking.refundAmount = booking.amount; // Full refund

        await booking.save();

        // --- EMAIL LOGIC: Admin Cancellation (Apology) ---
        try {
            if (booking.user && booking.user.email) {
                const subject = "⚠️ Important: Booking Cancellation Notice";
                const message = `Dear ${booking.user.name},\n\nWe sincerely apologize, but your booking for ${booking.turf?.name || 'our turf'} on ${booking.date} has been cancelled by the venue management due to unforeseen maintenance or circumstances.\n\n💰 A FULL refund of ₹${booking.amount} has been initiated and will reach you shortly.\n\nWe are very sorry for the inconvenience caused.\n\nSincerely,\nPowerPlay Management`;
                sendEmail(booking.user.email, subject, message);
            }
        } catch (emailError) {
            console.log("Email failed:", emailError.message);
        }
        // -------------------------------------------------

        res.json({ success: true, message: "Cancelled by Admin (Full Refund)", booking });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Bulk Booking (Updated with Safety Checks)
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

        // Conflict Check Logic
        const turf = await Turf.findById(turfId);
        const [reqStartStr, reqEndStr] = timeSlot.split(" - ");
        const reqStart = parseTimeToMinutes(reqStartStr);
        let reqEnd = parseTimeToMinutes(reqEndStr);
        if (reqEnd <= reqStart) reqEnd += 24 * 60;

        let conflictDate = null;

        for (const dateObj of datesToBook) {
            const existing = await Booking.find({
                turf: turfId,
                date: dateObj.toISOString().split('T')[0],
                status: { $ne: 'cancelled' }
            });

            for (const b of existing) {
                const [existStartStr, existEndStr] = b.timeSlot.split(" - ");
                const existStart = parseTimeToMinutes(existStartStr);
                let existEnd = parseTimeToMinutes(existEndStr);
                if (existEnd <= existStart) existEnd += 24 * 60;

                if (reqStart < existEnd && reqEnd > existStart) {
                    conflictDate = dateObj.toISOString().split('T')[0];
                    break;
                }
            }
            if (conflictDate) break;
        }

        if (conflictDate) {
            return res.status(400).json({ success: false, message: `Conflict on ${conflictDate}. Bulk action stopped.` });
        }

        // Calculate Price 
        const duration = (reqEnd - reqStart) / 60;
        const singlePrice = turf.price * duration;

        const bookingPromises = datesToBook.map(dateObj => {
            return new Booking({
                user: user._id,
                turf: turfId,
                date: dateObj.toISOString().split('T')[0],
                timeSlot,
                amount: singlePrice,
                paymentMethod: 'Offline/Bulk',
                isPaid: false,
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

// 8. Bulk Cancel (Admin)
export const cancelBulkBookingsAdmin = async (req, res) => {
    try {
        const { bookingIds } = req.body;
        const userId = req.userId;

        const adminUser = await User.findById(userId);
        if (!adminUser || adminUser.role !== 'owner') {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
            return res.status(400).json({ success: false, message: "No bookings selected" });
        }

        const bookingsToCancel = await Booking.find({
            _id: { $in: bookingIds },
            status: { $ne: 'cancelled' }
        });

        if (bookingsToCancel.length === 0) {
            return res.json({ success: true, message: "No active bookings found to cancel." });
        }

        const updates = bookingsToCancel.map(async (booking) => {
            booking.status = 'cancelled';
            booking.refundAmount = booking.amount;
            return booking.save();
        });

        await Promise.all(updates);

        res.json({ success: true, message: `Successfully cancelled ${bookingsToCancel.length} bookings.` });

    } catch (error) {
        console.error("Bulk Cancel Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};