import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import bodyParser from 'body-parser'; // Make sure to npm install body-parser

// Controllers & Routes
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import bookingRouter from './routes/bookingRoutes.js'; // <--- Import this
import turfRouter from './routes/turfRoutes.js'; // Import this

connectDB();
const app = express();

app.use(cors());
app.use(clerkMiddleware());

// 1. Webhook Route (MUST be before express.json)
// We use bodyParser.json() specifically for this route to ensure signature verification works
app.post("/api/clerk", bodyParser.json(), clerkWebhooks);

// 2. Standard Middleware
app.use(express.json()); 

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('API is working...');
});

// 3. Register Routes
app.use('/api/user', userRouter);
app.use('/api/bookings', bookingRouter); // <--- Add this line
app.use('/api/turfs', turfRouter); // Add this line

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});