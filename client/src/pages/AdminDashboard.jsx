import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [activeTab, setActiveTab] = useState("bookings");

  // Data States
  const [bookings, setBookings] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  // Selection & Bulk State
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkData, setBulkData] = useState({
    userEmail: "",
    turfId: "",
    timeSlot: "06:00 PM - 07:00 PM",
    startDate: "",
    endDate: "",
    selectedDays: [],
  });

  const daysOptions = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // --- Fetch Data (Updated for Pagination) ---
  const fetchData = async (pageNum = 1) => {
    try {
      setLoading(true);
      const token = await getToken();

      const [bookingsRes, turfsRes] = await Promise.all([
        // Pass page & limit=60
        axios.get(`${backendUrl}/api/bookings/all?page=${pageNum}&limit=60`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${backendUrl}/api/turfs`),
      ]);

      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.bookings);
        // Update Pagination State
        setPage(bookingsRes.data.pagination.currentPage);
        setTotalPages(bookingsRes.data.pagination.totalPages);
        setTotalBookings(bookingsRes.data.pagination.totalBookings);
      }

      if (turfsRes.data.success) setTurfs(turfsRes.data.turfs);

      if (!loading) toast.success("Dashboard refreshed");
    } catch (error) {
      console.error(error);
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchData(page);
  }, [isLoaded, isSignedIn]); // Only initial load, page change handled by manual calls

  // --- Pagination Handlers ---
  const handleNextPage = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      fetchData(newPage);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchData(newPage);
    }
  };

  // --- SELECTION LOGIC ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allCancellableIds = bookings
        .filter((b) => b.status !== "cancelled")
        .map((b) => b._id);
      setSelectedIds(allCancellableIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkCancelAction = async () => {
    if (!window.confirm(`Cancel ${selectedIds.length} bookings?`)) return;
    try {
      const token = await getToken();
      toast.loading("Processing...");
      const { data } = await axios.put(
        `${backendUrl}/api/bookings/admin-cancel-bulk`,
        { bookingIds: selectedIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.dismiss();
      if (data.success) {
        toast.success(data.message);
        setSelectedIds([]);
        fetchData(page); // Stay on current page
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Bulk cancellation failed");
    }
  };

  const markAsPaid = async (bookingId) => {
    if (!window.confirm("Mark as PAID?")) return;
    try {
      const token = await getToken();
      await axios.put(
        `${backendUrl}/api/bookings/update-payment/${bookingId}`,
        { isPaid: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Updated");
      fetchData(page);
    } catch (error) {
      toast.error("Failed");
    }
  };

  const cancelBookingByAdmin = async (bookingId) => {
    const confirmCancel = window.prompt("Type 'CANCEL' to confirm:");
    if (confirmCancel !== "CANCEL") return;
    try {
      const token = await getToken();
      await axios.put(
        `${backendUrl}/api/bookings/admin-cancel/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Cancelled");
      fetchData(page);
    } catch (error) {
      toast.error("Failed");
    }
  };

  const handleUpdatePrice = async (turfId, currentPrice) => {
    const newPrice = prompt("Enter new price:", currentPrice);
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
      fetchData(page);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (bulkData.selectedDays.length === 0) return toast.error("Select days");
    try {
      const token = await getToken();
      toast.loading("Booking...");
      const { data } = await axios.post(
        `${backendUrl}/api/bookings/bulk-create`,
        bulkData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.dismiss();
      if (data.success) {
        toast.success(data.message);
        setActiveTab("bookings");
        fetchData(1); // Go back to page 1 to see new bookings
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed");
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

  if (loading && bookings.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">
        Loading Admin...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12 font-sans relative">
      {/* BULK ACTION BAR */}
      {selectedIds.length > 0 && activeTab === "bookings" && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-6 animate-bounce-in">
          <span className="font-bold">{selectedIds.length} Selected</span>
          <button
            onClick={handleBulkCancelAction}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-bold transition"
          >
            Cancel Selected
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Admin Console</h1>
            <p className="text-gray-500 mt-1">
              Total Bookings: {totalBookings}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData(page)}
              className="bg-white border px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50"
            >
              Refresh
            </button>
            <div className="flex bg-white p-1 rounded-xl shadow-sm border">
              {["bookings", "turfs", "bulk"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold capitalize ${
                    activeTab === tab
                      ? "bg-black text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-xs uppercase text-gray-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-10 text-center">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          bookings.length > 0 &&
                          selectedIds.length ===
                            bookings.filter((b) => b.status !== "cancelled")
                              .length
                        }
                      />
                    </th>
                    <th className="px-6 py-4 font-bold">User</th>
                    <th className="px-6 py-4 font-bold">Details</th>
                    <th className="px-6 py-4 font-bold text-center">
                      Financials
                    </th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {bookings.map((b) => {
                    const isCancelled = b.status === "cancelled";
                    return (
                      <tr
                        key={b._id}
                        className={`hover:bg-gray-50 ${
                          selectedIds.includes(b._id) ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-center">
                          {!isCancelled && (
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(b._id)}
                              onChange={() => handleSelectOne(b._id)}
                            />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={b.user?.image}
                              className="w-8 h-8 rounded-full bg-gray-200 object-cover"
                            />
                            <div>
                              <p className="font-bold">
                                {b.user?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {b.user?.email}
                              </p>
                              {/* 👇 ADDED PHONE NUMBER HERE */}
                              <p className="text-xs text-gray-500">
                                {b.user?.phone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold">{b.turf?.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            📅 {new Date(b.date).toLocaleDateString()} •{" "}
                            {b.timeSlot}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isCancelled ? (
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-400 line-through">
                                ₹{b.amount}
                              </span>
                              <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs mt-1">
                                Refunded: ₹{b.refundAmount}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              {b.amount === 0 ? (
                                <span className="text-[10px] font-black bg-gray-200 text-gray-600 px-3 py-1 rounded-full uppercase tracking-wider">
                                  BULK / OFFLINE
                                </span>
                              ) : (
                                <>
                                  <span className="font-bold text-lg">
                                    ₹{b.amount}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                      b.isPaid
                                        ? "bg-green-100 text-green-700"
                                        : "bg-orange-100 text-orange-700"
                                    }`}
                                  >
                                    {b.isPaid ? "PAID" : "PENDING"}
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {!isCancelled ? (
                            <div className="flex justify-end gap-2">
                              {!b.isPaid && (
                                <button
                                  onClick={() => markAsPaid(b._id)}
                                  className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                                >
                                  ✓ Paid
                                </button>
                              )}
                              <button
                                onClick={() => cancelBookingByAdmin(b._id)}
                                className="text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 font-bold text-xs uppercase">
                              Cancelled
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">
                Page <span className="font-bold text-black">{page}</span> of{" "}
                {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className={`px-4 py-2 text-sm font-bold rounded-lg border ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className={`px-4 py-2 text-sm font-bold rounded-lg border ${
                    page === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ... (Keep Turfs and Bulk Tab same as before) ... */}
        {activeTab === "turfs" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {turfs.map((turf) => (
              <div
                key={turf._id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
              >
                <img
                  src={turf.images[0]}
                  alt=""
                  className="w-full h-32 object-cover rounded-xl mb-4 bg-gray-100"
                />
                <h3 className="font-bold text-lg">{turf.name}</h3>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                  <span className="text-2xl font-black text-green-600">
                    ₹{turf.price}
                  </span>
                  <button
                    onClick={() => handleUpdatePrice(turf._id, turf.price)}
                    className="text-sm font-bold text-gray-600 underline hover:text-black"
                  >
                    Edit Price
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "bulk" && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-black mb-6">Create Bulk Booking</h2>
            <form onSubmit={handleBulkSubmit} className="space-y-5">
              <input
                type="email"
                placeholder="Client Email"
                className="w-full p-3 border rounded-lg bg-gray-50"
                value={bulkData.userEmail}
                onChange={(e) =>
                  setBulkData({ ...bulkData, userEmail: e.target.value })
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <select
                  className="p-3 border rounded-lg"
                  value={bulkData.turfId}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, turfId: e.target.value })
                  }
                  required
                >
                  <option value="">Select Turf</option>
                  {turfs.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <select
                  className="p-3 border rounded-lg"
                  value={bulkData.timeSlot}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, timeSlot: e.target.value })
                  }
                >
                  <option>06:00 AM - 07:00 AM</option>
                  <option>05:00 PM - 06:00 PM</option>
                  <option>06:00 PM - 07:00 PM</option>
                  <option>07:00 PM - 08:00 PM</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  className="p-3 border rounded-lg"
                  value={bulkData.startDate}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, startDate: e.target.value })
                  }
                  required
                />
                <input
                  type="date"
                  className="p-3 border rounded-lg"
                  value={bulkData.endDate}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, endDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2 uppercase">
                  Repeat Days
                </p>
                <div className="flex gap-2">
                  {daysOptions.map((day, i) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(i)}
                      className={`px-3 py-1 rounded-md text-sm font-bold ${
                        bulkData.selectedDays.includes(i)
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
