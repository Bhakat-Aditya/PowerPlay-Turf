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
  
  // Booking State
  const [bookingDate, setBookingDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/api/turfs/${id}`);
        if (data.success) setTurf(data.turf);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load turf details");
      }
    };
    fetchTurf();
  }, [id]);

  const handleBooking = async () => {
    if (!isSignedIn) return toast.error("Please login to book");
    if (!bookingDate || !selectedSlot) return toast.error("Please select Date & Time");

    try {
      const token = await getToken();
      const { data } = await axios.post(
        "http://localhost:3000/api/bookings/create",
        {
          turfId: turf._id,
          date: bookingDate,
          timeSlot: selectedSlot,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Booking Confirmed!");
        navigate("/bookings"); // Redirect to My Bookings
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking Failed");
    }
  };

  if (!turf) return <div className="pt-24 text-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      {/* Hero Image */}
      <div className="relative h-[40vh] w-full bg-black">
        <img src={turf.images[0]} alt={turf.name} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-extrabold">{turf.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left: Details */}
        <div className="lg:w-2/3 bg-white p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-4">About</h2>
          <p className="text-gray-600 mb-6">{turf.description}</p>
          
          <h3 className="font-bold mb-3">Amenities</h3>
          <div className="flex gap-3 flex-wrap">
            {turf.amenities.map((item, i) => (
              <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{item}</span>
            ))}
          </div>
        </div>

        {/* Right: Booking Form (CRITICAL UPDATE) */}
        <div className="lg:w-1/3 bg-white p-8 rounded-2xl shadow-lg h-fit sticky top-28">
          <div className="text-center mb-6">
            <span className="text-gray-500">Price per slot</span>
            <div className="text-4xl font-bold">₹{turf.price}</div>
          </div>

          {/* DATE PICKER */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Select Date</label>
            <input 
              type="date" 
              className="w-full border p-2 rounded-lg"
              onChange={(e) => setBookingDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* SLOT SELECTOR */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Select Time</label>
            <select 
              className="w-full border p-2 rounded-lg"
              onChange={(e) => setSelectedSlot(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Choose a slot</option>
              <option value="06:00 AM - 07:00 AM">06:00 AM - 07:00 AM</option>
              <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
              <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
              {/* Add more slots as needed */}
            </select>
          </div>

          <button 
            onClick={handleBooking}
            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
          >
            Confirm Booking
          </button>
        </div>

      </div>
    </div>
  );
};

export default FacilityDetails;