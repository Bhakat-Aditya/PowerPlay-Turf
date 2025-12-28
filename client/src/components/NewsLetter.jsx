import React from "react";

const NewsLetter = () => {
  const whatsappGroupLink = "https://chat.whatsapp.com/CtwTp122Mgq1eVLQ0NVeuI"; // Replace with your real link

  return (
    <div className="relative bg-black py-24 overflow-hidden isolate">
      {/* 1. ANIMATED BACKGROUND ELEMENTS */}
      {/* Pulsing Gradient Orb Left */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse -z-10"></div>
      {/* Pulsing Gradient Orb Right */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse -z-10 animation-delay-2000"></div>

      {/* Floating Icons (Simulated with text/svg for performance) */}
      <div className="absolute top-10 left-10 md:left-40 text-6xl opacity-10 animate-bounce duration-[3000ms] overflow-y-hidden">
        ⚽
      </div>
      <div className="absolute bottom-20 right-10 md:right-40 text-6xl opacity-10 animate-bounce duration-[4000ms] overflow-y-hidden">
        🏏
      </div>
      <div className="absolute top-1/2 right-10 text-4xl opacity-10 animate-ping duration-[2000ms] overflow-y-hidden">
        🔔
      </div>

      {/* 2. GLASS CARD CONTAINER */}
      <div className="mx-auto max-w-4xl px-6 relative z-10 overflow-y-hidden">
        <div className="relative rounded-3xl bg-white/5 border overflow-y-hidden border-white/10 p-8 sm:p-16 backdrop-blur-sm text-center shadow-2xl overflow-hidden group">
          {/* Shine Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 overflow-y-hidden">
            DON'T PLAY <span className="text-primary">ALONE.</span>
          </h2>

          <p className="mx-auto max-w-xl text-lg text-gray-400 mb-10 leading-relaxed overflow-y-hidden">
            Finding a team shouldn't be harder than winning the match. Join our{" "}
            <strong>VIP WhatsApp Community</strong> to find opponents, get slot
            alerts, and trash talk (respectfully).
          </p>

          {/* 3. THE "GLOWING" CTA BUTTON */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 overflow-y-hidden">
            <a
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group/btn inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(37,211,102,0.6)]"
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>

              {/* WhatsApp SVG */}
              <svg
                className="w-6 h-6 fill-current relative z-10"
                viewBox="0 0 24 24"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.888.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.978zm11.374-5.483c-.284-.142-1.681-.83-1.941-.925-.26-.095-.449-.142-.637.142-.189.284-.732.925-.897 1.113-.165.189-.331.213-.615.071-.284-.142-1.199-.442-2.285-1.409-.838-.748-1.404-1.672-1.569-1.956-.165-.284-.018-.437.124-.579.129-.129.284-.331.426-.497.142-.165.189-.284.284-.473s.047-.355-.024-.497c-.071-.142-.637-1.535-.872-2.099-.228-.546-.46-.472-.637-.478-.166-.006-.355-.006-.544-.006s-.497.071-.757.355c-.26.284-.993.969-.993 2.364 0 1.396 1.016 2.744 1.158 2.933.142.189 2.001 3.056 4.846 4.285.677.292 1.205.467 1.623.6.689.219 1.316.188 1.815.114.556-.083 1.681-.686 1.918-1.348.237-.662.237-1.229.166-1.348-.071-.119-.26-.189-.544-.331z" />
              </svg>

              <span className="relative z-10">Join WhatsApp Community</span>
            </a>
          </div>

          {/* Social Proof Text */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            0+ Players active right now
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
