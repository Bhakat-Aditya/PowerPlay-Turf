import React from "react";
import { useParams } from "react-router-dom";

function FacilityDetails() {
  const { id } = useParams(); // Gets 'cricket' or 'football' from the URL

  return (
    <div className="pt-28 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Booking Page for {id}</h1>
      <p className="text-gray-600">
        The calendar and slot booking system will go here.
      </p>
    </div>
  );
}

export default FacilityDetails;
