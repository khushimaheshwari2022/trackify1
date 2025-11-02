# Render Backend Deployment Guide

This guide will help you deploy your backend to Render step by step.

## Prerequisites

1. **Render Account**: Sign up at https://render.com (free tier available)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **MongoDB Atlas**: Your MongoDB Atlas connection string ready

## Step 1: Push Your Code to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Render deployment"

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

## Step 2: Create a Web Service on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** button (top right)
3. **Select "Web Service"**
4. **Connect your GitHub account** (if not already connected)
5. **Select your repository** from the list
6. **Fill in the service details:**

   - **Name**: `inventory-backend` (or any name you prefer)
   - **Region**: Choose closest to you (e.g., `Oregon (US West)`)
   - **Branch**: `main` (or `master` if that's your default branch)
   - **Root Directory**: `Backend` (important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install` (or leave blank, Render auto-detects)
   - **Start Command**: `npm start`

7. **Click "Create Web Service"**

## Step 3: Configure Environment Variables

After creating the service, go to the **"Environment"** tab and add:

### Required Environment Variables:

1. **MONGO_URL**
   - **Key**: `MONGO_URL`
   - **Value**: `mongodb+srv://khushimaheshwari2022_db_user:YOUR_PASSWORD@cluster0.igje0yi.mongodb.net/InventoryManagementApp?retryWrites=true&w=majority`
   - **Important**: Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password

2. **NODE_ENV** (Optional but recommended)
   - **Key**: `NODE_ENV`
   - **Value**: `production`

3. **FRONTEND_URL** (Set after deploying frontend to Vercel)
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-app.vercel.app`
   - **Note**: Set this after you deploy your frontend

### How to Add Environment Variables:

1. In your Render service dashboard, click on **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Enter the **Key** and **Value**
4. Click **"Save Changes"**

**Important**: After adding/modifying environment variables, Render will automatically redeploy your service.

## Step 4: Configure MongoDB Atlas IP Whitelist

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com
2. **Navigate to Network Access**
3. **Click "Add IP Address"**
4. **Click "Allow Access from Anywhere"** (`0.0.0.0/0`)
   - ⚠️ For production, you can restrict this to Render's IP ranges, but for testing, allow all IPs
5. **Click "Confirm"**

## Step 5: Deploy

1. Render will automatically start deploying when you create the service
2. **Watch the logs** in the Render dashboard to see the deployment progress
3. You should see:
   - ✅ Build logs
   - ✅ "Starting service..."
   - ✅ "Server is live on port XXXXX"

## Step 6: Get Your Backend URL

After successful deployment:

1. Your backend URL will be: `https://your-service-name.onrender.com`
   - Or if you chose a custom name: `https://your-custom-name.onrender.com`
2. **Save this URL!** You'll need it for your frontend configuration

## Step 7: Test Your Backend

Test your API endpoints:

```bash
# Replace YOUR_BACKEND_URL with your actual Render URL
curl https://YOUR_BACKEND_URL.onrender.com/api/testget
```

Or visit in browser:
```
https://YOUR_BACKEND_URL.onrender.com/api/testget
```

## Step 8: View Logs

To debug or monitor your backend:

1. Go to your service dashboard on Render
2. Click on **"Logs"** tab
3. You'll see real-time logs from your application

## Important Configuration: Root Directory

**Critical**: Make sure Root Directory is set to `Backend`:

1. Go to your service **"Settings"** tab
2. Scroll down to **"Build & Deploy"**
3. Set **Root Directory** to: `Backend`
4. Click **"Save Changes"**

This tells Render to look for `package.json` and `server.js` in the `Backend` folder.

## Automatic Deployments

By default, Render will automatically deploy when you push to your main branch:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
3. Render will automatically detect the push and redeploy

## Manual Deploy

To manually trigger a deployment:

1. Go to your service dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

## Troubleshooting

### Issue: Build fails with "Cannot find module"
- **Solution**: Check that Root Directory is set to `Backend`

### Issue: "Connection refused" or MongoDB connection fails
- **Solution**: 
  1. Verify `MONGO_URL` is set correctly in Render environment variables
  2. Check MongoDB Atlas IP whitelist includes `0.0.0.0/0` or Render IPs
  3. Verify your MongoDB password is correct

### Issue: CORS errors
- **Solution**: 
  1. Set `FRONTEND_URL` environment variable in Render with your Vercel frontend URL
  2. Or update CORS settings in `server.js` to allow your domain

### Issue: Service crashes or 502 errors
- **Solution**: 
  1. Check logs in Render dashboard
  2. Verify all environment variables are set
  3. Check MongoDB connection string format

### Issue: Port already in use
- **Solution**: This shouldn't happen, but make sure your `server.js` uses `process.env.PORT`

## Free Tier Limitations

Render free tier has some limitations:
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds (cold start)
- To avoid this, you can upgrade to paid tier or use a service like UptimeRobot to ping your service every 14 minutes

## Next Steps

After successfully deploying to Render:

1. ✅ Save your Render backend URL
2. ✅ Test all API endpoints
3. ✅ Proceed to Vercel frontend deployment
4. ✅ Update frontend to use the Render backend URL
5. ✅ Set `FRONTEND_URL` in Render environment variables

## Additional Resources

- Render Documentation: https://render.com/docs
- Render Status Page: https://status.render.com
- Render Support: https://render.com/docs/support

