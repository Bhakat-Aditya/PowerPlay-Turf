import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const FacilityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Booking Data
  const { date, startTime, duration: initialDuration } = location.state || {};
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking State
  const [bookingDate, setBookingDate] = useState(date || "");
  const [selectedSlot, setSelectedSlot] = useState(startTime || "");
  const [duration, setDuration] = useState(initialDuration || 1);

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const { data } = await axios.get(
          `https://power-play-turf-backend.vercel.app/api/turfs/${id}`
        );
        if (data.success) setTurf(data.turf);
      } catch (error) {
        toast.error("Failed to load turf details");
      } finally {
        setLoading(false);
      }
    };
    fetchTurf();
  }, [id]);

  // --- 2. Logic & Handlers ---
  const openLightbox = (imgSrc) => {
    setCurrentImage(imgSrc);
    setIsLightboxOpen(true);
  };

  const formatSlotForDB = (time24, durationHours) => {
    const [hours, mins] = time24.split(":");
    let h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    let displayH = h % 12 || 12;
    const startStr = `${displayH}:${mins} ${ampm}`;

    let nextH = (parseInt(hours) + durationHours) % 24;
    const nextAmpm = nextH >= 12 ? "PM" : "AM";
    let displayNextH = nextH % 12 || 12;
    const endStr = `${displayNextH}:${mins} ${nextAmpm}`;

    return `${startStr} - ${endStr}`;
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let i = 6; i <= 23; i++) {
      const time = i < 10 ? `0${i}:00` : `${i}:00`;
      const label =
        i < 12 ? `${i}:00 AM` : i === 12 ? `12:00 PM` : `${i - 12}:00 PM`;
      options.push(
        <option key={time} value={time}>
          {label}
        </option>
      );
    }
    return options;
  };

  const handleBooking = async () => {
    if (!isSignedIn) return toast.error("Please login to book");
    if (!bookingDate || !selectedSlot) return toast.error("Select date/time");

    try {
      const token = await getToken();
      const { data } = await axios.post(
        "http://localhost:3000/api/bookings/book",
        {
          turfId: turf._id,
          date: bookingDate,
          timeSlot: formatSlotForDB(selectedSlot, duration),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Booking Confirmed!");
        navigate("/bookings");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking Failed");
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
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Turf Not Found
      </div>
    );

  // Prepare Images
  const galleryImages =
    turf.images?.length > 0 ? turf.images : turf.image ? [turf.image] : [];
  const heroImage =
    galleryImages[0] || "https://placehold.co/1200x600?text=Turf+Image";

  return (
    <>
      {/* Injecting Fonts Locally for this component */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
      `}</style>

      <div className="bg-gray-50 min-h-screen font-poppins pb-20">
        {/* --- LIGHTBOX --- */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button className="absolute top-6 right-6 text-white text-5xl hover:text-gray-400">
              &times;
            </button>
            <img
              src={currentImage}
              alt="Expanded"
              className="max-h-[90vh] max-w-[95vw] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* --- HERO SECTION --- */}
        <div className="relative h-[60vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img
            src={heroImage}
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight">
              {turf.name}
            </h1>
            <p className="text-xl text-gray-200 flex items-center gap-2 bg-black/30 px-6 py-2 rounded-full backdrop-blur-md border border-white/20">
              📍 {turf.location}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30 flex flex-col lg:flex-row gap-8">
          {/* --- LEFT: INFO --- */}
          <div className="lg:w-2/3 space-y-8">
            {/* Description Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-4">
                About the Arena
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {turf.description ||
                  "Experience top-tier sports facilities designed for performance and comfort."}
              </p>
            </div>

            {/* Amenities Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Premium Amenities
              </h2>
              <div className="flex flex-wrap gap-3">
                {turf.amenities?.length > 0 ? (
                  turf.amenities.map((item, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-black hover:text-white transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">
                    Amenities details coming soon...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* --- RIGHT: BOOKING CARD --- */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 sticky top-28">
              <div className="text-center mb-8">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
                  Total Price
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter">
                    ₹{(turf.price || 0) * duration}
                  </span>
                  <span className="text-gray-500 font-medium">
                    / {duration} hrs
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-bold text-gray-700 ml-1 mb-1 block">
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700 ml-1 mb-1 block">
                      Duration
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-black outline-none transition text-center font-bold"
                      value={duration}
                      onChange={(e) =>
                        setDuration(Math.max(1, Number(e.target.value)))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 ml-1 mb-1 block">
                      Start Time
                    </label>
                    <select
                      className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-black outline-none transition appearance-none"
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                    >
                      <option value="" disabled>
                        --:--
                      </option>
                      {generateTimeOptions()}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full bg-black text-white text-lg font-bold py-5 rounded-xl hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-200 mt-4"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM: ACCORDION GALLERY --- */}
        {galleryImages.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 mt-24 mb-10">
            <h2 className="text-3xl font-bold text-center mb-2">Visual Tour</h2>
            <p className="text-gray-500 text-center mb-10 max-w-lg mx-auto">
              Explore the arena through our lens. Click any panel to expand and
              view in high resolution.
            </p>

            {/* THE ACCORDION COMPONENT */}
            <div className="flex items-center gap-2 h-[500px] w-full mx-auto">
              {galleryImages.slice(0, 6).map((img, idx) => (
                <div
                  key={idx}
                  className="relative group flex-grow transition-all duration-500 ease-in-out w-24 hover:w-[400px] rounded-2xl overflow-hidden h-full cursor-pointer shadow-lg hover:shadow-2xl"
                  onClick={() => openLightbox(img)}
                >
                  <img
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    src={img}
                    alt={`Gallery ${idx}`}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  {/* Optional: Text that appears on hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end h-1/2">
                    <span className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      View Fullscreen
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FacilityDetails;
