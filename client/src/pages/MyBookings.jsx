import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const MyBookings = () => {
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        "https://power-play-turf-backend.vercel.app/api/bookings/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error(error);
      // toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure? If within 24 hours, 30% will be deducted.")) {
      return;
    }

    try {
      const token = await getToken();
      const { data } = await axios.put(
        `http://localhost:3000/api/bookings/cancel/${bookingId}`,
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-900">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-lg">You haven't booked any turfs yet.</div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/3 h-48 md:h-auto bg-gray-200 relative">
                  <img
                    src={booking.turf?.images?.[0] || booking.turf?.image || "https://placehold.co/400?text=No+Image"}
                    alt="Turf"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "https://placehold.co/400?text=Error")}
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                        booking.status === "booked" ? "bg-green-500 text-white" : 
                        booking.status === "cancelled" ? "bg-red-500 text-white" : "bg-gray-500 text-white"
                      }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{booking.turf?.name || "Unknown Turf"}</h3>
                    <p className="text-gray-500 text-sm mb-4">📍 {booking.turf?.location || "Location unavailable"}</p>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                      <div>
                        <p className="text-gray-400 font-medium">Date</p>
                        <p className="font-semibold text-gray-700">
                          {new Date(booking.date).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium">Time</p>
                        <p className="font-semibold text-gray-700">{booking.timeSlot}</p>
                      </div>

                      {/* Total Amount / Refund Logic */}
                      <div>
                        <p className="text-gray-400 font-medium">Total Amount</p>
                        {booking.status === "cancelled" ? (
                          <div>
                            <span className="line-through text-gray-400 text-xs mr-2">₹{booking.amount}</span>
                            <span className="block text-red-600 font-bold text-lg">
                              Refund: ₹{booking.refundAmount}
                            </span>
                          </div>
                        ) : (
                          <p className="font-bold text-lg text-gray-900">₹{booking.amount}</p>
                        )}
                      </div>

                      <div>
                        <p className="text-gray-400 font-medium">Payment</p>
                        <p className="font-semibold text-yellow-600">Pending (Pay at Venue)</p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
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