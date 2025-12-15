# 🔧 Quick Fix for Railway Deployment Crashes

## The Problem

Railway auto-detected your Dockerfile and tried to use it for **all three services** (database, backend, frontend). This caused crashes because:

- The Dockerfile is for the **frontend** (Node.js)
- But Railway tried to run **backend commands** (`cd server && gunicorn...`) in it
- Result: `The executable 'cd' could not be found` error

## The Solution

We need to configure each service separately and tell Railway which one should use which build method.

---

## Step-by-Step Fix

### ✅ Step 1: Delete All Services (Start Fresh)

1. In your Railway project dashboard, click on each service
2. Go to **Settings** → **Danger Zone**
3. Click **"Delete Service"** for each one (database, api, frontend)
4. Confirm deletion

### ✅ Step 2: Add PostgreSQL Database

1. Click **"+ New"** in your Railway project
2. Select **"Database"** → **"Add PostgreSQL"**
3. That's it! Railway will auto-create the database
4. Name it `ticketi-db`

### ✅ Step 3: Deploy Backend (Flask API)

1. Click **"+ New"** → **"GitHub Repo"** → Select your `ticketi` repo
2. Railway will create a new service. Click on it
3. Go to **Settings** tab:

**Service Name:** `ticketi-api`

**Root Directory:** Leave blank (use `/`)

**Custom Build Command:**
```bash
pip install -r server/requirements.txt
```

**Custom Start Command:**
```bash
cd server && gunicorn app:app --bind 0.0.0.0:$PORT
```

**Watch Paths (Optional):**
```
server/**
```

4. Go to **Variables** tab and add:
   - `FLASK_ENV` = `production`
   - `JWT_SECRET_KEY` = Click **"Generate"** to create a random value
   - `DATABASE_URL` = Click **"Add Reference"** → Select your `ticketi-db` → Select `DATABASE_URL`

5. Go to **Settings** → **Networking** → Click **"Generate Domain"**

6. Copy the generated URL (you'll need it for the frontend)

7. Click **"Deploy"** at the top

### ✅ Step 4: Deploy Frontend (React)

1. Click **"+ New"** → **"GitHub Repo"** → Select your `ticketi` repo again
2. Railway will create another service. Click on it
3. Go to **Settings** tab:

**Service Name:** `ticketi-frontend`

**Root Directory:** Leave blank (use `/`)

**Custom Build Command:**
```bash
npm install && npm run build
```

**Custom Start Command:**
```bash
npm run preview -- --host 0.0.0.0 --port $PORT
```

**Watch Paths (Optional):**
```
src/**
index.html
package.json
```

4. Go to **Variables** tab and add:
   - `VITE_API_URL` = Paste the backend URL from Step 3 (e.g., `https://ticketi-api-production-xxxx.up.railway.app`)

5. Go to **Settings** → **Networking** → Click **"Generate Domain"**

6. Click **"Deploy"** at the top

### ✅ Step 5: Monitor Deployments

1. Watch the deployment logs for each service
2. Backend should show: "Starting gunicorn..."
3. Frontend should show: "Local: http://0.0.0.0:XXXX"
4. Both should say **"Build Success"** and **"Deployed"**

### ✅ Step 6: Test Your App

1. Open the frontend URL in your browser
2. You should see the Ticketi homepage
3. Try registering and logging in
4. Create a test event

---

## Important Notes

### About the Credit Card

> **You need to add a credit card to unlock the ongoing $1/month free credits**
> 
> Without it, you only have the $5 trial for 30 days. To keep deploying for free after that:
> 1. Go to Railway **Settings** → **Billing**
> 2. Add your credit card
> 3. You'll get $1/month in free credits (won't be charged if usage stays under $1)

### Avoiding the Dockerfile Conflict

The issue happened because:
- Your **root Dockerfile** is for the frontend
- Railway tried to use it for everything

**Solutions:**
1. **Keep Dockerfile in root** but use **custom start/build commands** (what we're doing now)
2. **OR** move Dockerfile to frontend-specific location
3. **OR** create separate Dockerfiles for each service

For simplicity, we're using option 1 - custom commands override the Dockerfile.

---

## What Changed

I created `nixpacks.toml` as an alternative backend configuration, but for now, it's easier to just use **custom build/start commands** in Railway's UI.

---

## If You Still See Errors

### Backend Error: "ModuleNotFoundError: No module named 'flask'"
**Fix:** Make sure the build command is `pip install -r server/requirements.txt` (with `server/` prefix)

### Frontend Error: "Cannot find module '@vitejs/plugin-react'"
**Fix:** Make sure the build command is `npm install && npm run build`

### CORS Errors (Frontend can't reach backend)
**Fix:** Check that `VITE_API_URL` in frontend variables matches the backend URL exactly

---

## Summary

| Service | Build Command | Start Command |
|---------|--------------|---------------|
| **Database** | Auto-managed | Auto-managed |
| **Backend** | `pip install -r server/requirements.txt` | `cd server && gunicorn app:app --bind 0.0.0.0:$PORT` |
| **Frontend** | `npm install && npm run build` | `npm run preview -- --host 0.0.0.0 --port $PORT` |

---

**Once you follow these steps, your deployments should succeed!** 🚀
