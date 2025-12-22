import React from "react";
import { Link, useNavigate } from "react-router-dom"; 

function Sportscard({ title, image, id, status }) {
  // Check if this specific card is marked as "Opening Soon"
  const isComingSoon = status === "Opening Soon";
  const navigate = useNavigate()

  return (
    <div className="group relative w-full rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl border border-gray-100 overflow-hidden">
      
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`h-full w-full object-cover transition-transform duration-500 ${isComingSoon ? 'grayscale-[50%]' : 'group-hover:scale-110'}`}
        />
        
        {/* OPENING SOON BADGE - Only shows if isComingSoon is true */}
        {isComingSoon && (
          <div className="absolute top-3 right-3 rounded-full bg-yellow-500/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
            OPENING SOON
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="mb-2 font-playfair text-xl font-bold text-gray-800">
          {title}
        </h3>
        
        <p className="mb-4 text-sm text-gray-500">
          Premium quality courts with professional lighting and amenities.
        </p>

        {/* Dynamic Button */}
        {isComingSoon ? (
          // DISABLED BUTTON for Opening Soon
          <button 
            disabled
            className="block w-full rounded-lg bg-gray-200 py-2.5 text-center text-sm font-bold text-gray-400 cursor-not-allowed"
          >
            Coming Soon
          </button>
        ) : (
          // ACTIVE BUTTON for Booking
          <Link 
            to={`/facilities/${id}`} 
            onClick={() => window.scrollTo(0, 0)}
            className="block w-full rounded-lg bg-black py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-800"
          >
            Book Slot
          </Link>
        )}
      </div>
    </div>
  );
}

export default Sportscard;