import express from 'express';
import { body } from 'express-validator';
import {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  addActivity,
  removeActivity,
  regenerateDay
} from '../controllers/tripController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const createTripValidation = [
  body('destination').trim().notEmpty().withMessage('Destination is required'),
  body('numberOfDays')
    .isInt({ min: 1, max: 30 })
    .withMessage('Number of days must be between 1 and 30'),
  body('budgetType')
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Budget type must be Low, Medium, or High'),
  body('interests')
    .isArray({ min: 1 })
    .withMessage('At least one interest must be selected')
];

const addActivityValidation = [
  body('name').trim().notEmpty().withMessage('Activity name is required'),
  body('description').trim().notEmpty().withMessage('Activity description is required')
];

// Routes
router.route('/')
  .get(getTrips)
  .post(createTripValidation, createTrip);

router.route('/:id')
  .get(getTrip)
  .put(updateTrip)
  .delete(deleteTrip);

router.post('/:id/days/:dayNumber/activities', addActivityValidation, addActivity);
router.delete('/:id/days/:dayNumber/activities/:activityIndex', removeActivity);
router.post('/:id/days/:dayNumber/regenerate', regenerateDay);

export default router;
