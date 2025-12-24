import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  const fetchAllBookings = async () => {
    // Only set loading true on initial load, not during refresh to avoid flicker
    if (bookings.length === 0) setLoading(true);

    if (!isLoaded || !isSignedIn) return;
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/bookings/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setBookings(data.bookings);
        // Optional: Toast on manual refresh (if loading was false)
        if (!loading && bookings.length > 0) toast.success("Dashboard updated");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, [isLoaded, isSignedIn]);

  const markAsPaid = async (bookingId) => {
    if (!window.confirm("Mark this booking as PAID?")) return;
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${backendUrl}/api/bookings/update-payment/${bookingId}`,
        { isPaid: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Payment Status Updated!");
        fetchAllBookings();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // --- Helpers ---
  const getSportColor = (sport) => {
    switch (sport?.toLowerCase()) {
      case "cricket":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "football":
        return "bg-green-100 text-green-800 border-green-200";
      case "badminton":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // --- Filtering ---
  const filteredBookings = bookings.filter((b) => {
    if (filterType === "paid") return b.isPaid;
    if (filterType === "pending") return !b.isPaid && b.status !== "cancelled";
    if (filterType === "cancelled") return b.status === "cancelled";
    return true;
  });

  if (loading && bookings.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-12 font-sans mt-16">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Admin Console
          </h1>
          <p className="text-gray-500 mt-2">
            Manage bookings, payments, and schedules.
          </p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0 items-center">
          {/* REFRESH BUTTON */}
          <button
            onClick={fetchAllBookings}
            className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm text-sm font-bold hover:bg-gray-50 transition flex items-center gap-2 text-gray-700 h-full"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            Refresh
          </button>

          {/* Stats Card */}
          <div className="bg-white px-5 py-2 rounded-lg shadow-sm border border-gray-200 text-center min-w-[120px]">
            <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">
              Total Revenue
            </span>
            <span className="text-xl font-extrabold text-green-600">
              ₹
              {bookings
                .reduce((acc, curr) => acc + (curr.isPaid ? curr.amount : 0), 0)
                .toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4 justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Booking History</h2>
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            {["all", "paid", "pending", "cancelled"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 text-xs font-bold rounded-md capitalize transition-all ${
                  filterType === type
                    ? "bg-black text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Sport & Venue</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold text-center">Payment</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-400 italic"
                  >
                    No bookings found for this filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-blue-50/30 transition duration-150"
                  >
                    {/* 1. User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            booking.user?.image ||
                            "https://via.placeholder.com/40"
                          }
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                        />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {booking.user?.name || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.user?.email || "No Email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Sport Info */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSportColor(
                            booking.turf?.sportType
                          )} uppercase tracking-wide`}
                        >
                          {booking.turf?.sportType || "General"}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {booking.turf?.name}
                        </span>
                      </div>
                    </td>

                    {/* 3. Date & Time */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">
                          {formatDate(booking.date)}
                        </span>
                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                          🕒 {booking.timeSlot}
                        </span>
                      </div>
                    </td>

                    {/* 4. Payment Status */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-extrabold text-gray-900">
                          ₹{booking.amount}
                        </span>
                        {booking.status === "cancelled" ? (
                          <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                            CANCELLED
                          </span>
                        ) : booking.isPaid ? (
                          <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded flex items-center gap-1">
                            PAID <span className="text-xs">✓</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded animate-pulse">
                            PENDING
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {booking.paymentMethod}
                        </span>
                      </div>
                    </td>

                    {/* 5. Actions */}
                    <td className="px-6 py-4 text-right">
                      {!booking.isPaid && booking.status !== "cancelled" ? (
                        <button
                          onClick={() => markAsPaid(booking._id)}
                          className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105"
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <span className="text-gray-300 font-bold text-2xl select-none">
                          ···
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
