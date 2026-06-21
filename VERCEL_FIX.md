# Fix Vercel 404 Error - Step by Step Guide

## Root Cause
The 404 error occurs because Vercel cannot find your Next.js application. This happens when:
1. ❌ Vercel is looking in the wrong directory (root instead of `frontend`)
2. ❌ Environment variables are not configured in Vercel
3. ❌ The build fails silently

## Solution: Reconfigure Your Vercel Deployment

### Step 1: Delete Current Deployment (Optional)
1. Go to https://vercel.com/dashboard
2. Find your `ai-travel-planner` project
3. Settings → Delete Project (optional, or just redeploy)

### Step 2: Deploy Correctly

1. **Go to Vercel Dashboard** → https://vercel.com/new

2. **Import your repository** → Select `ai-travel-planner`

3. **Configure Project Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend` ⚠️ **THIS IS CRITICAL**
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Add Environment Variable:**
   Click "Environment Variables" → Add:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: http://localhost:5000/api
   ```
   ⚠️ **IMPORTANT:** You'll change this to your deployed backend URL later

5. **Click Deploy**

### Step 3: Verify Deployment

1. Wait for build to complete (2-3 minutes)
2. Visit your Vercel URL (e.g., `https://ai-travel-planner-xxx.vercel.app`)
3. You should see the landing page

### Step 4: Deploy Backend (Required for Full Functionality)

Your frontend will work, but API calls will fail until you deploy the backend.

#### Option A: Deploy to Railway
1. Go to https://railway.app/new
2. Deploy from GitHub → Select `ai-travel-planner`
3. **Root Directory:** Set to `backend`
4. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://durga-prasad:durga-prasad@...
   JWT_SECRET=durga_prasad_pilli
   OPENAI_API_KEY=your-openai-key
   PORT=5000
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
5. Deploy and copy the URL (e.g., `https://your-app.railway.app`)

#### Option B: Deploy to Render
1. Go to https://render.com/dashboard
2. New → Web Service → Connect Repository
3. **Root Directory:** `backend`
4. **Build Command:** `npm install && npm run build`
5. **Start Command:** `npm start`
6. Add same environment variables as Railway
7. Deploy and copy the URL

### Step 5: Update Frontend Environment Variable

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. **Edit** `NEXT_PUBLIC_API_URL`:
   ```
   Old: http://localhost:5000/api
   New: https://your-backend-url.railway.app/api
   ```
3. **Redeploy:** Deployments → Three dots → Redeploy

## Understanding the Error

### Why 404 NOT_FOUND?
- **What happened:** Vercel looked for your app at the repository root
- **What it needed:** The app is in the `frontend` folder
- **Fix:** Set Root Directory to `frontend` in Vercel settings

### Why This Error Exists
This error protects monorepos (projects with multiple apps) from deploying the wrong folder. Always specify the correct root directory.

### Mental Model
```
ai-travel-planner/          ← Vercel looks here by default ❌
├── backend/                ← Not a Next.js app
├── frontend/               ← Your Next.js app is here ✅
│   ├── app/
│   ├── package.json
│   └── next.config.ts
└── README.md
```

## Warning Signs to Watch For

🚨 **Future issues to avoid:**
1. Deploying without setting Root Directory → 404 error
2. Missing `NEXT_PUBLIC_` prefix on env vars → Variables won't work
3. Backend not deployed → API calls fail with network errors
4. CORS errors → Backend needs `FRONTEND_URL` env variable

## Alternative Approaches

### Approach 1: Separate Repositories (Recommended for Production)
- **Pros:** Cleaner deployments, independent versioning
- **Cons:** More repos to manage
- Split into `ai-travel-planner-frontend` and `ai-travel-planner-backend`

### Approach 2: Monorepo with Vercel (Current)
- **Pros:** Single codebase, easier local development
- **Cons:** Need to specify root directory, more complex CI/CD
- Must set Root Directory in Vercel settings

### Approach 3: Monorepo with Nx/Turborepo
- **Pros:** Advanced tooling, better for large teams
- **Cons:** Steeper learning curve, overkill for small projects

## Quick Checklist

Before contacting support, verify:
- ✅ Root Directory is set to `frontend` in Vercel
- ✅ `NEXT_PUBLIC_API_URL` environment variable is added
- ✅ Build logs show successful compilation
- ✅ Repository has `frontend/package.json` and `frontend/next.config.ts`
- ✅ Backend is deployed separately (Railway/Render)

## Still Getting 404?

### Check Build Logs
1. Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment → View Build Logs
3. Look for errors in the build process

### Common Build Errors
- `Cannot find module`: Missing dependency → Run `npm install` in frontend
- `TypeScript errors`: Fix type errors in your code
- `Out of memory`: Upgrade Vercel plan or optimize build

### Test Locally First
```bash
cd frontend
npm run build
npm start
```
If it works locally but not on Vercel, the issue is configuration.

## Need More Help?

1. **Check Vercel Logs:** Deployment → Function Logs
2. **Verify Environment Variables:** Settings → Environment Variables
3. **Test Backend URL:** Visit `https://your-backend-url/api` in browser
4. **Check CORS:** Backend logs should show OPTIONS requests

---

## Quick Command Reference

```bash
# Test frontend locally
cd frontend
npm install
npm run dev

# Test backend locally
cd backend
npm install
npm run dev

# Build frontend for production
cd frontend
npm run build
npm start

# Commit and push changes
git add .
git commit -m "Fix Vercel configuration"
git push origin master
```

Your deployment should work after following these steps! 🚀
