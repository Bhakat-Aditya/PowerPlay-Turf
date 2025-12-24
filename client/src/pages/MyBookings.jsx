import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const MyBookings = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ACCESS ENV VARIABLE ---
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // --- Fetch Bookings ---
  const fetchBookings = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/bookings/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // --- Load Razorpay Script ---
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // --- Handle Pay Now (For Online Bookings) ---
  const handlePayment = async (booking) => {
    const token = await getToken();

    // 1. Load Script
    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Check your connection.");
      return;
    }

    try {
      // 2. Get Key ID
      const {
        data: { key },
      } = await axios.get(`${backendUrl}/api/payment/get-key`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3. Create Order
      const { data: orderData } = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        { bookingId: booking._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderData.success) {
        toast.error("Could not initiate payment.");
        return;
      }

      // 4. Open Razorpay Popup
      const options = {
        key: key,
        amount: orderData.order.amount,
        currency: "INR",
        name: "PowerPlay Turf",
        description: `Booking for ${booking.turf.name}`,
        order_id: orderData.order.id,

        handler: async function (response) {
          // 5. Verify Payment on Success
          try {
            const verifyRes = await axios.post(
              `${backendUrl}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: booking._id,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment Successful!");
              fetchBookings(); // Refresh UI to show 'Paid'
            }
          } catch (err) {
            toast.error("Payment Verification Failed");
            console.error(err);
          }
        },
        prefill: {
          name: user?.fullName || "User",
          email: user?.primaryEmailAddress?.emailAddress || "",
          contact: "",
        },
        theme: {
          color: "#16a34a",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Something went wrong with payment.");
    }
  };

  // --- Handle Cancel ---
  const handleCancel = async (bookingId) => {
    if (
      !window.confirm("Are you sure? If within 24 hours, 30% will be deducted.")
    ) {
      return;
    }

    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${backendUrl}/api/bookings/cancel/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancellation failed");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-lg">
            You haven't booked any turfs yet.
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col md:flex-row"
              >
                {/* Image Section */}
                <div className="md:w-1/3 h-48 md:h-auto bg-gray-200 relative">
                  <img
                    src={
                      booking.turf?.images?.[0] ||
                      booking.turf?.image ||
                      "https://placehold.co/400?text=No+Image"
                    }
                    alt="Turf"
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src = "https://placehold.co/400?text=Error")
                    }
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                        booking.status === "booked"
                          ? "bg-green-500 text-white"
                          : booking.status === "cancelled"
                          ? "bg-red-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {booking.turf?.name || "Unknown Turf"}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      📍 {booking.turf?.location || "Location unavailable"}
                    </p>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                      <div>
                        <p className="text-gray-400 font-medium">Date</p>
                        <p className="font-semibold text-gray-700">
                          {new Date(booking.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium">Time</p>
                        <p className="font-semibold text-gray-700">
                          {booking.timeSlot}
                        </p>
                      </div>

                      {/* Total Amount */}
                      <div>
                        <p className="text-gray-400 font-medium">
                          Total Amount
                        </p>
                        {booking.status === "cancelled" ? (
                          <div>
                            <span className="line-through text-gray-400 text-xs mr-2">
                              ₹{Math.abs(booking.amount)}
                            </span>
                            <span className="block text-red-600 font-bold text-lg">
                              Refund: ₹{Math.abs(booking.refundAmount)}
                            </span>
                          </div>
                        ) : (
                          <p className="font-bold text-lg text-gray-900">
                            ₹{Math.abs(booking.amount)}
                          </p>
                        )}
                      </div>

                      {/* Payment Status / Pay Button */}
                      <div>
                        <p className="text-gray-400 font-medium">Payment</p>

                        {/* 1. IF PAID */}
                        {booking.isPaid ? (
                          <p className="font-semibold text-green-600 flex items-center gap-1">
                            ✅ Paid (
                            {booking.paymentMethod === "Cash"
                              ? "At Venue"
                              : "Online"}
                            )
                          </p>
                        ) : booking.status === "cancelled" ? (
                          /* 2. IF CANCELLED */
                          <p className="font-semibold text-gray-400">
                            Cancelled
                          </p>
                        ) : (
                          /* 3. IF PENDING */
                          <div className="flex flex-col items-start gap-2">
                            {/* CASE A: Pay at Venue */}
                            {booking.paymentMethod === "Cash" ? (
                              <div className="flex items-center gap-2">
                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold border border-orange-200">
                                  Pay at Venue
                                </span>
                                <span className="text-gray-400 text-xs">
                                  (Cash)
                                </span>
                              </div>
                            ) : (
                              /* CASE B: Online Payment (Pending) */
                              <>
                                <span className="text-yellow-600 font-medium text-xs">
                                  Pending
                                </span>
                                <button
                                  onClick={() => handlePayment(booking)}
                                  className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
                                >
                                  Pay Now
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  {booking.status === "booked" && (
                    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 items-center">
                      <div className="flex-grow"></div>
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="w-full sm:w-auto text-red-500 border border-red-200 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-all text-sm"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
