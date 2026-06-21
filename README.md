# AI Travel Planner

A full-stack web application that generates personalized travel itineraries using AI. Built with Next.js, TypeScript, Node.js, Express, MongoDB, and OpenAI.

## Features

### ✅ Core Requirements Implemented

- **Authentication & Authorization**
  - Secure JWT-based user authentication
  - Password hashing with bcrypt
  - Protected routes and API endpoints
  - User-specific data isolation

- **Trip Planning**
  - AI-powered itinerary generation using OpenAI GPT-4
  - Day-by-day activity planning
  - Customizable based on:
    - Destination
    - Number of days (1-30)
    - Budget type (Low, Medium, High)
    - Interests (Food, Culture, Adventure, etc.)

- **Budget Estimation**
  - Comprehensive budget breakdown
  - Categories: Flights, Accommodation, Food, Activities, Miscellaneous
  - Budget-aware recommendations

- **Editable Itineraries**
  - Add custom activities to any day
  - Remove activities from the itinerary
  - Regenerate specific days with custom requirements
  - Real-time updates

- **Hotel Suggestions**
  - AI-generated hotel recommendations
  - Budget-appropriate suggestions
  - Ratings and price ranges
  - Categorized by luxury level

- **User Dashboard**
  - View all trips
  - Create new trips
  - Delete trips
  - Trip management interface

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe server code
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **OpenAI API** - AI itinerary generation

## Project Structure

```
ai-travel-planner/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js App Router pages
│   │   ├── dashboard/      # User dashboard
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   └── trips/          # Trip pages
│   │       ├── new/        # Create trip form
│   │       └── [id]/       # Trip detail view
│   ├── components/          # Reusable components
│   │   └── ui/             # shadcn UI components
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   └── lib/                 # Utility functions
│       ├── api.ts          # API client
│       └── types.ts        # TypeScript types
│
└── backend/                 # Express.js backend application
    └── src/
        ├── config/         # Configuration files
        │   └── database.ts # MongoDB connection
        ├── controllers/    # Route controllers
        │   ├── authController.ts
        │   └── tripController.ts
        ├── middleware/     # Express middleware
        │   ├── authMiddleware.ts
        │   └── errorMiddleware.ts
        ├── models/         # Mongoose models
        │   ├── User.ts
        │   └── Trip.ts
        ├── routes/         # API routes
        │   ├── authRoutes.ts
        │   └── tripRoutes.ts
        ├── services/       # Business logic
        │   └── aiService.ts # OpenAI integration
        ├── utils/          # Utility functions
        │   ├── errors.ts
        │   └── jwt.ts
        └── server.ts       # Express app entry point
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your configurations:
# - MongoDB connection string
# - JWT secret
# - OpenAI API key
```

Update `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-travel-planner
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=http://localhost:3000
```

```bash
# Start MongoDB (if running locally)
mongod

# Run backend in development mode
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Trips
- `GET /api/trips` - Get all user trips (protected)
- `POST /api/trips` - Create new trip (protected)
- `GET /api/trips/:id` - Get single trip (protected)
- `PUT /api/trips/:id` - Update trip (protected)
- `DELETE /api/trips/:id` - Delete trip (protected)
- `POST /api/trips/:id/days/:dayNumber/activities` - Add activity (protected)
- `DELETE /api/trips/:id/days/:dayNumber/activities/:activityIndex` - Remove activity (protected)
- `POST /api/trips/:id/days/:dayNumber/regenerate` - Regenerate day (protected)

## Usage Flow

1. **Register/Login**
   - Create an account or login
   - Secure authentication with JWT

2. **Create Trip**
   - Click "Create New Trip"
   - Fill in destination, duration, budget, and interests
   - Click "Generate Trip with AI"
   - Wait for AI to generate itinerary (may take 30-60 seconds)

3. **View & Edit Itinerary**
   - View day-by-day itinerary
   - Add custom activities
   - Remove unwanted activities
   - Regenerate specific days with custom requirements

4. **Review Budget & Hotels**
   - Check estimated budget breakdown
   - View hotel recommendations

5. **Manage Trips**
   - Access all trips from dashboard
   - Delete trips you no longer need

## Clean Code Practices

- **TypeScript**: Full type safety across frontend and backend
- **Modular Architecture**: Separation of concerns (controllers, services, models)
- **Error Handling**: Centralized error handling middleware
- **Validation**: Input validation using express-validator
- **Authentication**: JWT-based secure authentication
- **Code Organization**: Clear folder structure and naming conventions
- **Reusable Components**: shadcn/ui components for consistency
- **API Abstraction**: Centralized API client with interceptors
- **Environment Variables**: Configuration management

## Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token authentication
- Protected API routes
- Data isolation (users can only access their own data)
- CORS configuration
- Input validation and sanitization
- MongoDB injection prevention

## Development

### Backend Development
```bash
cd backend
npm run dev  # Run with nodemon and ts-node
```

### Frontend Development
```bash
cd frontend
npm run dev  # Run Next.js dev server
```

### Building for Production

**Backend:**
```bash
cd backend
npm run build  # Compile TypeScript to JavaScript
npm start      # Run production server
```

**Frontend:**
```bash
cd frontend
npm run build  # Build Next.js production bundle
npm start      # Run production server
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-travel-planner
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in .env
- Verify network connectivity

### OpenAI API Issues
- Verify API key is correct
- Check API quota/billing
- Ensure network can reach OpenAI servers

### CORS Issues
- Verify FRONTEND_URL in backend .env
- Check that ports match

## Future Enhancements

- Email verification
- Password reset functionality
- Trip sharing between users
- PDF export of itineraries
- Integration with booking platforms
- Weather information
- Currency conversion
- Multi-language support
- Mobile application

## License

MIT License

## Author

Built as a full-stack engineering assessment project.
