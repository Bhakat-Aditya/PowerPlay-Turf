import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Facilities from "./pages/Facilities"; // Assuming this exists based on our chat
import FacilityDetails from "./pages/FacilityDetails"; // Assuming this exists based on our chat
import Footer from "./components/Footer";

// 1. Import MyBookings
import MyBookings from "./pages/MyBookings";

function App() {
  const isOwnerPath = useLocation().pathname.includes("/owner");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar (hidden on owner dashboard) */}
      {!isOwnerPath && <Navbar />}

      {/* Main Content */}
      <div className="flex-grow min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/facilities/:id" element={<FacilityDetails />} />

          {/* 2. Add the Route */}
          <Route path="/bookings" element={<MyBookings />} />
        </Routes>
      </div>

      {/* Footer (hidden on owner dashboard) */}
      {!isOwnerPath && <Footer />}
    </div>
  );
}

export default App;
