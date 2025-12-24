import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import "dotenv/config";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- 1. Create Order ---
export const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    console.log("DEBUG: Booking Details:", { id: booking._id, amount: booking.amount });

    // Razorpay expects amount in PAISE (₹1 = 100 paise)
    const options = {
      amount: Math.round(booking.amount * 100), 
      currency: "INR",
      receipt: `receipt_${bookingId}`,
      notes: {
        bookingId: bookingId
      }
    };

    const order = await razorpay.orders.create(options);

    // Save the Order ID immediately (Optional but good practice)
    booking.orderId = order.id;
    await booking.save();

    res.json({ success: true, order });

  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: "Could not initiate payment" });
  }
};

// --- 2. Verify Payment ---
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // Security Check: Re-generate signature to verify it's really from Razorpay
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // ✅ Payment is Legit
      
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentMethod: "Online",
        paymentId: razorpay_payment_id, // <--- SAVING THIS IS CRITICAL FOR REFUNDS
        orderId: razorpay_order_id,
        status: "booked"
      });

      res.json({ success: true, message: "Payment Verified Successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid Payment Signature" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

// --- 3. Get Razorpay Key (Frontend needs this) ---
export const getKey = async (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};