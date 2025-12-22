import React from "react";
import heroDesktop from "../assets/hero.png";
import heroMobile from "../assets/hero-mobile.png";

function Hero() {
  return (
    <div className="relative h-screen w-full font-sans">
      <div
        className="absolute inset-0 bg-cover bg-center block md:hidden"
        style={{ backgroundImage: `url(${heroMobile})` }}
      ></div>
      <div
        className="absolute inset-0 bg-cover bg-center hidden md:block"
        style={{ backgroundImage: `url(${heroDesktop})` }}
      ></div>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 flex h-full w-full items-center justify-around gap-10 px-8 sm:px-20">
        <button className="rounded-lg bg-green-500 px-6 py-3 text-lg font-bold text-white transition hover:bg-green-600 hover:scale-105">
          View Services
        </button>

        <button className="rounded-lg bg-blue-500 px-6 py-3 text-lg font-bold text-white transition hover:bg-blue-600 hover:scale-105">
          Book a Slot Now
        </button>
      </div>
    </div>
  );
}

export default Hero;
