import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';

const MyBookings = () => {
    const { getToken } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- 1. Fetch Bookings ---
    const fetchBookings = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('http://localhost:3000/api/bookings/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    // --- 2. Handle Cancellation ---
    const handleCancel = async (bookingId) => {
        // Warning about the 24hr policy
        if(!window.confirm("Are you sure? If the slot is within 24 hours, 30% will be deducted from your refund.")) {
            return;
        }

        try {
            const token = await getToken();
            const { data } = await axios.put(`http://localhost:3000/api/bookings/cancel/${bookingId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success(data.message, { duration: 5000 }); // Show message longer so they see refund amt
                fetchBookings(); // Refresh the list to show 'cancelled' status
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Cancellation failed");
        }
    };

    // --- 3. Handle Payment (UI Only) ---
    const handlePayNow = (bookingId, method) => {
        if(method === 'Cash') {
             toast.success("Payment mode set to Cash. Please pay at the venue.");
             // API call to update paymentMethod to 'Cash' could go here
        } else {
             toast.success(`Redirecting to ${method} Gateway...`);
             // Integration with Razorpay/Stripe would happen here
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading bookings...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-8 text-gray-900">My Bookings</h1>
                
                {bookings.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10 text-lg">You haven't booked any turfs yet.</div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col md:flex-row">
                                    
                                    {/* Image Section */}
                                    <div className="md:w-1/3 h-48 md:h-auto bg-gray-200 relative">
                                        <img 
                                            src={booking.turf?.images?.[0] || "https://via.placeholder.com/300"} 
                                            alt="Turf" 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 left-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                                                booking.status === 'booked' ? 'bg-green-500 text-white' : 
                                                booking.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details Section */}
                                    <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800">{booking.turf?.name || "Unknown Turf"}</h3>
                                            <p className="text-gray-500 text-sm mb-4">{booking.turf?.location}</p>
                                            
                                            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                                                <div>
                                                    <p className="text-gray-400 font-medium">Date</p>
                                                    <p className="font-semibold text-gray-700">
                                                        {new Date(booking.date).toLocaleDateString('en-US', { 
                                                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
                                                        })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 font-medium">Time</p>
                                                    <p className="font-semibold text-gray-700">{booking.timeSlot}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 font-medium">Total Amount</p>
                                                    <p className="font-bold text-lg text-gray-900">₹{booking.amount}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 font-medium">Payment Status</p>
                                                    <p className={`font-semibold ${booking.isPaid ? "text-green-600" : "text-yellow-600"}`}>
                                                        {booking.isPaid ? "Paid" : "Pending"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons Section */}
                                        {booking.status === 'booked' && (
                                            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 items-center">
                                                
                                                {/* Payment Controls */}
                                                {!booking.isPaid && (
                                                    <div className="flex w-full sm:w-auto gap-2">
                                                        <select 
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 p-2.5 outline-none"
                                                            id={`pay-method-${booking._id}`}
                                                            defaultValue="UPI"
                                                        >
                                                            <option value="UPI">UPI</option>
                                                            <option value="Cash">Cash</option>
                                                        </select>
                                                        <button 
                                                            onClick={() => handlePayNow(booking._id, document.getElementById(`pay-method-${booking._id}`).value)}
                                                            className="flex-grow sm:flex-grow-0 bg-black text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                                                        >
                                                            Pay Now
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                <div className="flex-grow"></div>

                                                {/* Cancel Button */}
                                                <button 
                                                    onClick={() => handleCancel(booking._id)}
                                                    className="w-full sm:w-auto text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm"
                                                >
                                                    Cancel Booking
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;