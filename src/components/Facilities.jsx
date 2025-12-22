import React from "react";
import { Link } from "react-router-dom";

const Facilities = () => {
  // 1. General Amenities Data (Common for all)
  const generalAmenities = [
    {
      name: "Free Parking",
      icon: "🅿️",
      desc: "Spacious parking for bikes & cars",
    },
    {
      name: "Changing Rooms",
      icon: "👕",
      desc: "Clean separate rooms for men & women",
    },
    { name: "RO Water", icon: "💧", desc: "Chilled drinking water available" },
    {
      name: "Floodlights",
      icon: "💡",
      desc: "Pro-grade LED lighting for night games",
    },
    {
      name: "CCTV Surveillance",
      icon: "📹",
      desc: "24/7 security for your safety",
    },
    {
      name: "Equipment Rental",
      icon: "bat",
      desc: "Bats, balls, and bibs available",
    },
  ];

  // 2. Specific Sports Details
  const sportsDetails = [
    {
      id: "cricket",
      title: "Box Cricket",
      image:
        "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop",
      features: [
        "60x40 Sq. Ft Pitch",
        "High-Quality Artificial Turf",
        "360° Net Enclosure",
        "Automatic Cricket Bowling Machine",
      ],
      status: "Active",
    },
    {
      id: "football",
      title: "5v5 Football",
      image:
        "https://images.unsplash.com/photo-1603314326654-9d640d6e5cce?w=400&auto=format&fit=crop&q=60",
      features: [
        "FIFA Approved Grass",
        "Impact Absorption Layer",
        "Standard 5v5 Dimensions",
        "Professional Goal Posts",
      ],
      status: "Active",
    },
    {
      id: "badminton",
      title: "Badminton Pro",
      image:
        "https://images.unsplash.com/photo-1708312604073-90639de903fc?w=400&auto=format&fit=crop&q=60",
      features: [
        "Synthetic Rubber Court",
        "Anti-Skid Surface",
        "Indoor Stadium",
        "BWF Standard Netting",
      ],
      status: "Opening Soon",
    },
    {
      id: "gym",
      title: "Power Gym",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      features: [
        "Cardio & Strength Zone",
        "Certified Trainers",
        "Modern Equipment",
        "Locker Facility",
      ],
      status: "Opening Soon",
    },
  ];

  return (
    <div className="pt-24 pb-16 bg-white">
      {/* --- HERO SECTION --- */}
      <div className="text-center px-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 font-playfair">
          World-Class <span className="text-green-600">Amenities</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          We don't just offer a ground; we offer a complete sports experience.
          From professional-grade turf to premium hospitality.
        </p>
      </div>

      {/* --- GENERAL AMENITIES GRID --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {generalAmenities.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <span className="text-4xl mb-3">
                {item.icon === "bat" ? "🏏" : item.icon}
              </span>
              <h3 className="font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- DETAILED SPORTS LIST --- */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Our Sports Arenas
          </h2>

          <div className="space-y-12">
            {sportsDetails.map((sport, index) => (
              <div
                key={sport.id}
                className={`flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image Side */}
                <div className="w-full md:w-1/2 h-64 md:h-80 relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={sport.image}
                    alt={sport.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {sport.status === "Opening Soon" && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-yellow-500 text-black px-4 py-2 font-bold rounded-full">
                        COMING SOON
                      </span>
                    </div>
                  )}
                </div>

                {/* Text Side */}
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-playfair font-bold text-green-400">
                      {sport.title}
                    </h3>
                    {sport.status === "Active" && (
                      <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-600/30">
                        AVAILABLE
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 leading-relaxed">
                    Designed for professionals and enthusiasts alike. Experience
                    the best game of your life on our premium surface.
                  </p>

                  {/* Feature List */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sport.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <svg
                          className="w-4 h-4 text-green-500 flex-shrink-0"
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
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <div className="pt-4">
                    {sport.status === "Active" ? (
                      <Link
                        to={`/facilities/${sport.id}`}
                        className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                      >
                        Book {sport.title}
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-800 text-gray-500 px-8 py-3 rounded-lg font-bold cursor-not-allowed"
                      >
                        Launch Date Revealing Soon
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facilities;
