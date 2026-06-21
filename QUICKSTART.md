# AI Travel Planner - Quick Start Guide

## Prerequisites
- Node.js v18+
- MongoDB
- OpenAI API Key

## Setup Steps

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env and update with your values
cp .env.example .env

# Required configurations in .env:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (any random secure string)
# - OPENAI_API_KEY (from OpenAI platform)
```

### 2. Frontend Setup (3 minutes)

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# No additional configuration needed
# Frontend will connect to backend at http://localhost:5000
```

### 3. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud database
# Update MONGODB_URI in backend/.env with your Atlas connection string
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will start on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will start on http://localhost:3000

### 5. Test the Application

1. Open http://localhost:3000
2. Click "Get Started" to register
3. Create your first trip!

## Common Issues

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env

### "OpenAI API Error"
- Verify OPENAI_API_KEY in backend/.env
- Check your OpenAI account has credits

### Port Already in Use
- Backend: Change PORT in backend/.env
- Frontend: Next.js will prompt to use different port

## Test Credentials

For testing, you can create any account:
- Email: test@example.com
- Password: test123

## Need Help?

Check the main README.md for detailed documentation.
