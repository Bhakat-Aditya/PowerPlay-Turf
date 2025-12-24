import express from 'express';
import { getAllTurfs, getTurfById, seedTurfs, updateTurf } from '../controllers/turfController.js';
import { protect } from '../middlewares/authMiddleware.js';

const turfRouter = express.Router();

turfRouter.get('/', getAllTurfs);
turfRouter.get('/:id', getTurfById);
turfRouter.put('/:id', updateTurf);

// Run this ONCE to populate DB, then you can comment it out
turfRouter.post('/seed', protect, seedTurfs); 

export default turfRouter;