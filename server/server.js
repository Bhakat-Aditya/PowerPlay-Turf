import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

connectDB(); // Connect to the database
const app = express();
app.use(clerkMiddleware())
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(express.json()); // Parse incoming JSON requests


const PORT = process.env.PORT || 3000;


app.use("/api/clerk",clerkWebhooks)

app.get('/', (req, res) => {
    res.send('API is working...');
});
app.use('/api/user',  userRouter);
app.use('/api/bookings',  bookingRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

