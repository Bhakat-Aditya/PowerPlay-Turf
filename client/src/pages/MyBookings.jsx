import React, { useEffect, useState } from "react";
import { useUser, useAuth, RedirectToSignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Optional: for error messages

const MyBookings = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { getToken } = useAuth(); // Hook to get the JWT token
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Bookings from API
  const fetchUserBookings = async () => {
    try {
      const token = await getToken();
      
      // FIX: Use your actual Backend URL
      const { data } = await axios.get("http://localhost:3000/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchUserBookings();
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-500 mt-1">
              Welcome back, <span className="font-semibold text-black">{user.firstName}</span>!
            </p>
          </div>
          <Link to="/facilities" className="hidden sm:block text-green-600 font-semibold hover:underline">
            + Book New Slot
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading your bookings...</div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row transition-all hover:shadow-md">
                
                {/* Image Section - handling missing images safely */}
                <div className="w-full sm:w-48 h-32 sm:h-auto bg-gray-200 relative">
                  <img
                    src={booking.turf?.images?.[0] || "https://via.placeholder.com/300?text=No+Image"}
                    alt={booking.turf?.name || "Turf"}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content Section */}
                <div className="p-5 flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-800">{booking.turf?.name || "Unknown Turf"}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {/* Date Formatting */}
                      📅 {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      ⏰ {booking.timeSlot}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                    <span className="text-xl font-bold text-gray-900">₹{booking.amount}</span>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${booking.status === 'booked' ? 'bg-blue-100 text-blue-700' : ''}
                      ${booking.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                      ${booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
            <Link to="/facilities" className="bg-black text-white px-6 py-2 rounded-lg mt-4 inline-block hover:bg-green-600">
              Book a Slot
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;