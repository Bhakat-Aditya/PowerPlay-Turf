import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast"; // Import Toast for alerts

const AdminDashboard = () => {
  const { backendUrl } = useContext(AppContext);
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch All Bookings ---
  const fetchAllBookings = async () => {
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
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Mark as Paid Function ---
  const markAsPaid = async (bookingId) => {
    if (!window.confirm("Confirm payment received?")) return;

    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${backendUrl}/api/bookings/update-payment/${bookingId}`,
        { isPaid: true }, // Set isPaid to true
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Payment Status Updated!");
        fetchAllBookings(); // Refresh the table automatically
      }
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  if (loading)
    return <div className="p-10 text-center text-xl">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Owner Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-gray-500 text-sm font-semibold">Total Revenue</h2>
          <p className="text-2xl font-bold">
            ₹
            {bookings.reduce(
              (acc, curr) => acc + (curr.isPaid ? curr.amount : 0),
              0
            )}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-gray-500 text-sm font-semibold">
            Total Bookings
          </h2>
          <p className="text-2xl font-bold">{bookings.length}</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-gray-600 font-bold">
                  Customer
                </th>
                <th scope="col" className="px-6 py-4 text-gray-600 font-bold">
                  Turf & Date
                </th>
                <th scope="col" className="px-6 py-4 text-gray-600 font-bold">
                  Slot
                </th>
                <th scope="col" className="px-6 py-4 text-gray-600 font-bold">
                  Amount
                </th>
                <th scope="col" className="px-6 py-4 text-gray-600 font-bold">
                  Payment Status
                </th>
                <th scope="col" className="px-6 py-4 text-gray-600 font-bold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {booking.user?.name || "Unknown User"}
                    <div className="text-xs text-gray-500">
                      {booking.user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{booking.turf?.name}</div>
                    <div className="text-gray-500">
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-mono">
                    {booking.timeSlot}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    ₹{booking.amount}
                  </td>

                  {/* Payment Status Column */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                        booking.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.isPaid ? "PAID" : "PENDING"}
                    </span>
                    <div className="text-xs text-gray-500 mt-1 font-medium">
                       Method: {booking.paymentMethod === 'Cash' ? 'Cash (Venue)' : 'Online'}
                    </div>
                  </td>

                  {/* ACTION COLUMN (The Button for your Father) */}
                  <td className="px-6 py-4">
                    {/* Logic: If NOT paid and NOT cancelled, show button */}
                    {!booking.isPaid && booking.status !== 'cancelled' ? (
                        <button 
                            onClick={() => markAsPaid(booking._id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded shadow transition-colors"
                        >
                            Mark as Paid
                        </button>
                    ) : booking.status === 'cancelled' ? (
                        <span className="text-red-500 font-bold text-xs">CANCELLED</span>
                    ) : (
                        <span className="text-green-600 font-bold text-lg">✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;