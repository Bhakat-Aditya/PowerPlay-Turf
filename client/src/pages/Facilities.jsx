import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const Facilities = () => {
  const [turfs, setTurfs] = useState([]);
  const { getToken } = useAuth();
  const { user } = useUser();

  // 1. Get Search Params sent from Hero.jsx
  const location = useLocation();
  const searchParams = location.state || {}; // { sport, date, startTime, duration }

  // ... (Keep existing generalAmenities array here) ...
  const generalAmenities = [
    { name: "Free Parking", icon: "🅿️", desc: "Spacious parking for bikes & cars" },
    { name: "Changing Rooms", icon: "👕", desc: "Clean separate rooms for men & women" },
    { name: "RO Water", icon: "💧", desc: "Chilled drinking water available" },
    { name: "Floodlights", icon: "💡", desc: "Pro-grade LED lighting for night games" },
    { name: "CCTV Surveillance", icon: "📹", desc: "24/7 security for your safety" },
    { name: "Equipment Rental", icon: "🏏", desc: "Bats, balls, and bibs available" },
  ];

  const fetchTurfs = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/turfs");
      if (data.success) {
        setTurfs(data.turfs);
      }
    } catch (error) {
      console.error("Error fetching turfs:", error);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  const handleSeed = async () => { /* ... Keep existing logic ... */ };
  const isOpeningSoon = (sportType) => { return sportType === "Gym" || sportType === "Badminton"; };

  // 2. Filter Logic
  const filteredTurfs = turfs.filter((turf) => {
    if (searchParams.sport) {
      // Case-insensitive check (e.g., 'cricket' matches 'Cricket')
      return turf.sportType?.toLowerCase() === searchParams.sport.toLowerCase();
    }
    return true; // If no search, show all
  });

  return (
    <div className="pt-24 pb-0 bg-white">
      {/* ... (Keep Hero Header and General Amenities Grid) ... */}
      <div className="text-center px-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 font-playfair">
          World-Class <span className="text-green-600">Amenities</span>
        </h1>
        {/* Show a message if filtering */}
        {searchParams.sport && (
          <p className="text-green-600 font-semibold mb-4">
            Showing results for: {searchParams.sport.toUpperCase()} 
            {searchParams.date && ` on ${searchParams.date}`}
          </p>
        )}
      </div>

       {/* General Amenities Grid (Keep as is) */}
       <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {generalAmenities.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <span className="text-4xl mb-3">{item.icon}</span>
              <h3 className="font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- 3. DETAILED SPORTS LIST (Modified to use filteredTurfs) --- */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24">
          <h2 className="text-3xl font-bold mb-10 text-center">
            {searchParams.sport ? `${searchParams.sport} Arenas` : "Our Sports Arenas"}
          </h2>

          <div className="space-y-12">
            {/* USE filteredTurfs INSTEAD OF turfs */}
            {filteredTurfs.length > 0 ? filteredTurfs.map((sport, index) => {
              const openingSoon = isOpeningSoon(sport.sportType);

              return (
                <div key={sport._id} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  
                  {/* ... (Keep Image Side logic same as before) ... */}
                  <div className="w-full md:w-1/2 h-64 md:h-80 relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                    <img src={sport.images?.[0]} alt={sport.name} className={`w-full h-full object-cover transition-transform duration-500 ${openingSoon ? "grayscale" : "hover:scale-105"}`}/>
                    {openingSoon && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="bg-yellow-500 text-black px-6 py-2 font-bold rounded-full tracking-wider shadow-lg transform -rotate-3 border-2 border-white">COMING SOON</span>
                      </div>
                    )}
                  </div>

                  {/* Text Side */}
                  <div className="w-full md:w-1/2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-playfair font-bold text-green-400">{sport.name}</h3>
                      {!openingSoon && <span className="bg-green-900/40 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/30">AVAILABLE</span>}
                    </div>
                    <p className="text-gray-400 leading-relaxed text-lg">{sport.description}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      {sport.amenities.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                          {/* ... icon svg ... */}
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-6">
                      {openingSoon ? (
                        <button disabled className="bg-gray-800 text-gray-500 px-8 py-3 rounded-lg font-bold cursor-not-allowed border border-gray-700">Launch Dates Revealing Soon</button>
                      ) : (
                        // 4. IMPORTANT: Pass searchParams to the Details Page
                        <Link
                          to={`/facilities/${sport._id}`}
                          state={{ 
                            date: searchParams.date, 
                            startTime: searchParams.startTime, 
                            duration: searchParams.duration // Passing duration
                          }}
                          className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-green-500 hover:text-white transition-all transform hover:scale-105"
                        >
                          Book Slot Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-10 text-gray-400">
                No arenas found for the selected criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facilities;