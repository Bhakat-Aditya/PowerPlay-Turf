import React from "react";
import SportsCard from "./Sportscard";

// --- HARDCODED DATA ---
const services = [
  {
    id: "cricket",
    title: "Box Cricket",
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop",
    status: "Active", // This one is ready
  },
  {
    id: "football",
    title: "Football Turf",
    image:
      "https://images.unsplash.com/photo-1603314326654-9d640d6e5cce?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjM5fHxzb2NjZXJ8ZW58MHx8MHx8fDA%3D",
    status: "Active", // This one is ready
  },
  {
    id: "badminton",
    title: "Badminton Court",
    image:
      "https://images.unsplash.com/photo-1708312604073-90639de903fc?w=400&auto=format&fit=crop&q=60",
    status: "Opening Soon", // <--- MARKED AS OPENING SOON
  },
  {
    id: "gym",
    title: "Modern Gym",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    status: "Opening Soon", // <--- MARKED AS OPENING SOON
  },
];

function Services() {
  return (
    <div className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-8xl font-extrabold text-gray-900 sm:text-4xl overflow-y-hidden">
            Our <span className="text-green-600 overflow-y-hidden">Facilities</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            World-class sports infrastructure right here in Midnapore.
          </p>
        </div>

        {/* Grid for Cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <SportsCard
              key={service.id}
              id={service.id}
              title={service.title}
              image={service.image}
              status={service.status} // Passing the status prop
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;
