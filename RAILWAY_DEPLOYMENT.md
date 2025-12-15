# Railway Deployment Guide for Ticketi

This guide walks you through deploying Ticketi to Railway.

## Prerequisites

- Railway account (sign up at https://railway.app)
- GitHub account with this repository
- Credit card (required for free $1/month credits, but won't be charged if usage stays under limit)

## Cost Information

✅ **FREE if you stay within limits:**
- $5 one-time trial credit
- $1/month ongoing credits (requires credit card)
- You're only charged if usage exceeds these credits
- Railway charges only for active resources, not idle time

For a small app like Ticketi, you should stay within free limits.

---

## Deployment Steps

### Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub (recommended for easy integration)
4. Add your credit card to unlock the $1/month free credits

### Step 2: Create New Project

1. Click "New Project" in Railway dashboard
2. Select "Deploy from GitHub repo"
3. Authorize Railway to access your GitHub
4. Select your `ticketi` repository

### Step 3: Deploy PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a PostgreSQL instance
4. Note: The `DATABASE_URL` environment variable is automatically created

### Step 4: Deploy Backend (Flask API)

1. Click "+ New" → "GitHub Repo" → Select your ticketi repo
2. Railway will detect it's a Python project
3. Click on the service → Go to "Settings" tab
4. Configure the following:

**Root Directory:**
```
/
```

**Build Command:**
```bash
./railway-build.sh
```

**Start Command:**
```bash
cd server && gunicorn app:app --bind 0.0.0.0:$PORT
```

**Environment Variables:**
Add these in the "Variables" tab:
- `FLASK_ENV` = `production`
- `JWT_SECRET_KEY` = (click "Generate" to create a random secret)
- `DATABASE_URL` = (Railway will auto-populate this from your PostgreSQL service)

5. Click "Deploy"

### Step 5: Deploy Frontend (React)

1. Click "+ New" → "GitHub Repo" → Select your ticketi repo again
2. This creates a second service for the frontend
3. Click on the service → Go to "Settings" tab
4. Configure the following:

**Root Directory:**
```
/
```

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run preview -- --host 0.0.0.0 --port $PORT
```

**Environment Variables:**
Add these in the "Variables" tab:
- `VITE_API_URL` = (copy the backend service URL from Step 4, it will look like `https://ticketi-api-production.up.railway.app`)

5. Click "Deploy"

### Step 6: Generate Public URLs

1. Click on your **backend service**
2. Go to "Settings" → "Networking"
3. Click "Generate Domain"
4. Copy this URL (e.g., `https://ticketi-api-production.up.railway.app`)

5. Click on your **frontend service**
6. Go to "Settings" → "Networking"  
7. Click "Generate Domain"
8. Copy this URL (e.g., `https://ticketi-production.up.railway.app`)

9. **Important:** Go back to frontend service environment variables and update `VITE_API_URL` with the backend URL

10. Redeploy the frontend after updating the environment variable

### Step 7: Verify Deployment

1. Open the frontend URL in your browser
2. You should see the Ticketi homepage
3. Try registering a new user
4. Try creating an event
5. Try purchasing tickets

---

## Monitoring Your Usage

To ensure you stay within free limits:

1. Click on your project in Railway
2. View the "Usage" tab
3. Monitor your monthly spend
4. You'll see warnings if you approach the $1 limit

**Tips to minimize usage:**
- Railway only charges for active resources
- Your app will automatically scale down when idle
- The free tier is usually sufficient for development and small projects

---

## Troubleshooting

### Database Connection Issues

If backend can't connect to database:
1. Check that `DATABASE_URL` is properly set in backend environment variables
2. Verify PostgreSQL service is running
3. Check backend logs for connection errors

### Frontend Can't Reach Backend

If frontend shows API errors:
1. Verify `VITE_API_URL` points to the correct backend URL
2. Make sure backend service has a public domain generated
3. Check CORS settings in Flask backend

### Build Failures

If builds fail:
1. Check the build logs in Railway
2. Verify all dependencies are in `requirements.txt` and `package.json`
3. Make sure `railway-build.sh` has execute permissions

---

## Updating Your Deployment

Railway automatically redeploys when you push to GitHub:

1. Make changes locally
2. Commit and push to GitHub
3. Railway will automatically rebuild and redeploy

---

## Alternative: Manual Deployment Using Railway CLI

If you prefer using the CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Deploy
railway up
```

---

## Support

- Railway Documentation: https://docs.railway.app
- Railway Community: https://discord.gg/railway
- Ticketi Issues: Create an issue in your GitHub repository

---

**Congratulations! 🎉 Your Ticketi app should now be live on Railway!**
