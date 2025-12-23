import Turf from '../models/Turf.js';

export const getAllTurfs = async (req, res) => {
    try {
        const turfs = await Turf.find({}); 
        res.json({ success: true, turfs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getTurfById = async (req, res) => {
    try {
        const { id } = req.params;
        const turf = await Turf.findById(id);

        if (!turf) return res.status(404).json({ success: false, message: "Turf not found" });
        res.json({ success: true, turf });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const seedTurfs = async (req, res) => {
    try {
        const seedOwnerId = req.auth ? req.auth.userId : "seed_admin_id";
        const sampleData = [
            {
                name: "Box Cricket",
                sportType: "Cricket",
                location: "Jamunabali, Abash, Midnapore",
                description: "Premium quality artificial turf for box cricket.",
                price: 800,
                amenities: ["FIFA-approved Turf", "30ft High Nets", "Night Vision Floodlights"],
                images: ["https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg"],
                owner: seedOwnerId
            },
            {
                name: "Football Arena",
                sportType: "Football",
                location: "Jamunabali, Abash, Midnapore",
                description: "Shock-absorbent synthetic turf for 5-a-side football.",
                price: 1000,
                amenities: ["Impact Absorption Turf", "Enclosed Arena", "Goal Posts"],
                images: ["https://images.unsplash.com/photo-1551958219-acbc608c6377?w=500&auto=format&fit=crop&q=60"],
                owner: seedOwnerId
            },
            {
                name: "Badminton Court",
                sportType: "Badminton",
                location: "Jamunabali, Abash, Midnapore",
                description: "Premium outdoor badminton courts.",
                price: 400,
                amenities: ["BWF Standard Mats", "Floodlights", "Wind-Resistant Nets"],
                images: ["https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg"],
                owner: seedOwnerId
            }
        ];

        await Turf.deleteMany({});
        await Turf.insertMany(sampleData);

        res.json({ success: true, message: "Database seeded!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}