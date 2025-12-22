import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
// 1. Import pages
import Facilities from "./components/Facilities";
import FacilityDetails from "./components/FacilityDetails";
// 2. Import Footer
import Footer from "./components/Footer";

function App() {
  const isOwnerPath = useLocation().pathname.includes("/owner");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar (hidden on owner dashboard) */}
      {!isOwnerPath && <Navbar />}

      {/* Main Content (grows to fill space) */}
      <div className="flex-grow min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/facilities/:id" element={<FacilityDetails />} />
        </Routes>
      </div>
      {!isOwnerPath && <Footer />}
    </div>
  );
}

export default App;
