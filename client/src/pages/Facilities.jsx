import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

const Facilities = () => {
  const [turfs, setTurfs] = useState([]);
  const { getToken } = useAuth();
  const { user } = useUser();

  const location = useLocation();
  const searchParams = location.state || {}; // { sport, date, startTime, duration }

  // --- UPDATED AMENITIES WITH IMAGES ---
  const generalAmenities = [
    {
      name: "Free Parking",
      icon: "🅿️",
      desc: "Spacious parking for bikes & cars",
      image:
        "https://plus.unsplash.com/premium_photo-1661884049104-9d79c968a64c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmlrZSUyMHBhcmtpbmd8ZW58MHwwfDB8fHww",
    },
    {
      name: "Changing Rooms",
      icon: "👕",
      desc: "Clean separate rooms for men & women",
      image:
        "https://images.stockcake.com/public/d/f/d/dfd654ab-fd8f-4ca8-96a4-7fdd3a7a4321_large/sports-locker-room-stockcake.jpg",
    },
    {
      name: "RO Water",
      icon: "💧",
      desc: "Chilled drinking water available",
      image:
        "https://plus.unsplash.com/premium_photo-1737362946604-5b0d174dab40?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2F0ZXIlMjBwdXJpZmlyZXJ8ZW58MHwwfDB8fHww",
    },
    {
      name: "Floodlights",
      icon: "💡",
      desc: "Pro-grade LED lighting for night games",
      image:
        "https://www.stouchlighting.com/hs-fs/hubfs/Football%20Field%20Stadium%20Lights%20Sized%20for%20Blog%20Post.png?width=300&height=180&name=Football%20Field%20Stadium%20Lights%20Sized%20for%20Blog%20Post.png",
    },
    {
      name: "CCTV Surveillance",
      icon: "📹",
      desc: "24/7 security for your safety",
      image:
        "https://plus.unsplash.com/premium_photo-1681487394066-fbc71a037573?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2N0dnxlbnwwfDB8MHx8fDA%3D",
    },
    {
      name: "Equipment Rental",
      icon: "🏏",
      desc: "Bats, balls, and bibs available",
      image: "https://acceleratesports-qa.com/images/rentals_equipments.jpg",
    },
  ];

  const fetchTurfs = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/turfs`
      );
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

  const isOpeningSoon = (sportType) => {
    return sportType === "Gym" || sportType === "Badminton";
  };

  // Filter Logic
  const filteredTurfs = turfs.filter((turf) => {
    if (searchParams.sport) {
      return turf.sportType?.toLowerCase() === searchParams.sport.toLowerCase();
    }
    return true;
  });

  return (
    <div className="pt-24 pb-0 bg-white">
      {/* --- AMENITIES SECTION --- */}
      <div className="relative py-24 mb-16 overflow-hidden bg-gray-50">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-16 lg:px-24">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 font-playfair tracking-tight">
              World-Class <span className="text-green-600">Amenities</span>
            </h1>

            {searchParams.sport ? (
              <p className="text-green-600 font-semibold text-lg inline-block bg-green-50 px-4 py-1 rounded-full border border-green-200">
                Showing results for: {searchParams.sport.toUpperCase()}
                {searchParams.date && ` on ${searchParams.date}`}
              </p>
            ) : (
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Everything you need for a professional sporting experience,
                right here.
              </p>
            )}
          </div>

          {/* UPDATED Amenities Grid with Individual Backgrounds */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {generalAmenities.map((item, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center justify-center text-center p-6 h-64 rounded-2xl overflow-hidden shadow-lg group hover:scale-105 transition-all duration-300 border border-gray-200"
              >
                {/* Background Image for Card */}
                <div
                  className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                {/* Black Overlay for Readability */}
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors z-10"></div>

                {/* Content */}
                <div className="relative z-20">
                  <span className="text-5xl mb-4 block drop-shadow-md">
                    {item.icon}
                  </span>
                  <h3 className="font-bold text-white text-xl mb-2 tracking-wide">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-200 font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- DETAILED SPORTS LIST --- */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24">
          <h2 className="text-3xl font-bold mb-10 text-center uppercase tracking-widest text-gray-400">
            {searchParams.sport
              ? `${searchParams.sport} Arenas`
              : "Our Sports Arenas"}
          </h2>

          <div className="space-y-12">
            {filteredTurfs.length > 0 ? (
              filteredTurfs.map((sport, index) => {
                const openingSoon = isOpeningSoon(sport.sportType);

                return (
                  <div
                    key={sport._id}
                    className={`flex flex-col md:flex-row gap-8 items-center ${
                      index % 2 === 1 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Image Side */}
                    <div className="w-full md:w-1/2 h-64 md:h-80 relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800 group">
                      <img
                        src={sport.images?.[0]}
                        alt={sport.name}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          openingSoon ? "grayscale" : "group-hover:scale-110"
                        }`}
                      />
                      {openingSoon && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="bg-yellow-500 text-black px-6 py-2 font-bold rounded-full tracking-wider shadow-lg transform -rotate-3 border-2 border-white">
                            OPENING SOON...
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Text Side */}
                    <div className="w-full md:w-1/2 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-playfair font-bold text-green-400">
                          {sport.name}
                        </h3>
                        {!openingSoon && (
                          <span className="bg-green-900/40 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/30">
                            AVAILABLE
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 leading-relaxed text-lg">
                        {sport.description}
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                        {sport.amenities.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm text-gray-300"
                          >
                            <span className="text-green-500">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-6">
                        {openingSoon ? (
                          <button
                            disabled
                            className="bg-gray-800 text-gray-500 px-8 py-3 rounded-lg font-bold cursor-not-allowed border border-gray-700 w-full md:w-auto"
                          >
                            Dates Revealing Soon
                          </button>
                        ) : (
                          <Link
                            to={`/facilities/${sport._id}`}
                            state={{
                              date: searchParams.date,
                              startTime: searchParams.startTime,
                              duration: searchParams.duration,
                            }}
                            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-green-500 hover:text-white transition-all transform hover:scale-105 shadow-lg shadow-white/10 w-full md:w-auto text-center"
                          >
                            Book Slot Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
                <p className="text-gray-400 text-xl">
                  No arenas found matching your criteria.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-green-400 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facilities;
