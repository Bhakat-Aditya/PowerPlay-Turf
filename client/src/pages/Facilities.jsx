import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Facilities = () => {
  const [turfs, setTurfs] = useState([]);

  useEffect(() => {
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
    fetchTurfs();
  }, []);

  return (
    <div className="pt-24 pb-16 bg-white">
      {/* Hero Section ... (Keep your existing code) */}

      <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Our Sports Arenas
        </h2>
        <div className="space-y-12">
          {turfs.map((sport, index) => (
            <div
              key={sport._id}
              className={`flex flex-col md:flex-row gap-8 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full md:w-1/2 h-64 relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={sport.images[0]}
                  alt={sport.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="text-3xl font-playfair font-bold text-green-600">
                  {sport.name}
                </h3>
                <p className="text-gray-400">{sport.description}</p>

                {/* Link uses the REAL Database ID now */}
                <Link
                  to={`/facilities/${sport._id}`}
                  className="inline-block bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
                >
                  Book {sport.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Facilities;
