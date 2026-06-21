export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface Activity {
  name: string;
  description: string;
  time?: string;
  cost?: number;
}

export interface DayItinerary {
  day: number;
  title: string;
  activities: Activity[];
}

export interface Budget {
  flights: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total: number;
}

export interface Hotel {
  name: string;
  category: string;
  priceRange: string;
  rating?: number;
  description?: string;
}

export interface Trip {
  _id: string;
  userId: string;
  destination: string;
  numberOfDays: number;
  budgetType: 'Low' | 'Medium' | 'High';
  interests: string[];
  itinerary: DayItinerary[];
  budget: Budget;
  hotels: Hotel[];
  createdAt: string;
  updatedAt: string;
}

export interface TripInput {
  destination: string;
  numberOfDays: number;
  budgetType: 'Low' | 'Medium' | 'High';
  interests: string[];
}
