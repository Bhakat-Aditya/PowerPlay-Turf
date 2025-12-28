import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png'; // Using existing asset as fallback

const AboutSection = () => {
  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Images Grid (Simulated for visual appeal) */}
          <div className="relative overflow-y-hidden">
             {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition duration-500">
              <img 
                src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=2070&auto=format&fit=crop" 
                alt="Turf Action" 
                className="w-full h-auto object-cover overflow-y-hidden"
              />
            </div>
            {/* Overlay/Accent Image */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-xl overflow-hidden shadow-xl border-4 border-white hidden sm:block transform -rotate-3 hover:rotate-0 transition duration-500">
               <img 
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2836&auto=format&fit=crop" 
                alt="Football" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div>
            <h2 className="text-base font-semibold text-primary tracking-wide uppercase">About Us</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl overflow-y-hidden">
              More Than Just a Turf. <br/> It's an Experience.
            </p>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              At PowerPlay Turf, we believe sports bring people together. Whether you are a weekend warrior or a professional athlete, our world-class facilities are designed to elevate your game. 
            </p>
            
            <div className="mt-8 flex gap-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-gray-900">50+</span>
                <span className="text-sm text-gray-500">Daily Games</span>
              </div>
              <div className="w-px h-12 bg-gray-300 mx-4"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-gray-900">5000+</span>
                <span className="text-sm text-gray-500">Happy Players</span>
              </div>
            </div>

            <div className="mt-8">
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-black hover:bg-gray-800 transition-all duration-300"
              >
                Read Our Story
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutSection;