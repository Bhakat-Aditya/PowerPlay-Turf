import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const FacilityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();

  const [turf, setTurf] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/turfs/${id}`
        );
        if (data.success) {
          setTurf(data.turf);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load turf details");
      } finally {
        setLoading(false);
      }
    };
    fetchTurf();
  }, [id]);

  const handleBooking = async () => {
    if (!isSignedIn) return toast.error("Please login to book");
    if (!bookingDate || !selectedSlot)
      return toast.error("Please select Date & Time");

    // Helper: Convert "16:00" -> "04:00 PM - 05:00 PM" for better display in MyBookings
    const formatSlotForDB = (time24) => {
      const [hours, mins] = time24.split(":");
      let h = parseInt(hours);
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12;
      h = h ? h : 12; // the hour '0' should be '12'
      const startTime = `${h}:${mins} ${ampm}`;

      // Calculate End Time (Assuming 1 hour slots)
      let nextH = (parseInt(hours) + 1) % 24;
      const nextAmpm = nextH >= 12 ? "PM" : "AM";
      let displayNextH = nextH % 12;
      displayNextH = displayNextH ? displayNextH : 12;
      const endTime = `${displayNextH}:${mins} ${nextAmpm}`;

      return `${startTime} - ${endTime}`;
    };

    const formattedSlot = formatSlotForDB(selectedSlot);

    try {
      const token = await getToken();
      const { data } = await axios.post(
        "http://localhost:3000/api/bookings/create",
        {
          turfId: turf._id,
          date: bookingDate,
          timeSlot: formattedSlot, // Sending the formatted range to DB
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Booking Confirmed!");
        navigate("/bookings");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking Failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!turf)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Turf Not Found
      </div>
    );

  const galleryImages =
    turf.images.length > 0 ? Array(5).fill(turf.images[0]) : [];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-24 font-sans">
      {/* 1. HERO SECTION */}
      <div className="relative h-[50vh] w-full bg-black">
        <img
          src={turf.images?.[0]}
          alt={turf.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
            {turf.name}
          </h1>
          <p className="text-lg md:text-xl text-green-400 font-medium tracking-wide">
            World Class {turf.sportType} Arena
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 -mt-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 2. LEFT COLUMN: DETAILS */}
          <div className="lg:w-2/3 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                About the Arena
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {turf.description}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Premium Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {turf.amenities.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100"
                  >
                    <span className="text-green-600 bg-white p-2 rounded-full shadow-sm">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="font-semibold text-gray-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. RIGHT COLUMN: BOOKING CARD */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 sticky top-28">
              <div className="text-center mb-6">
                <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Price per slot
                </span>
                <div className="flex items-baseline justify-center gap-1 mt-2">
                  <span className="text-5xl font-extrabold text-gray-900">
                    ₹{turf.price}
                  </span>
                  <span className="text-gray-500 font-medium">/ hour</span>
                </div>
              </div>

              {/* DATE PICKER */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Select Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* SLOT SELECTOR (UPDATED) */}
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Select Time
                </label>
                <select
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow bg-white"
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choose a slot
                  </option>
                  <option value="06:00">06:00 AM</option>
                  <option value="07:00">07:00 AM</option>
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                  <option value="19:00">07:00 PM</option>
                  <option value="20:00">08:00 PM</option>
                  <option value="21:00">09:00 PM</option>
                </select>
              </div>

              <button
                onClick={handleBooking}
                className="w-full bg-black text-white text-lg font-bold py-4 rounded-xl hover:bg-green-600 hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
              >
                Confirm Booking
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                *Cancellation available up to 24hrs before slot.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. EXPANDABLE GALLERY SECTION */}
      <div className="mt-24 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Arena Gallery
        </h2>
        <p className="text-gray-500 text-center mb-10">
          A visual tour of our world-class facilities
        </p>

        <div className="flex flex-col md:flex-row items-center gap-2 h-[400px] w-full mt-10 mx-auto">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative group flex-grow transition-all duration-500 ease-in-out w-full md:w-28 hover:w-[400px] rounded-2xl overflow-hidden h-[150px] md:h-[400px] shadow-lg cursor-pointer"
            >
              <img
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                src={image}
                alt={`Gallery ${index + 1}`}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>

              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="font-bold text-lg">View View</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacilityDetails;
