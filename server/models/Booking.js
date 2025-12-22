import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    // FIX: Changed from ObjectId to String to match User._id (Clerk ID)
    user: { 
        type: String, 
        ref: "User", 
        required: true 
    },
    
    // Turf will likely use standard MongoDB ObjectId
    turf: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Turf", 
        required: true 
    },
    
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    
    // Using a simple status enum
    status: { 
        type: String, 
        enum: ['booked', 'completed', 'cancelled'], 
        default: 'booked' 
    },
    
    paymentMethod: { type: String, default: 'UPI' },
    isPaid: { type: Boolean, default: false },

    // Added 'amount' so you know how much was paid
    amount: { type: Number, required: true }

}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;