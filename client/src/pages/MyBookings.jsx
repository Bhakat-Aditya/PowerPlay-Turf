import React from "react";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  // --- MOCK DATA (Updated with paymentStatus) ---
  const bookings = [
    {
      id: "BK-7829",
      sport: "Box Cricket",
      date: "25 Oct, 2024",
      time: "06:00 PM - 07:00 PM",
      price: "₹800",
      status: "Upcoming",
      paymentStatus: "Pending", // <--- NEEDS PAYMENT
      image:
        "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "BK-9001",
      sport: "Gym Session",
      date: "28 Oct, 2024",
      time: "06:00 AM - 08:00 AM",
      price: "₹150",
      status: "Upcoming",
      paymentStatus: "Paid", // <--- ALREADY PAID
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "BK-5521",
      sport: "5v5 Football",
      date: "12 Oct, 2024",
      time: "07:00 AM - 08:00 AM",
      price: "₹1000",
      status: "Completed",
      paymentStatus: "Paid",
      image:
        "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "BK-4402",
      sport: "Badminton",
      date: "05 Oct, 2024",
      time: "05:00 PM - 06:00 PM",
      price: "₹400",
      status: "Cancelled",
      paymentStatus: "Refunded",
      image:
        "https://images.unsplash.com/photo-1626224583764-847890e0e966?q=80&w=800&auto=format&fit=crop",
    },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-500 mt-1">
              Welcome back,{" "}
              <span className="font-semibold text-black">{user.firstName}</span>
              !
            </p>
          </div>
          <Link
            to="/facilities"
            className="hidden sm:block text-green-600 font-semibold hover:underline"
          >
            + Book New Slot
          </Link>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row transition-all hover:shadow-md"
            >
              {/* Image */}
              <div className="w-full sm:w-48 h-32 sm:h-auto bg-gray-200 relative">
                <img
                  src={booking.image}
                  alt={booking.sport}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {booking.id}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-800">
                    {booking.sport}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {booking.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {booking.time}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    {booking.price}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${
                      booking.status === "Upcoming"
                        ? "bg-blue-100 text-blue-700"
                        : ""
                    }
                    ${
                      booking.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : ""
                    }
                    ${
                      booking.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : ""
                    }
                  `}
                  >
                    {booking.status}
                  </span>

                  {/* Payment Status Label (Small) */}
                  <span
                    className={`text-xs font-semibold 
                    ${
                      booking.paymentStatus === "Paid"
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    {booking.paymentStatus === "Paid"
                      ? "Paid via Online"
                      : "Payment Pending"}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              {booking.status === "Upcoming" && (
                <div className="border-t sm:border-t-0 sm:border-l border-gray-100 p-4 flex flex-row sm:flex-col items-center justify-center gap-3 bg-gray-50 sm:bg-white sm:w-36">
                  {/* 1. PAY NOW BUTTON - Shows ONLY if status is Upcoming AND Payment is Pending */}
                  {booking.paymentStatus === "Pending" && (
                    <button className="w-full bg-black text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-600 transition-colors shadow-sm">
                      Pay Now
                    </button>
                  )}

                  {/* 2. CANCEL BUTTON - Always shows for Upcoming */}
                  <button className="text-red-500 text-sm font-semibold hover:text-red-700 transition-colors">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900">
              No bookings found
            </h3>
            <p className="text-gray-500 mb-4">
              You haven't booked any slots yet.
            </p>
            <Link
              to="/facilities"
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Book a Slot
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
