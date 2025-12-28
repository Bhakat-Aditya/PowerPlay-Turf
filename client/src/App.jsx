import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Facilities from "./pages/Facilities";
import FacilityDetails from "./pages/FacilityDetails";
import Footer from "./components/Footer";
import { Toaster, toast } from "react-hot-toast";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import MyBookings from "./pages/MyBookings";
import Reviews from "./pages/Reviews";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useAppContext } from "./context/AppContext";

// --- Internal Component: Stylish Phone Input Modal ---
const PhoneModal = ({ onSubmit, onClose }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    await onSubmit(phone);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-hidden">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative animate-fadeIn">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            {/* Phone Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Complete Profile</h2>
          <p className="text-gray-500 text-sm mt-2">
            We need your phone number to confirm your turf bookings.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const isOwnerPath = useLocation().pathname.includes("/owner");
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { backendUrl } = useAppContext(); // Ensure backendUrl is available here

  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // Check for Phone Number on Load
  useEffect(() => {
    const checkUserData = async () => {
      if (isSignedIn && isLoaded && backendUrl) {
        try {
          const token = await getToken();
          const { data } = await axios.get(`${backendUrl}/api/user/data`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // If phone is missing, show modal
          if (data.success && !data.phone) {
            setShowPhoneModal(true);
          }
        } catch (error) {
          console.error("Error checking user data:", error);
        }
      }
    };

    checkUserData();
  }, [isSignedIn, isLoaded, backendUrl, getToken]);

  // Handle saving the phone number
  const handleSavePhone = async (phone) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-phone`,
        { phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Phone number saved!");
        setShowPhoneModal(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save phone number.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />

      {/* Show Modal if Needed */}
      {showPhoneModal && <PhoneModal onSubmit={handleSavePhone} />}

      {!isOwnerPath && <Navbar />}

      <div className="flex-grow min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/facilities/:id" element={<FacilityDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>

      {!isOwnerPath && <Footer />}
    </div>
  );
}

export default App;
