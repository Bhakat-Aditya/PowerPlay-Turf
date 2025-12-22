import mongoose from "mongoose";

const turfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    // Which sport is this? (e.g., Cricket, Football, Gym)
    sportType: {
        type: String,
        required: true,
        enum: ['Cricket', 'Football', 'Badminton', 'Gym']
    },

    // Price per slot/hour
    price: {
        type: Number,
        required: true
    },

    // Array of image URLs
    images: [{
        type: String
    }],

    // Features like "CCTV", "Parking"
    amenities: [{
        type: String
    }],

    // Link to the owner (User model)
    owner: {
        type: String,
        ref: "User",
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Turf = mongoose.model("Turf", turfSchema);
export default Turf;