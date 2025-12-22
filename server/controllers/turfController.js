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

// TEMP: Seed Function (With Outdoor Badminton & More Amenities)
export const seedTurfs = async (req, res) => {
    try {
        const sampleData = [
            {
                name: "Box Cricket",
                sportType: "Cricket",
                location: "Jamunabali, Abash, Midnapore",
                description: "Step onto our premium quality artificial turf designed for fast-paced box cricket action. Perfect for 6v6 or 8v8 matches with pro-grade netting.",
                price: 800,
                amenities: [
                    "FIFA-approved Turf",
                    "30ft High Nets",
                    "Night Vision Floodlights",
                    "Digital Scoreboard",
                    "Dugout Seating",
                    "Live Streaming Support"
                ],
                images: [
                    "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg",
                    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1595210382266-2d0077c1f541?w=500&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1585822754398-04873d4e1f50?w=500&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1642888621409-df3812ab67c5?w=500&auto=format&fit=crop&q=60"
                ],
                owner: req.user._id
            },
            {
                name: "Football Arena",
                sportType: "Football",
                location: "Jamunabali, Abash, Midnapore",
                description: "Experience football like never before on our shock-absorbent synthetic turf. Designed for high-speed 5-a-side games.",
                price: 1000,
                amenities: [
                    "Impact Absorption Turf",
                    "Enclosed Arena",
                    "Professional Goal Posts",
                    "Spectator Gallery",
                    "Changing Rooms",
                    "First Aid Kit"
                ],
                images: [
                    "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=500&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?w=500&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=500&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=500&auto=format&fit=crop&q=60",
                    "https://plus.unsplash.com/premium_photo-1720433273520-80ff8a59a6f6?w=500&auto=format&fit=crop&q=60"
                ],
                owner: req.user._id
            },
            {
                name: "Badminton Court",
                sportType: "Badminton",
                location: "Jamunabali, Abash, Midnapore",
                // Updated Description for OUTDOOR
                description: "Enjoy the game in fresh air on our premium outdoor badminton courts. BWF-standard synthetic mats offer excellent grip even outdoors.",
                price: 400,
                // Updated Amenities for OUTDOOR
                amenities: [
                    "BWF Standard Mats",
                    "High-Mast Floodlights",
                    "Wind-Resistant Nets",
                    "Outdoor Seating",
                    "Non-Slip Surface",
                    "Refreshment Zone"
                ],
                images: [
                    "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg",
                    "https://images.pexels.com/photos/5767580/pexels-photo-5767580.jpeg",
                    "https://images.pexels.com/photos/14605729/pexels-photo-14605729.jpeg",
                    "https://images.pexels.com/photos/8007493/pexels-photo-8007493.jpeg",
                    "https://images.pexels.com/photos/6307230/pexels-photo-6307230.jpeg"
                ],
                owner: req.user._id
            },
            {
                name: "Power Fitness Gym",
                sportType: "Gym",
                location: "Jamunabali, Abash, Midnapore",
                description: "A state-of-the-art fitness center equipped with the latest cardio and strength training machines.",
                price: 1500,
                amenities: [
                    "Cardio & Strength Zone",
                    "Modern Imported Equipment",
                    "Certified Personal Trainers",
                    "Steam Bath & Lockers",
                    "Fully Air Conditioned",
                    "Diet Cafe"
                ],
                images: [
                    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1623874514711-0f321325f318?w=500&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=500&auto=format&fit=crop&q=60"
                ],
                owner: req.user._id
            }
        ];

        // 1. Clear existing data to prevent duplicates
        await Turf.deleteMany({});

        // 2. Insert new data
        await Turf.insertMany(sampleData);

        res.json({ success: true, message: "Database refreshed with Outdoor Badminton & More Amenities!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}