import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [activeTab, setActiveTab] = useState("bookings"); // bookings | turfs | bulk
  const [bookings, setBookings] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Bulk Booking States ---
  const [bulkData, setBulkData] = useState({
    userEmail: "",
    turfId: "",
    timeSlot: "06:00 PM - 07:00 PM",
    startDate: "",
    endDate: "",
    selectedDays: [], // 0=Sun, 1=Mon...
  });

  const daysOptions = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // --- Fetch Data ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const [bookingsRes, turfsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/bookings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${backendUrl}/api/turfs`),
      ]);

      if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);
      if (turfsRes.data.success) setTurfs(turfsRes.data.turfs);
    } catch (error) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchData();
  }, [isLoaded, isSignedIn]);

  // --- Actions ---
  const handleUpdatePrice = async (turfId, currentPrice) => {
    const newPrice = prompt("Enter new price per hour:", currentPrice);
    if (!newPrice || newPrice === currentPrice) return;

    try {
      const token = await getToken();
      await axios.put(
        `${backendUrl}/api/turfs/${turfId}`,
        { price: newPrice },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Price updated!");
      fetchData();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (bulkData.selectedDays.length === 0)
      return toast.error("Select at least one day");

    try {
      const token = await getToken();
      toast.loading("Calculating availability...");

      const { data } = await axios.post(
        `${backendUrl}/api/bookings/bulk-create`,
        bulkData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.dismiss();
      if (data.success) {
        toast.success(data.message);
        setActiveTab("bookings");
        fetchData();
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Bulk booking failed");
    }
  };

  const toggleDay = (index) => {
    setBulkData((prev) => {
      const days = prev.selectedDays.includes(index)
        ? prev.selectedDays.filter((d) => d !== index)
        : [...prev.selectedDays, index];
      return { ...prev, selectedDays: days };
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">Admin Console</h1>
          <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-200 mt-4 md:mt-0">
            {["bookings", "turfs", "bulk"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md text-sm font-bold capitalize transition-all ${
                  activeTab === tab
                    ? "bg-black text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {tab === "bulk" ? "⚡ Bulk Book" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- TAB 1: BOOKINGS (Existing) --- */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Turf</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td className="px-4 py-3 font-bold">
                        {b.user?.name || "Unknown"}
                      </td>
                      <td className="px-4 py-3">{b.turf?.name}</td>
                      <td className="px-4 py-3">
                        {new Date(b.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            b.status === "cancelled"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 2: MANAGE TURFS (Edit Button) --- */}
        {activeTab === "turfs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {turfs.map((turf) => (
              <div
                key={turf._id}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition"
              >
                <div className="h-40 bg-gray-200 rounded-xl mb-4 overflow-hidden">
                  <img
                    src={turf.images[0]}
                    alt={turf.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">{turf.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{turf.location}</p>

                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-xs text-gray-400 uppercase font-bold">
                      Price / Hour
                    </span>
                    <p className="text-2xl font-black text-green-600">
                      ₹{turf.price}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUpdatePrice(turf._id, turf.price)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition"
                  >
                    ✎ Edit Price
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- TAB 3: BULK BOOKING (New Feature) --- */}
        {activeTab === "bulk" && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-black mb-2">
              Recurring / Bulk Booking
            </h2>
            <p className="text-gray-500 mb-8">
              Book a slot for a client for an entire month or season.
            </p>

            <form onSubmit={handleBulkSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Client Email
                </label>
                <input
                  required
                  type="email"
                  placeholder="client@gmail.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  value={bulkData.userEmail}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, userEmail: e.target.value })
                  }
                />
                <p className="text-xs text-gray-400 mt-1">
                  * Client must be registered on the app first.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Turf
                  </label>
                  <select
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                    value={bulkData.turfId}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, turfId: e.target.value })
                    }
                  >
                    <option value="">Select Turf</option>
                    {turfs.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.sportType})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Time Slot
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                    value={bulkData.timeSlot}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, timeSlot: e.target.value })
                    }
                  >
                    <option>06:00 AM - 07:00 AM</option>
                    <option>05:00 PM - 06:00 PM</option>
                    <option>06:00 PM - 07:00 PM</option>
                    <option>07:00 PM - 08:00 PM</option>
                    <option>08:00 PM - 09:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={bulkData.startDate}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={bulkData.endDate}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Repeat On (Days)
                </label>
                <div className="flex gap-2 flex-wrap">
                  {daysOptions.map((day, index) => (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(index)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                        bulkData.selectedDays.includes(index)
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg"
              >
                Confirm Bulk Booking
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
