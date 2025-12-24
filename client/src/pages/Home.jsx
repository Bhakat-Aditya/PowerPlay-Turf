import React from "react";
import Hero from "../components/Hero";
import Services from "../components/Services";
import NewsLetter from "../components/NewsLetter";
import AboutSection from '../components/AboutSection';

function Home() {
  return (
    <div>
      <Hero />
      <Services />
      <AboutSection />
      <NewsLetter />
    </div>
  );
}

export default Home;
