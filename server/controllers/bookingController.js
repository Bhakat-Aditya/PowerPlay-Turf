import Booking from '../models/Booking.js';
//function to check availability of turf

const checkTurfAvailability = async (date, timeSlot) => {
    try {
        const bookings = await Booking.find({ turf: turfId, date, timeSlot });
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.log(error.message);
    }
}

//  api to check is avalable

export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { turfId, date, timeSlot } = req.body;
        const isAvailable = await checkTurfAvailability(turfId, date, timeSlot);
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: "Error checking availability: " + error.message });
    }
}

// api to create booking
//  POST /api/bookings/book


export const createBooking = async (req, res) => {
    try {
        const { turfId, date, timeSlot, paymentMethod } = req.body;
        const userId = req.user._id;

        const isAvailable = await checkTurfAvailability(turfId, date, timeSlot);
        if (!isAvailable) {
            return res.json({ success: false, message: "Turf is not available for the selected date and time slot" });
        }
    } catch (error) {
        
    }
}