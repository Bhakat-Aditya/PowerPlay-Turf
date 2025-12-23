import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: { 
        type: String, 
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

    // --- NEW FIELDS FOR PAYMENTS & REFUNDS ---
    paymentId: { type: String },       // Stores Razorpay Payment ID (pay_xxx)
    orderId: { type: String },         // Stores Razorpay Order ID (order_xxx)
    refundAmount: { type: Number, default: 0 } // Stores how much was refunded

}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;