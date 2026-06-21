# Deployment Guide

## ⚠️ IMPORTANT: Deploy Backend First!

The backend must be deployed and running before the frontend can work.

---

## Step 1: Backend Deployment (Railway - Recommended)

### Railway Deployment

1. **Sign up / Log in** to [Railway](https://railway.app)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account and select `ai-travel-planner` repository

3. **Configure Backend Service**
   - Railway will auto-detect the backend
   - Go to service settings
   - Set **Root Directory**: `backend`
   - Set **Build Command**: `npm install && npm run build`
   - Set **Start Command**: `npm start`

4. **Add Environment Variables**
   - Click on your service → Variables tab
   - Add these variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://durga-prasad:durga-prasad@durgaportfoliocluster.ezeobdx.mongodb.net/ai-travel-planner?retryWrites=true&w=majority&appName=durgaportfoliocluster
   JWT_SECRET=durga_prasad_pilli
   JWT_EXPIRE=7d
   OPENAI_API_KEY=your_openai_api_key_here
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
   - **Note**: Update `FRONTEND_URL` after frontend deployment (Step 2)

5. **Deploy & Get URL**
   - Click "Deploy"
   - After deployment, copy your backend URL (e.g., `https://your-app.railway.app`)
   - **Save this URL** - you'll need it for frontend deployment

---

## Step 2: Frontend Deployment (Vercel)

### Vercel Deployment

1. **Sign up / Log in** to [Vercel](https://vercel.com)

2. **Import Repository**
   - Click "Add New" → "Project"
   - Import `ai-travel-planner` repository from GitHub

3. **⚠️ CRITICAL: Configure Root Directory**
   - In "Configure Project" section
   - Find **Root Directory**
   - Click "Edit"
   - Set to: `frontend`
   - Click "Continue"

4. **Add Environment Variable**
   - Expand "Environment Variables"
   - Add variable:
     - **Name**: `NEXT_PUBLIC_API_URL`
     - **Value**: `https://your-backend.railway.app/api` (use your Railway URL from Step 1)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your frontend URL (e.g., `https://your-app.vercel.app`)

6. **Update Backend CORS**
   - Go back to Railway
   - Update `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy backend service

---

## Alternative: Backend on Render

If you prefer Render over Railway:

1. Go to [Render](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add same environment variables as Railway
6. Deploy and use the URL for frontend configuration

---

## Troubleshooting

### Frontend shows 404 error
- ✅ Check Root Directory is set to `frontend` in Vercel
- ✅ Verify `NEXT_PUBLIC_API_URL` is set correctly
- ✅ Make sure backend is deployed and running

### Backend deployment fails
- ✅ Check all environment variables are set
- ✅ Verify MongoDB connection string is correct
- ✅ Check OpenAI API key has credits

### CORS errors
- ✅ Update `FRONTEND_URL` in backend environment variables
- ✅ Make sure it matches your Vercel deployment URL exactly

---

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

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed with correct Root Directory (`frontend`)
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel environment variables
- [ ] `FRONTEND_URL` updated in backend environment variables
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Can create a trip (requires OpenAI credits)
