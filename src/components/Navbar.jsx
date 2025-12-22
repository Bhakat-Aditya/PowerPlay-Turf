import React from "react";
import { FaBars } from "react-icons/fa";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <div className="flex flex-row justify-between items-center h-12  bg-green-400">
      <div className="ml-4">
        <img className="w-22" src={logo} alt="Logo" />
      </div>
      <div className="flex flex-row text-2xl cursor-pointer">
        <FaBars />
      </div>
      <div className="mr-4 text-white bg-green-700 flex justify-center items-center py-1 font-semibold text-xl rounded-xl px-6 cursor-pointer hover:bg-green-600">Login</div>
    </div>
  );
}

export default Navbar;
