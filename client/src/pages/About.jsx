import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white font-sans selection:bg-primary selection:text-black">
      {/* 1. HERO SECTION: Cinematic & Visionary */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-80"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary rounded-full blur-[150px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] opacity-10"></div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-16">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold tracking-[0.2em] uppercase mb-6 text-primary">
            Coming Soon to Our Community
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-8">
            THE FUTURE OF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">
              LOCAL SPORTS.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            We aren't just building a turf. We are crafting a legacy for our
            neighborhood. A place where the lights never go out and the game
            never stops.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate("/facilities")}
              className="px-8 py-4 bg-primary text-black font-bold text-lg rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Explore The Vision
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </div>
      </div>

      {/* 2. THE ORIGIN STORY: Sticky Layout */}
      <div className="relative bg-white text-black py-24 md:py-32 rounded-t-[3rem] -mt-10 z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left: Sticky Headline */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none overflow-y-hidden">
                BUILT FOR <br /> US. <br />
                <span
                  className="text-stroke text-white drop-shadow-xl"
                  style={{ WebkitTextStroke: "2px black" }}
                >
                  BY US.
                </span>
              </h2>
              <div className="h-2 w-24 bg-primary mt-4 mb-8"></div>
              <p className="text-xl font-medium text-gray-800">
                This isn't a franchise. This is home.
              </p>
            </div>

            {/* Right: The Narrative */}
            <div className="lg:col-span-7 space-y-12">
              <div className="group">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">
                    01
                  </span>
                  The Problem
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We grew up playing here. We know the struggle—uneven grounds,
                  poor lighting, and no place to truly play like professionals.
                  Our community deserves better than "good enough."
                </p>
              </div>
              <hr className="border-gray-200" />

              <div className="group">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">
                    02
                  </span>
                  The Vision
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Imagine a world-class facility right in our backyard.
                  FIFA-grade turf, anti-glare floodlights, and a vibe that
                  matches the biggest stadiums. That is what PowerPlay is
                  bringing to our location.
                </p>
              </div>
              <hr className="border-gray-200" />

              <div className="group">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">
                    03
                  </span>
                  The Promise
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We aren't expanding to 50 cities. We are laser-focused on{" "}
                  <strong>this one</strong>. We are pouring 100% of our passion
                  into creating the ultimate sporting hub for our friends,
                  families, and neighbors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. VISUAL SHOWCASE: Dark Mode Gallery */}
      <div className="bg-zinc-900 py-24 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 overflow-y-hidden">
              A Glimpse of the Future
            </h2>
            <p className="text-gray-400">What we are building for you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:h-[600px]">
            {/* Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl bg-gray-800 md:col-span-2">
              <img
                src="https://plus.unsplash.com/premium_photo-1664304626749-1795986d6b96?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vdGJhbGwlMjBuaWdodHxlbnwwfHwwfHx8MA%3D%3D"
                alt="Night Match"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition duration-700 ease-in-out"
              />
              <div className="absolute bottom-0 left-0 p-8 translate-y-4 group-hover:translate-y-0 transition duration-500">
                <span className="text-primary font-bold tracking-widest uppercase text-xs">
                  Night Vision
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Floodlights that turn night into day.
                </h3>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl bg-gray-800">
              <img
                src="https://images.unsplash.com/photo-1650327987377-90bf6c9789fd?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZvb3RiYWxsJTIwdHVyZnxlbnwwfHwwfHx8MA%3D%3D"
                alt="Turf Quality"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition duration-700 ease-in-out"
              />
              <div className="absolute bottom-0 left-0 p-8 translate-y-4 group-hover:translate-y-0 transition duration-500">
                <span className="text-primary font-bold tracking-widest uppercase text-xs">
                  Pro Surface
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Injury-free, high-performance turf.
                </h3>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden rounded-2xl bg-gray-800">
              <img
                src="https://images.unsplash.com/photo-1478112544096-20cf77df3a88?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vdGJhbGwlMjBldmVudHxlbnwwfDB8MHx8fDA%3D"
                alt="Community"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition duration-700 ease-in-out"
              />
              <div className="absolute bottom-0 left-0 p-8 translate-y-4 group-hover:translate-y-0 transition duration-500">
                <span className="text-primary font-bold tracking-widest uppercase text-xs">
                  Community
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Tournaments & Leagues.
                </h3>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative overflow-hidden rounded-2xl bg-gray-800 md:col-span-2">
              <img
                src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FmZXxlbnwwfDB8MHx8fDA%3D"
                alt="Locker Rooms"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition duration-700 ease-in-out"
              />
              <div className="absolute bottom-0 left-0 p-8 translate-y-4 group-hover:translate-y-0 transition duration-500">
                <span className="text-primary font-bold tracking-widest uppercase text-xs">
                  Amenities
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Premium Changing Rooms & Cafe.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FOOTER STATEMENT */}
      <div className="py-24 px-6 text-center bg-black border-t border-gray-900">
        <h2 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter overflow-y-hidden hover:text-gray-800 transition duration-500 cursor-default select-none">
          POWERPLAY
        </h2>
        <p className="text-xl text-white mt-4 max-w-lg mx-auto">
          Get your kit ready. The game is about to change.
        </p>
        <div className="mt-8">
          <button
            onClick={() => navigate("/facilities")}
            className="px-8 py-3 border border-gray-700 rounded-full text-gray-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
          >
            Check Availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
