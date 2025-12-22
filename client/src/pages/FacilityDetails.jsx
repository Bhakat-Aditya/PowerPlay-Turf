import React from "react";
import { useParams, Link } from "react-router-dom";

// --- DATA: Details for each Facility ---
const facilityData = {
  cricket: {
    title: "Pro Box Cricket",
    tagline: "The best turf cricket experience in Midnapore.",
    description:
      "Step onto our premium quality artificial turf designed for fast-paced box cricket action. Whether it's a friendly match or a competitive tournament, our arena offers professional-grade netting, high-intensity floodlights for night matches, and a digital scoreboard to keep track of every run. Perfect for 6v6 or 8v8 matches.",
    price: "₹800",
    unit: "/ hour",
    features: [
      "FIFA-approved Turf",
      "30ft Height Nets",
      "Night Vision Floodlights",
      "Dugout Seating",
      "Live Streaming Camera",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593341646782-e0b495cffd32?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?q=80&w=800&auto=format&fit=crop",
    ],
  },
  football: {
    title: "5v5 Football Arena",
    tagline: "Fast-paced action on professional grass.",
    description:
      "Experience football like never before on our shock-absorbent synthetic turf. Designed for 5-a-side games, this court reduces injury risk and allows for high-speed gameplay. We provide professional goal posts, marking bibs, and a referee stand for tournaments.",
    price: "₹1000",
    unit: "/ hour",
    features: [
      "Impact Absorption Turf",
      "Enclosed Arena",
      "Professional Goal Posts",
      "Marking Bibs Provided",
      "Spectator Gallery",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
    ],
  },
  badminton: {
    title: "Indoor Badminton Court",
    tagline: "Smash it on our pro-synthetic courts.",
    description:
      "Play comfortably in any weather with our fully air-conditioned indoor stadium. Our courts use BWF-standard synthetic mats that offer excellent grip and cushioning to protect your knees. Ideal for singles and doubles practice.",
    price: "₹400",
    unit: "/ hour",
    features: [
      "BWF Standard Mats",
      "Air Conditioned Hall",
      "Anti-Glare Lighting",
      "Racket Rental Available",
      "Changing Rooms",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1626224583764-847890e0e966?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599474924187-334a4ae513df?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1627515152865-c7e0c4033285?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615117970146-24e532b2609c?q=80&w=800&auto=format&fit=crop",
    ],
  },
  gym: {
    title: "Power Fitness Gym",
    tagline: "Train like a beast in our modern facility.",
    description:
      "A state-of-the-art fitness center equipped with the latest cardio and strength training machines. We offer personal training, yoga sessions, and a dedicated cross-fit section. Membership includes access to the steam bath and locker facilities.",
    price: "₹1500",
    unit: "/ month",
    features: [
      "Cardio & Strength Zones",
      "Certified Trainers",
      "Steam Bath",
      "Crossfit Section",
      "Diet Consultation",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800&auto=format&fit=crop",
    ],
  },
};

const FacilityDetails = () => {
  const { id } = useParams();
  const data = facilityData[id];

  // Handle case where ID doesn't exist
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <h2 className="text-2xl font-bold text-gray-400">Facility Not Found</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-20 pt-24">
      {/* 1. HERO SECTION */}
      <div className="relative h-[40vh] md:h-[50vh] w-full bg-black">
        <img
          src={data.gallery[0]}
          alt={data.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl text-green-400 font-medium tracking-wide">
            {data.tagline}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 -mt-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 2. LEFT COLUMN: DETAILS */}
          <div className="lg:w-2/3 space-y-8">
            {/* Description Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                About the Arena
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {data.description}
              </p>
            </div>

            {/* Features Grid */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Premium Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5 text-green-600"
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
                    <span className="font-semibold text-gray-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. RIGHT COLUMN: BOOKING CARD (Sticky) */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 sticky top-28">
              <div className="text-center mb-6">
                <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Price per slot
                </span>
                <div className="flex items-baseline justify-center gap-1 mt-2">
                  <span className="text-5xl font-extrabold text-gray-900">
                    {data.price}
                  </span>
                  <span className="text-gray-500 font-medium">{data.unit}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm text-gray-600 py-2 border-b border-gray-100">
                  <span>Open Hours</span>
                  <span className="font-semibold text-black">
                    6:00 AM - 11:00 PM
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 py-2 border-b border-gray-100">
                  <span>Equipment</span>
                  <span className="font-semibold text-black">
                    Available for Rent
                  </span>
                </div>
              </div>

              <button className="w-full bg-black text-white text-lg font-bold py-4 rounded-xl hover:bg-green-600 transition-all transform hover:scale-[1.02] shadow-xl">
                Book Slot Now
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                *Cancellation available up to 24hrs before slot.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. EXPANDABLE GALLERY SECTION (User's Template) */}
      <div className="mt-24 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Arena Gallery
        </h2>
        <p className="text-gray-500 text-center mb-10">
          A visual tour of our world-class facilities
        </p>

        <div className="flex flex-col md:flex-row items-center gap-2 h-[400px] w-full mt-10 mx-auto">
          {data.gallery.map((image, index) => (
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacilityDetails;
