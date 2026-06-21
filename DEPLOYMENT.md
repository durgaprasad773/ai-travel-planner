# Deployment Guide

## Backend Deployment (Choose one)

### Option 1: Railway
1. Go to https://railway.app
2. Create new project → Deploy from GitHub
3. Select `ai-travel-planner` repository
4. Set Root Directory: `backend`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: durga_prasad_pilli
   - `OPENAI_API_KEY`: Your OpenAI key
   - `FRONTEND_URL`: Your Vercel frontend URL (add after frontend deployment)
   - `PORT`: 5000
6. Deploy and copy the backend URL (e.g., `https://your-app.railway.app`)

### Option 2: Render
1. Go to https://render.com
2. New → Web Service → Connect GitHub repository
3. Root Directory: `backend`
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Add Environment Variables (same as Railway)
7. Deploy and copy the backend URL

## Frontend Deployment (Vercel)

1. Go to https://vercel.com
2. Import Git Repository → Select `ai-travel-planner`
3. Root Directory: `frontend`
4. **Add Environment Variable:**
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.railway.app/api` (use your deployed backend URL)
5. Deploy

## Important Notes

- ⚠️ Deploy backend BEFORE frontend
- ⚠️ Update `FRONTEND_URL` in backend env vars after frontend is deployed
- ⚠️ Make sure your OpenAI API key has sufficient credits
- ⚠️ The `NEXT_PUBLIC_` prefix is required for Next.js environment variables

## Quick Fix for Current Deployment

If you've already deployed to Vercel:
1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url/api`
4. Redeploy the application

## Testing Locally

Run both servers:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit: http://localhost:3000
