import Turf from '../models/Turf.js';

// Get All Turfs (for the list page)
export const getAllTurfs = async (req, res) => {
    try {
        const turfs = await Turf.find({ isActive: true });
        res.json({ success: true, turfs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get Single Turf (for the details page)
export const getTurfById = async (req, res) => {
    try {
        const { id } = req.params;
        const turf = await Turf.findById(id);
        
        if (!turf) {
            return res.status(404).json({ success: false, message: "Turf not found" });
        }
        res.json({ success: true, turf });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// TEMP: Seed Function to upload your data to MongoDB
export const seedTurfs = async (req, res) => {
    try {
        const sampleData = [
            {
                name: "Pro Box Cricket",
                sportType: "Cricket",
                location: "Midnapore Stadium Complex",
                description: "Step onto our premium quality artificial turf designed for fast-paced box cricket action.",
                price: 800,
                amenities: ["FIFA-approved Turf", "30ft Nets", "Floodlights"],
                images: ["https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop"],
                owner: req.user._id // Assigns to the person running the seed
            },
            {
                name: "5v5 Football Arena",
                sportType: "Football",
                location: "Station Road",
                description: "Experience football like never before on our shock-absorbent synthetic turf.",
                price: 1000,
                amenities: ["Impact Absorption Turf", "Enclosed Arena", "Goal Posts"],
                images: ["https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=2070&auto=format&fit=crop"],
                owner: req.user._id
            },
             {
                name: "Indoor Badminton Court",
                sportType: "Badminton",
                location: "City Center",
                description: "Play comfortably in any weather with our fully air-conditioned indoor stadium.",
                price: 400,
                amenities: ["BWF Mats", "AC Hall", "Anti-Glare Lights"],
                images: ["https://images.unsplash.com/photo-1626224583764-847890e0e966?q=80&w=800&auto=format&fit=crop"],
                owner: req.user._id
            }
        ];
        
        await Turf.insertMany(sampleData);
        res.json({ success: true, message: "Turfs added successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}