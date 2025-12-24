import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Facilities from "./pages/Facilities";
import FacilityDetails from "./pages/FacilityDetails"; 
import Footer from "./components/Footer";
import {Toaster} from 'react-hot-toast';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard'; 

import MyBookings from "./pages/MyBookings";
import Reviews from "./pages/Reviews";

function App() {
  const isOwnerPath = useLocation().pathname.includes("/owner");

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster/>
      {!isOwnerPath && <Navbar />}

      <div className="flex-grow min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/facilities/:id" element={<FacilityDetails />} />
          <Route path='/about' element={<About />} />
          <Route path='/reviews' element={<Reviews />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
        </Routes>
      </div>

      {!isOwnerPath && <Footer />}
    </div>
  );
}

export default App;
