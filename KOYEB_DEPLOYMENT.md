# 🚀 Koyeb Deployment Guide for Ticketi

Deploy Ticketi to Koyeb completely **FREE** with **NO CREDIT CARD** required!

---

## Why Koyeb?

✅ **No credit card needed** (truly free)  
✅ **All-in-one platform** (backend + database + frontend)  
✅ **Simple setup** (deploy from GitHub)  
✅ **Free tier includes:**
- 1 web service (512MB RAM, 0.1 vCPU, 2GB SSD)
- 1 PostgreSQL database (1GB storage, 1GB RAM)
- 100GB bandwidth/month

⚠️ **Limitations:**
- Database auto-sleeps after 5 minutes of inactivity (5-10 sec wake-up time)
- Database limited to 5 hours active time per month
- No custom domains on free tier

---

## Prerequisites

- Koyeb account (sign up at https://koyeb.com)
- GitHub account with your `ticketi` repository
- **No credit card needed!**

---

## Deployment Steps

### Step 1: Sign Up for Koyeb

1. Go to https://koyeb.com
2. Click **"Sign up"**
3. Choose **"Continue with GitHub"**
4. Authorize Koyeb to access your GitHub
5. **No credit card required!** ✅

---

### Step 2: Create PostgreSQL Database

1. In Koyeb dashboard, click **"Database"** in the left sidebar
2. Click **"Create Database"**
3. Configure:
   - **Database type**: PostgreSQL
   - **Database name**: `ticketi-db`
   - **Region**: Frankfurt (EU) or Washington D.C. (US) - choose closest to you
   - **Plan**: Free (Hobby)
4. Click **"Create Database"**
5. Wait for database to be created (~1-2 minutes)
6. Once created, click on the database
7. Go to **"Overview"** tab
8. **Copy the connection string** (looks like `postgresql://user:password@host:port/dbname`)
   - You'll need this in Step 3

---

### Step 3: Deploy Backend (Flask API)

1. In Koyeb dashboard, click **"Create App"**
2. Click **"Deploy from GitHub"**
3. Authorize Koyeb to access your repositories if prompted
4. Select your **`ticketi`** repository

#### Configure Backend Service:

**Builder Settings:**
- **Name**: `ticketi-api`
- **Builder**: Dockerfile
- **Dockerfile**: `server/Dockerfile`
- **Build context**: `/` (root)

**Port Settings:**
- **Port**: `8000`

**Environment Variables:**
Click **"Add Variable"** for each:

| Variable Name | Value |
|--------------|-------|
| `FLASK_ENV` | `production` |
| `JWT_SECRET_KEY` | Generate a random string (e.g., `openssl rand -hex 32` or use https://randomkeygen.com) |
| `DATABASE_URL` | Paste the connection string from Step 2 |

**Region:**
- Choose same region as your database (Frankfurt or Washington D.C.)

**Auto-deploy:**
- ✅ Enable auto-deploy on push to main branch

5. Click **"Deploy"**
6. Wait for deployment to complete (~3-5 minutes)
7. Once deployed, click on the service
8. Go to **"Networking"** tab
9. **Copy the public URL** (e.g., `https://ticketi-api-yourapp.koyeb.app`)
   - You'll need this in Step 4

---

### Step 4: Deploy Frontend (React)

1. In Koyeb dashboard, click **"Create App"** again
2. Click **"Deploy from GitHub"**
3. Select your **`ticketi`** repository again

#### Configure Frontend Service:

**Builder Settings:**
- **Name**: `ticketi-frontend`
- **Builder**: Dockerfile
- **Dockerfile**: `Dockerfile` (root level)
- **Build context**: `/` (root)

**Port Settings:**
- **Port**: `5173`

**Environment Variables:**
Click **"Add Variable"**:

| Variable Name | Value |
|--------------|-------|
| `VITE_API_URL` | Paste the backend URL from Step 3 (e.g., `https://ticketi-api-yourapp.koyeb.app`) |

**Region:**
- Choose same region as backend

**Auto-deploy:**
- ✅ Enable auto-deploy on push to main branch

4. Click **"Deploy"**
5. Wait for deployment to complete (~3-5 minutes)
6. Once deployed, click on the service
7. Go to **"Networking"** tab
8. **Copy the public URL** (e.g., `https://ticketi-frontend-yourapp.koyeb.app`)

---

### Step 5: Test Your Deployed App! 🎉

1. Open the **frontend URL** in your browser
2. You should see the Ticketi homepage
3. Try the following:
   - ✅ Register a new user account
   - ✅ Log in
   - ✅ Create a test event
   - ✅ Purchase tickets
   - ✅ View all events

**Note:** The first request might take 5-10 seconds if the database was sleeping. Subsequent requests will be fast!

---

## Monitoring Your Deployment

### Check Service Status

1. Go to Koyeb dashboard
2. Click on each service (backend, frontend, database)
3. Check that status shows **"Healthy"**

### View Logs

1. Click on a service
2. Go to **"Logs"** tab
3. See real-time logs for debugging

### Monitor Database Usage

1. Click on your database
2. Go to **"Metrics"** tab
3. Check active time usage (should stay under 5 hours/month)

---

## Updating Your Deployment

Koyeb automatically redeploys when you push to GitHub:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. Koyeb automatically detects the push
4. Both services rebuild and redeploy automatically
5. Check deployment status in Koyeb dashboard

---

## Troubleshooting

### Backend Deployment Failed

**Error: "ModuleNotFoundError: No module named 'flask'"**

**Fix:** Check that `requirements.txt` has all dependencies:
```bash
cd server
cat requirements.txt
```

Should include:
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-JWT-Extended
- Flask-CORS
- psycopg2-binary
- gunicorn

### Frontend Can't Connect to Backend

**Error: Network error or CORS error**

**Fix:**
1. Check `VITE_API_URL` in frontend environment variables
2. Make sure it matches the exact backend URL from Koyeb
3. Check backend logs for CORS errors
4. Verify Flask-CORS is properly configured in backend

### Database Connection Error

**Error: "could not connect to database"**

**Fix:**
1. Check `DATABASE_URL` in backend environment variables
2. Make sure it's the exact connection string from database overview
3. Wait 10-15 seconds for database to wake up from sleep
4. Check database status in Koyeb (should be "Healthy")

### Database Sleeping Too Often

**Issue:** Users experiencing 5-10 second delays frequently

**Solution:**
Consider upgrading to separate Neon database:
1. Sign up at https://neon.tech (no credit card)
2. Create free PostgreSQL database (10GB, no sleep)
3. Update `DATABASE_URL` in backend to point to Neon
4. Keep backend on Koyeb, no database time limits!

---

## Cost Breakdown

| Item | Cost |
|------|------|
| Backend Service | **FREE** (Hobby plan) |
| Frontend Service | **FREE** (Hobby plan) |
| PostgreSQL Database | **FREE** (5 hours/month) |
| Bandwidth | **FREE** (100GB/month) |
| **TOTAL** | **$0.00** 🎉 |

**No credit card needed!**

---

## Upgrading to Neon Database (Optional)

If you need more database resources:

### Why Upgrade?
- ✅ No sleep delays (instant response)
- ✅ 10GB storage (vs 1GB)
- ✅ No active time limits
- ✅ Still free, no credit card

### How to Upgrade:

1. **Sign up at Neon**
   - Go to https://neon.tech
   - Sign up with GitHub (no credit card)

2. **Create PostgreSQL database**
   - Click "Create Project"
   - Name: `ticketi`
   - Region: Choose closest to you
   - Copy connection string

3. **Update Backend Environment**
   - In Koyeb, go to backend service
   - Click "Settings" → "Environment"
   - Update `DATABASE_URL` to Neon connection string
   - Redeploy

4. **Delete Koyeb Database** (optional)
   - Go to Database in Koyeb
   - Delete `ticketi-db` to free up quota

---

## Next Steps

🎉 **Congratulations! Your Ticketi app is now live and deployed for FREE!**

### Share Your Work:
- Add the live URL to your resume
- Share in your portfolio
- Include in job applications
- Show to friends and family

### Keep Developing:
- Make updates locally
- Push to GitHub
- Koyeb auto-deploys your changes

### Monitor Usage:
- Check Koyeb dashboard regularly
- Keep database active time under 5 hours/month
- Monitor logs for errors

---

## Support Resources

- **Koyeb Docs**: https://docs.koyeb.com
- **Koyeb Discord**: https://discord.gg/koyeb
- **Neon Docs** (if using): https://neon.tech/docs

---

**Need help?** Check the troubleshooting section or create an issue in your GitHub repository!

**Enjoy your free deployment!** 🚀
