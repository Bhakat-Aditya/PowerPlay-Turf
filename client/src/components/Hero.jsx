import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  // 1. Create State for Form Inputs
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1);

  // 2. Handle Search / Navigation
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Validate: At least Sport should be selected
    if (!sport) {
      alert("Please select a sport to continue.");
      return;
    }

    // Navigate to Facilities page with the search data
    navigate("/facilities", {
      state: {
        sport,
        date,
        startTime,
        duration,
      },
    });
  };

  return (
    <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/hero.png")] no-repeat bg-cover bg-center h-screen'>
      <p className="bg-[#97A]/60 px-3.5 py-1 rounded-full mt-20 overflow-x-hidden">
        The Ultimate Sports Experience
      </p>
      <h1 className="font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4 overflow-y-hidden">
        Midnapore’s Premier Sports Arena
      </h1>
      <p className="max-w-130 mt-2 text-sm md:text-base">
        Book top-quality turf for Cricket, Football, and Badminton. Experience
        pro-level facilities and a fully equipped gym.
      </p>

      {/* 3. Attach onSubmit handler */}
      <form onSubmit={handleSearch} className="bg-white text-gray-600 rounded-xl px-8 py-6 flex flex-col md:flex-row max-md:items-start gap-6 max-md:mx-auto shadow-2xl border border-gray-100 mt-8 relative z-20 max-w-6xl mx-auto">
        
        {/* Sport Selection */}
        <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <label className="font-bold text-gray-800 text-sm uppercase tracking-wider">Sport</label>
          </div>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full bg-transparent text-gray-900 font-semibold text-lg outline-none cursor-pointer placeholder-gray-400"
          >
            <option value="" disabled>Select Sport</option>
            <option value="cricket">Cricket</option>
            <option value="football">Football</option>
            <option value="badminton">Badminton</option>
            <option value="gym">Gym Session</option>
          </select>
        </div>

        {/* Date Selection */}
        <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4 md:pl-4">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <label className="font-bold text-gray-800 text-sm uppercase tracking-wider">Date</label>
          </div>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent text-gray-900 font-semibold text-lg outline-none cursor-pointer"
          />
        </div>

        {/* Time Selection */}
        <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4 md:pl-4">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <label className="font-bold text-gray-800 text-sm uppercase tracking-wider">Start Time</label>
          </div>
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full bg-transparent text-gray-900 font-semibold text-lg outline-none cursor-pointer"
          >
            <option value="" disabled>Select Slot</option>
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

        {/* Duration Selection */}
        <div className="w-full md:w-auto flex flex-col min-w-[120px] pb-4 md:pb-0 md:pl-4">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <label className="font-bold text-gray-800 text-sm uppercase tracking-wider">Duration</label>
          </div>
          <div className="flex items-baseline mt-1">
            <input
              type="number"
              min={1}
              max={5}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-16 bg-transparent text-gray-900 font-semibold text-lg outline-none border-b-2 border-gray-200 focus:border-green-500 transition pb-1"
            />
            <span className="ml-2 text-gray-500 text-sm font-medium">Hr(s)</span>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="flex items-center justify-center gap-2 rounded-lg bg-black hover:bg-gray-800 py-4 px-8 text-white font-bold transition duration-300 md:ml-auto w-full md:w-auto shadow-lg transform hover:-translate-y-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Check Availability</span>
        </button>
      </form>
    </div>
  );
}

export default Hero;