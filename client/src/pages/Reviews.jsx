import React from "react";
import { useNavigate } from "react-router-dom";

const Reviews = () => {
  const navigate = useNavigate();

  // "Hype" Content - focused on anticipation and first impressions of the construction/vision
  const hypeList = [
    {
      id: 1,
      name: "Vikram R.",
      tag: "Pro Cricket Coach",
      text: "I walked past the site yesterday. The dimensions of this turf are unlike anything I've seen in this city. Finally, a place where the ball will actually bounce true.",
      highlight: "Dimensions are insane.",
    },
    {
      id: 2,
      name: "Anjali P.",
      tag: "Weekend Warrior",
      text: "The lighting setup looks like a stadium. No more playing in shadows. This is going to be our Friday night headquarters.",
      highlight: "Stadium-grade lighting.",
    },
    {
      id: 3,
      name: "Team Invincibles",
      tag: "Local Football Club",
      text: "We have been waiting for a turf with proper changing rooms and a dugout. PowerPlay seems to actually understand what players need.",
      highlight: "Player-focused amenities.",
    },
  ];

  return (
    <div className="bg-black text-white font-sans selection:bg-primary selection:text-black min-h-screen">
      {/* 1. HERO SECTION: Typography Heavy */}
      <div className="relative pt-32 pb-20 px-6 border-b border-white/10 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[180px] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-10">
            <div>
              <p className="text-primary font-bold tracking-[0.3em] uppercase mb-4 text-sm animate-pulse">
                Community & Culture
              </p>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] overflow-hidden">
                WORD ON <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white">
                  THE STREET.
                </span>
              </h1>
            </div>
            <div className="md:max-w-md mb-4">
              <p className="text-xl text-gray-400 font-light leading-relaxed">
                We haven't cut the ribbon yet, but the noise is getting louder.
                Here is why the local sports scene is holding its breath.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE WALL OF HYPE (Staggered Grid) */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="space-y-6 mt-0 md:mt-0">
            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-primary/50 transition duration-500 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-black flex items-center justify-center font-bold text-black text-xl">
                  V
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Vikram R. </h3>
                  <p className="text-xs text-primary uppercase tracking-wider">
                    Pro Coach
                  </p>
                </div>
              </div>
              <p className="text-2xl font-serif italic text-gray-300 mb-6 leading-relaxed">
                "The dimensions of this turf are unlike anything I've seen.
                Finally, a true bounce."
              </p>
              <div className="inline-block px-4 py-1 rounded-full border border-zinc-700 text-xs text-gray-400 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition">
                #GameChanger
              </div>
            </div>

            {/* Stat Card */}
            <div className="p-8 rounded-3xl bg-primary text-black flex flex-col justify-between h-64">
              <h3 className="text-4xl font-black tracking-tighter">100+</h3>
              <p className="font-bold uppercase tracking-widest text-sm border-t border-black/20 pt-4">
                Pre-Launch Inquiries
              </p>
            </div>
          </div>

          {/* Column 2 (Offset) */}
          <div className="space-y-6 mt-0 md:mt-12">
            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-primary/50 transition duration-500 group min-h-[300px] flex flex-col justify-between">
              <div>
                <div className="flex text-yellow-500 mb-4 text-xl">★★★★★</div>
                <p className="text-2xl font-serif italic text-gray-300 leading-relaxed">
                  "No more playing in shadows. The lighting setup looks like a Like this 
                  stadium."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 border-t border-zinc-800 pt-4">
                <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                <span className="font-bold text-sm">
                  Anjali P. 
                  <span className="text-gray-500 font-normal ml-1">
                     Waiting List
                  </span>
                </span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl h-64 group cursor-pointer">
              <video
                src="/src/assets/rev.mp4"
                className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-60"
                autoPlay
                loop
                muted
                playsInline
              />
              
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-6 mt-0 md:mt-24">
            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-primary/50 transition duration-500 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xl">
                  T
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    Team Invincibles
                  </h3>
                  <p className="text-xs text-blue-400 uppercase tracking-wider">
                    Football Club
                  </p>
                </div>
              </div>
              <p className="text-xl text-gray-400 mb-6 leading-relaxed">
                "We need a turf that respects the player. The planned amenities
                here—lockers, showers, dugout—are exactly what we've been
                missing."
              </p>
            </div>

            {/* Text Block */}
            <div className="p-4">
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-800">
                BE THE <br /> FIRST.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE POLL / ENGAGEMENT (Static for now) */}
      <div className="bg-white text-black py-20 px-6 transform -skew-y-1 my-10">
        <div className="max-w-7xl mx-auto transform skew-y-1">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              What excites you the most?
            </h2>
            <p className="text-gray-500">Based on our pre-launch survey</p>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Bar 1 */}
            <div className="group cursor-pointer">
              <div className="flex justify-between mb-2 text-lg font-bold">
                <span>FIFA Grade Turf</span>
                <span>45%</span>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black w-[45%] group-hover:bg-primary transition-all duration-500"></div>
              </div>
            </div>
            {/* Bar 2 */}
            <div className="group cursor-pointer">
              <div className="flex justify-between mb-2 text-lg font-bold">
                <span>Night Match Lighting</span>
                <span>35%</span>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black w-[35%] group-hover:bg-primary transition-all duration-500"></div>
              </div>
            </div>
            {/* Bar 3 */}
            <div className="group cursor-pointer">
              <div className="flex justify-between mb-2 text-lg font-bold">
                <span>Cafe & Chill Zone</span>
                <span>20%</span>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black w-[20%] group-hover:bg-primary transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CALL TO ACTION: "Write History" */}
      <div className="relative py-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 overflow-hidden">
            MAKE YOUR MARK.
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Legends aren't born in empty stadiums. They are born here. Be the
            first to review us when we open.
          </p>
          <button
            onClick={() => navigate("/facilities")}
            className="px-10 py-5 bg-white text-black font-bold text-xl rounded-full hover:bg-primary hover:text-white transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Book Your Slot
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
