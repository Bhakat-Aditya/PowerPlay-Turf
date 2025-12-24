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

  // Calendar State
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default today YYYY-MM-DD
  const [filterType, setFilterType] = useState("all"); // 'all', 'paid', 'pending'

  // --- Fetch Bookings ---
  const fetchAllBookings = async () => {
    if (!isLoaded || !isSignedIn) return;

    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/bookings/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setBookings(data.bookings);
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

  // --- Actions ---
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
        toast.success("Status Updated!");
        fetchAllBookings();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // --- Calculations for KPI Cards ---
  const totalRevenue = bookings.reduce(
    (acc, curr) => acc + (curr.isPaid ? curr.amount : 0),
    0
  );
  const pendingAmount = bookings.reduce(
    (acc, curr) =>
      acc + (!curr.isPaid && curr.status !== "cancelled" ? curr.amount : 0),
    0
  );
  const todaysBookings = bookings.filter(
    (b) => b.date === selectedDate && b.status !== "cancelled"
  );

  // --- Filter Logic ---
  const filteredBookings = bookings.filter((b) => {
    if (filterType === "paid") return b.isPaid;
    if (filterType === "pending") return !b.isPaid && b.status !== "cancelled";
    if (filterType === "cancelled") return b.status === "cancelled";
    return true;
  });

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-bold text-gray-600">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans mt-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">Welcome back, {user?.firstName}!</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAllBookings}
            className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
          >
            Refresh Data
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Stats & Calendar */}
        <div className="space-y-8">
          {/* 1. KPI Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500">
              <p className="text-xs font-bold text-gray-400 uppercase">
                Total Revenue
              </p>
              <p className="text-2xl font-extrabold text-gray-800 mt-1">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-yellow-500">
              <p className="text-xs font-bold text-gray-400 uppercase">
                Pending Cash
              </p>
              <p className="text-2xl font-extrabold text-gray-800 mt-1">
                ₹{pendingAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* 2. Mini Calendar / Date Picker */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">
              Select Date to View Schedule
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-lg"
            />

            {/* Daily Schedule List */}
            <div className="mt-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">
                Schedule for {new Date(selectedDate).toDateString()}
              </h4>
              {todaysBookings.length === 0 ? (
                <p className="text-sm text-gray-400 italic py-4 text-center bg-gray-50 rounded-lg">
                  No bookings for this date.
                </p>
              ) : (
                <div className="space-y-3">
                  {todaysBookings
                    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                    .map((booking) => (
                      <div
                        key={booking._id}
                        className={`p-3 rounded-lg border-l-4 flex justify-between items-center ${
                          booking.isPaid
                            ? "border-green-500 bg-green-50"
                            : "border-yellow-500 bg-yellow-50"
                        }`}
                      >
                        <div>
                          <p className="font-bold text-gray-800">
                            {booking.timeSlot}
                          </p>
                          <p className="text-xs text-gray-600">
                            {booking.user?.name}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            booking.isPaid
                              ? "text-green-700 bg-green-200"
                              : "text-yellow-700 bg-yellow-200"
                          }`}
                        >
                          {booking.isPaid ? "PAID" : "DUE"}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Full Booking Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">All Bookings History</h3>

            {/* Table Filters */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {["all", "paid", "pending", "cancelled"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 text-xs font-bold rounded-md capitalize transition ${
                    filterType === type
                      ? "bg-white shadow text-gray-800"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs">
                <tr>
                  <th className="px-6 py-4">Date / Slot</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      No bookings found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800">
                          {new Date(booking.date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {booking.timeSlot}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {booking.user?.name || "Guest"}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {booking.user?.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {booking.paymentMethod === "Cash" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-orange-100 text-orange-700">
                            📍 Cash
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">
                            💳 Online
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {booking.status === "cancelled" ? (
                          <span className="text-red-500 font-bold text-xs uppercase bg-red-50 px-2 py-1 rounded">
                            Cancelled
                          </span>
                        ) : booking.isPaid ? (
                          <span className="text-green-600 font-bold text-xs uppercase bg-green-50 px-2 py-1 rounded">
                            Paid
                          </span>
                        ) : (
                          <span className="text-yellow-600 font-bold text-xs uppercase bg-yellow-50 px-2 py-1 rounded">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!booking.isPaid && booking.status !== "cancelled" && (
                          <button
                            onClick={() => markAsPaid(booking._id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded shadow-sm transition"
                          >
                            Mark Paid
                          </button>
                        )}
                        {booking.isPaid && (
                          <span className="text-green-500 font-bold text-xl">
                            ✓
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
    </div>
  );
};

export default AdminDashboard;
