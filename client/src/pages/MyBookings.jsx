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

  // --- Helper: Calculate Time Left ---
  const getTimeRemaining = (bookingDate, timeSlot) => {
    try {
      // 1. Create a Date object for the booking
      const targetDate = new Date(bookingDate);

      // 2. Parse the start time from "HH:MM AM - HH:MM PM"
      // Example timeSlot: "06:00 PM - 07:00 PM"
      const startTimeString = timeSlot.split(" - ")[0]; // "06:00 PM"
      const [time, modifier] = startTimeString.split(" "); // ["06:00", "PM"]
      let [hours, minutes] = time.split(":");

      // Convert to 24h format
      if (hours === "12") hours = "00";
      if (modifier === "PM") hours = parseInt(hours, 10) + 12;

      targetDate.setHours(hours, parseInt(minutes, 10), 0, 0);

      // 3. Calculate Difference
      const now = new Date();
      const diffMs = targetDate - now;

      // If passed
      if (diffMs <= 0) return "Started / Past";

      // 4. Format Output
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hrs = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        return `${days}d ${hrs}h left`;
      }
      if (hrs > 0) {
        return `${hrs}h ${mins}m left`;
      }
      return `${mins}m left`;
    } catch (error) {
      return "";
    }
  };

  // --- Fetch Bookings ---
  const fetchBookings = async (isRefresh = false) => {
    try {
      let toastId;
      if (isRefresh) {
        toastId = toast.loading("Refreshing bookings...");
      }

      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/bookings/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setBookings(data.bookings);
        if (isRefresh) toast.success("Updated!", { id: toastId });
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

  // --- Handle Pay Now ---
  const handlePayment = async (booking) => {
    const token = await getToken();

    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Check your connection.");
      return;
    }

    try {
      const {
        data: { key },
      } = await axios.get(`${backendUrl}/api/payment/get-key`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data: orderData } = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        { bookingId: booking._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderData.success) {
        toast.error("Could not initiate payment.");
        return;
      }

      const options = {
        key: key,
        amount: orderData.order.amount,
        currency: "INR",
        name: "PowerPlay Turf",
        description: `Booking for ${booking.turf.name}`,
        order_id: orderData.order.id,

        handler: async function (response) {
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
              fetchBookings();
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
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900">My Bookings</h1>
          <button
            onClick={() => fetchBookings(true)}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition shadow-sm flex items-center gap-2"
          >
            <span>🔄</span> Refresh List
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-lg">
            You haven't booked any turfs yet.
          </div>
        ) : (
          <div className="space-y-8">
            {bookings.map((booking) => {
              const timeLeft = getTimeRemaining(booking.date, booking.timeSlot);
              const isCancelled = booking.status === "cancelled";

              return (
                <div
                  key={booking._id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col md:flex-row transition-all duration-300 ${
                    isCancelled ? "opacity-80" : "hover:shadow-xl"
                  }`}
                >
                  {/* --- IMAGE SECTION --- */}
                  <div className="md:w-2/5 h-56 md:h-auto bg-gray-200 relative overflow-hidden group">
                    <img
                      src={
                        booking.turf?.images?.[0] ||
                        booking.turf?.image ||
                        "https://placehold.co/400?text=No+Image"
                      }
                      alt="Turf"
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        isCancelled ? "grayscale" : "group-hover:scale-105"
                      }`}
                      onError={(e) =>
                        (e.target.src = "https://placehold.co/400?text=Error")
                      }
                    />

                    {/* CANCELLED WATERMARK */}
                    {isCancelled && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 pointer-events-none">
                        <h2 className="text-4xl md:text-5xl font-black text-red-600 tracking-widest -rotate-45 opacity-80 border-4 border-red-600 px-4 py-2 select-none uppercase shadow-lg bg-white/20 backdrop-blur-sm">
                          Cancelled
                        </h2>
                      </div>
                    )}

                    {/* STATUS BADGE (Top Left) */}
                    <div className="absolute top-4 left-4 z-20">
                      {isCancelled ? // Hidden here because we show big watermark
                      null : (
                        <div className="flex flex-col items-start shadow-lg">
                          <div className="bg-primary text-black px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-t-lg">
                            UPCOMING
                          </div>
                          <div className="bg-black text-white px-4 py-1.5 text-lg font-bold rounded-b-lg flex items-center gap-2">
                            ⏱ {timeLeft}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* --- DETAILS SECTION --- */}
                  <div className="p-6 md:w-3/5 flex flex-col justify-between relative">
                    {/* Background Pattern for aesthetics */}
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                      <svg
                        className="w-24 h-24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    </div>

                    <div>
                      <h3 className="text-3xl font-black text-gray-800 tracking-tight leading-none mb-2">
                        {booking.turf?.name || "Unknown Turf"}
                      </h3>
                      <p className="text-gray-500 font-medium mb-6 flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {booking.turf?.location || "Location unavailable"}
                      </p>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                            Date
                          </p>
                          <p className="font-bold text-gray-800">
                            {new Date(booking.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                day: "2-digit",
                                month: "short",
                              }
                            )}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                            Time
                          </p>
                          <p className="font-bold text-gray-800">
                            {booking.timeSlot}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-100 pt-6">
                      {/* Amount */}
                      <div>
                        {isCancelled ? (
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-400 line-through">
                              Total: ₹{Math.abs(booking.amount)}
                            </span>
                            <span className="text-red-600 font-bold">
                              Refunded: ₹{Math.abs(booking.refundAmount)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-bold uppercase">
                              Total Amount
                            </span>
                            <span className="text-2xl font-black text-gray-900">
                              ₹{Math.abs(booking.amount)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Payment/Actions */}
                      <div className="w-full sm:w-auto flex flex-col items-end gap-2">
                        {isCancelled ? (
                          <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-bold border border-gray-200 cursor-not-allowed">
                            Booking Inactive
                          </span>
                        ) : booking.isPaid ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 font-bold text-sm">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            PAID (
                            {booking.paymentMethod === "Cash"
                              ? "Venue"
                              : "Online"}
                            )
                          </div>
                        ) : (
                          <div className="flex gap-2 w-full sm:w-auto">
                            {booking.paymentMethod !== "Cash" && (
                              <button
                                onClick={() => handlePayment(booking)}
                                className="bg-black text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-gray-800 transition shadow-lg w-full sm:w-auto"
                              >
                                Pay Now
                              </button>
                            )}
                            {booking.paymentMethod === "Cash" && (
                              <span className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-bold border border-orange-200 flex items-center gap-1">
                                Pay at Venue
                              </span>
                            )}
                          </div>
                        )}

                        {/* Cancel Button */}
                        {!isCancelled && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold underline decoration-red-200 underline-offset-4 hover:decoration-red-500 transition-all"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
