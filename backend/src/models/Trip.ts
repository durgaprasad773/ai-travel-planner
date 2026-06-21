import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity {
  name: string;
  description: string;
  time?: string;
  cost?: number;
}

export interface IDayItinerary {
  day: number;
  title: string;
  activities: IActivity[];
}

export interface IBudget {
  flights: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total: number;
}

export interface IHotel {
  name: string;
  category: string;
  priceRange: string;
  rating?: number;
  description?: string;
}

export interface ITrip extends Document {
  userId: mongoose.Types.ObjectId;
  destination: string;
  numberOfDays: number;
  budgetType: 'Low' | 'Medium' | 'High';
  interests: string[];
  itinerary: IDayItinerary[];
  budget: IBudget;
  hotels: IHotel[];
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  time: String,
  cost: Number
});

const dayItinerarySchema = new Schema<IDayItinerary>({
  day: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  activities: [activitySchema]
});

const budgetSchema = new Schema<IBudget>({
  flights: { type: Number, default: 0 },
  accommodation: { type: Number, default: 0 },
  food: { type: Number, default: 0 },
  activities: { type: Number, default: 0 },
  miscellaneous: { type: Number, default: 0 },
  total: { type: Number, required: true }
});

const hotelSchema = new Schema<IHotel>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  priceRange: { type: String, required: true },
  rating: Number,
  description: String
});

const tripSchema = new Schema<ITrip>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: [true, 'Please provide a destination'],
    trim: true
  },
  numberOfDays: {
    type: Number,
    required: [true, 'Please provide number of days'],
    min: [1, 'Trip must be at least 1 day'],
    max: [30, 'Trip cannot exceed 30 days']
  },
  budgetType: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: [true, 'Please select a budget type']
  },
  interests: [{
    type: String,
    trim: true
  }],
  itinerary: [dayItinerarySchema],
  budget: {
    type: budgetSchema,
    required: true
  },
  hotels: [hotelSchema]
}, {
  timestamps: true
});

// Index for efficient user trip queries
tripSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<ITrip>('Trip', tripSchema);
