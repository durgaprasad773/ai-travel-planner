# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register User
**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
**POST** `/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
**GET** `/auth/me` 🔒

Returns the authenticated user's profile.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-06-21T10:00:00.000Z"
    }
  }
}
```

## Trips

### Create Trip
**POST** `/trips` 🔒

Creates a new trip with AI-generated itinerary, budget, and hotel suggestions.

**Request Body:**
```json
{
  "destination": "Tokyo",
  "numberOfDays": 5,
  "budgetType": "Medium",
  "interests": ["Food", "Culture", "History"]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "trip": {
      "_id": "64def456...",
      "userId": "64abc123...",
      "destination": "Tokyo",
      "numberOfDays": 5,
      "budgetType": "Medium",
      "interests": ["Food", "Culture", "History"],
      "itinerary": [
        {
          "day": 1,
          "title": "Exploring Traditional Tokyo",
          "activities": [
            {
              "name": "Visit Senso-ji Temple",
              "description": "Experience Tokyo's oldest temple...",
              "time": "9:00 AM",
              "cost": 0
            }
          ]
        }
      ],
      "budget": {
        "flights": 800,
        "accommodation": 600,
        "food": 400,
        "activities": 300,
        "miscellaneous": 150,
        "total": 2250
      },
      "hotels": [
        {
          "name": "Tokyo Grand Hotel",
          "category": "Mid Range",
          "priceRange": "$100-150/night",
          "rating": 4.5,
          "description": "Centrally located hotel..."
        }
      ],
      "createdAt": "2026-06-21T10:00:00.000Z",
      "updatedAt": "2026-06-21T10:00:00.000Z"
    }
  }
}
```

### Get All Trips
**GET** `/trips` 🔒

Returns all trips for the authenticated user.

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 2,
  "data": {
    "trips": [...]
  }
}
```

### Get Single Trip
**GET** `/trips/:id` 🔒

Returns a specific trip by ID.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "trip": {...}
  }
}
```

### Update Trip
**PUT** `/trips/:id` 🔒

Updates a trip's information.

**Request Body:**
```json
{
  "itinerary": [...],
  "budget": {...},
  "hotels": [...]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "trip": {...}
  }
}
```

### Delete Trip
**DELETE** `/trips/:id` 🔒

Deletes a trip permanently.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {}
}
```

### Add Activity to Day
**POST** `/trips/:id/days/:dayNumber/activities` 🔒

Adds a custom activity to a specific day in the itinerary.

**Request Body:**
```json
{
  "name": "Visit Akihabara",
  "description": "Explore the electronics district",
  "time": "2:00 PM",
  "cost": 50
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "trip": {...}
  }
}
```

### Remove Activity from Day
**DELETE** `/trips/:id/days/:dayNumber/activities/:activityIndex` 🔒

Removes an activity from a specific day.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "trip": {...}
  }
}
```

### Regenerate Day
**POST** `/trips/:id/days/:dayNumber/regenerate` 🔒

Regenerates a specific day with new AI-generated activities based on requirements.

**Request Body:**
```json
{
  "requirements": "More outdoor activities and less shopping"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "trip": {...}
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access forbidden"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Rate Limiting

Currently, there are no rate limits implemented. Consider adding rate limiting in production.

## Data Validation

### Trip Creation Validation
- `destination`: Required, non-empty string
- `numberOfDays`: Required, integer between 1 and 30
- `budgetType`: Required, one of: "Low", "Medium", "High"
- `interests`: Required, array with at least 1 item

### Authentication Validation
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- `name`: Required for registration

## Notes

- All dates are returned in ISO 8601 format
- All monetary values are in USD
- Trip generation may take 30-60 seconds due to AI processing
- Ensure OpenAI API key has sufficient credits

---

🔒 = Protected route (requires authentication)
