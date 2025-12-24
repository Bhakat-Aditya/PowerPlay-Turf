import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: { 
        type: String, 
        ref: "User",      // <--- THIS LINE IS MISSING OR INCORRECT
        required: true 
    },
    turf: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Turf", 
        required: true 
    },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    
    status: { 
        type: String, 
        enum: ['booked', 'completed', 'cancelled'], 
        default: 'booked' 
    },
    
    amount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'UPI' },
    isPaid: { type: Boolean, default: false },

    paymentId: { type: String },
    orderId: { type: String },
    refundAmount: { type: Number, default: 0 }

}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;