import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Trip from '../models/Trip';
import { AuthRequest } from '../middleware/authMiddleware';
import { AIService } from '../services/aiService';
import { ValidationError, NotFoundError, ForbiddenError } from '../utils/errors';

/**
 * Create a new trip with AI-generated itinerary
 * @route POST /api/trips
 * @access Private
 */
export const createTrip = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array()[0].msg);
    }

    const { destination, numberOfDays, budgetType, interests } = req.body;
    const userId = req.user!._id;

    // Generate itinerary using AI
    const itineraryData = await AIService.generateItinerary({
      destination,
      numberOfDays,
      budgetType,
      interests
    });

    // Generate budget estimation using AI
    const budgetData = await AIService.estimateBudget({
      destination,
      numberOfDays,
      budgetType,
      interests
    });

    // Generate hotel suggestions using AI
    const hotelData = await AIService.suggestHotels({
      destination,
      numberOfDays,
      budgetType,
      interests
    });

    // Create trip in database
    const trip = await Trip.create({
      userId,
      destination,
      numberOfDays,
      budgetType,
      interests,
      itinerary: itineraryData.itinerary,
      budget: budgetData.budget,
      hotels: hotelData.hotels
    });

    res.status(201).json({
      success: true,
      data: { trip }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all trips for the authenticated user
 * @route GET /api/trips
 * @access Private
 */
export const getTrips = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;

    const trips = await Trip.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trips.length,
      data: { trips }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single trip by ID
 * @route GET /api/trips/:id
 * @access Private
 */
export const getTrip = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    // Ensure user owns the trip
    if (trip.userId.toString() !== req.user!._id.toString()) {
      throw new ForbiddenError('Not authorized to access this trip');
    }

    res.status(200).json({
      success: true,
      data: { trip }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a trip
 * @route PUT /api/trips/:id
 * @access Private
 */
export const updateTrip = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    // Ensure user owns the trip
    if (trip.userId.toString() !== req.user!._id.toString()) {
      throw new ForbiddenError('Not authorized to update this trip');
    }

    // Update trip
    trip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: { trip }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a trip
 * @route DELETE /api/trips/:id
 * @access Private
 */
export const deleteTrip = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    // Ensure user owns the trip
    if (trip.userId.toString() !== req.user!._id.toString()) {
      throw new ForbiddenError('Not authorized to delete this trip');
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add activity to a specific day
 * @route POST /api/trips/:id/days/:dayNumber/activities
 * @access Private
 */
export const addActivity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, dayNumber } = req.params;
    const { name, description, time, cost } = req.body;

    const trip = await Trip.findById(id);

    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (trip.userId.toString() !== req.user!._id.toString()) {
      throw new ForbiddenError('Not authorized to modify this trip');
    }

    // Find the day and add activity
    const dayIndex = trip.itinerary.findIndex(d => d.day === parseInt(dayNumber as string));
    
    if (dayIndex === -1) {
      throw new NotFoundError('Day not found in itinerary');
    }

    trip.itinerary[dayIndex].activities.push({
      name,
      description,
      time,
      cost
    });

    await trip.save();

    res.status(200).json({
      success: true,
      data: { trip }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove activity from a specific day
 * @route DELETE /api/trips/:id/days/:dayNumber/activities/:activityIndex
 * @access Private
 */
export const removeActivity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, dayNumber, activityIndex } = req.params;

    const trip = await Trip.findById(id);

    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (trip.userId.toString() !== req.user!._id.toString()) {
      throw new ForbiddenError('Not authorized to modify this trip');
    }

    // Find the day and remove activity
    const dayIndex = trip.itinerary.findIndex(d => d.day === parseInt(dayNumber as string));
    
    if (dayIndex === -1) {
      throw new NotFoundError('Day not found in itinerary');
    }

    trip.itinerary[dayIndex].activities.splice(parseInt(activityIndex as string), 1);

    await trip.save();

    res.status(200).json({
      success: true,
      data: { trip }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Regenerate a specific day with custom requirements
 * @route POST /api/trips/:id/days/:dayNumber/regenerate
 * @access Private
 */
export const regenerateDay = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, dayNumber } = req.params;
    const { requirements } = req.body;

    const trip = await Trip.findById(id);

    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (trip.userId.toString() !== req.user!._id.toString()) {
      throw new ForbiddenError('Not authorized to modify this trip');
    }

    // Regenerate day using AI
    const newDay = await AIService.regenerateDay(
      trip.destination,
      parseInt(dayNumber as string),
      requirements || 'Regenerate with fresh activities',
      trip.budgetType
    );

    // Find and update the day
    const dayIndex = trip.itinerary.findIndex(d => d.day === parseInt(dayNumber as string));
    
    if (dayIndex === -1) {
      throw new NotFoundError('Day not found in itinerary');
    }

    trip.itinerary[dayIndex] = newDay;
    await trip.save();

    res.status(200).json({
      success: true,
      data: { trip }
    });
  } catch (error) {
    next(error);
  }
};
