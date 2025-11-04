# Deployment Guide - Sales Prediction Feature

## Overview
This guide will help you deploy the new sales prediction feature to your existing deployments on Render (Backend) and Vercel (Frontend).

## Prerequisites
- Git repository connected to Render and Vercel
- Git installed on your local machine
- Access to your GitHub/GitLab/Bitbucket repository

---

## Step 1: Commit and Push Changes

### 1.1 Check Current Status
Open terminal in your project root directory and run:

```bash
git status
```

This will show you all the modified files.

### 1.2 Stage All Changes
```bash
git add .
```

### 1.3 Commit Changes
```bash
git commit -m "Add AI-powered sales prediction feature with linear regression"
```

### 1.4 Push to Repository
```bash
git push origin main
```
(Replace `main` with your branch name if different - could be `master`)

---

## Step 2: Backend Deployment (Render)

### Automatic Deployment (Recommended)
If your Render service is connected to your Git repository, it will **automatically deploy** when you push to the main branch.

1. **Check Render Dashboard**:
   - Go to https://dashboard.render.com
   - Navigate to your backend service
   - You should see a new deployment starting automatically

2. **Monitor Deployment**:
   - Click on "Events" or "Logs" tab
   - Watch for deployment progress
   - Should complete in 2-5 minutes

3. **Verify Deployment**:
   - Check the "Logs" tab for any errors
   - Look for: `✅ Connected to MongoDB successfully!`
   - The service should show "Live" status

### Manual Deployment (If Auto-Deploy is Disabled)
If automatic deployment isn't enabled:

1. Go to Render Dashboard → Your Backend Service
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete

### Verify Backend Endpoints
After deployment, test the new endpoints:

```bash
# Test overall sales prediction
curl https://your-render-app.onrender.com/api/sales/predict/YOUR_USER_ID?days=7

# Test product-specific prediction
curl https://your-render-app.onrender.com/api/sales/predict/YOUR_USER_ID/product/PRODUCT_ID?days=7
```

---

## Step 3: Frontend Deployment (Vercel)

### Automatic Deployment (Recommended)
Vercel automatically deploys on every push to your main branch.

1. **Check Vercel Dashboard**:
   - Go to https://vercel.com/dashboard
   - Navigate to your project
   - You should see a new deployment starting automatically

2. **Monitor Deployment**:
   - Click on the deployment to see logs
   - Should complete in 1-3 minutes
   - Status will change from "Building" to "Ready"

3. **Preview Deployment**:
   - Vercel provides a preview URL for each deployment
   - Test the new "Predictions" page before it goes live

### Manual Deployment (If Needed)
If you need to manually trigger:

1. Go to Vercel Dashboard → Your Project
2. Click "Deployments" tab
3. Click "Redeploy" → Select latest commit

---

## Step 4: Verify the Deployment

### Frontend Verification:
1. **Navigate to your Vercel site** (e.g., `https://your-app.vercel.app`)
2. **Login** to your application
3. **Check Sidebar**: You should see a new "Predictions" link
4. **Click "Predictions"**: 
   - Should load the sales prediction page
   - If you have sales data, you should see predictions
   - If no data, you'll see a helpful message

### Backend Verification:
1. **Check Browser Console** (F12 → Console tab):
   - Should not see any 404 errors for prediction endpoints
   - API calls should return data or appropriate errors

2. **Test API Directly**:
   - Open: `https://your-render-app.onrender.com/api/sales/predict/USER_ID?days=7`
   - Should return JSON with predictions or error message

---

## Troubleshooting

### Issue: Backend deployment fails

**Possible Causes:**
1. **Missing dependency**: `ml-regression` might not be installed
   - **Solution**: Check `Backend/package.json` - `ml-regression` should be listed
   - If missing, add it: `npm install ml-regression` (locally, then commit)

2. **Syntax errors in code**:
   - **Solution**: Check Render logs for specific error messages
   - Fix any syntax errors and push again

3. **MongoDB connection issues**:
   - **Solution**: Verify `MONGO_URL` environment variable is set in Render

**Check Logs:**
```bash
# In Render Dashboard → Your Service → Logs
# Look for error messages
```

### Issue: Frontend shows "Failed to load predictions"

**Possible Causes:**
1. **Backend not deployed yet**:
   - **Solution**: Wait for backend deployment to complete
   - Check backend URL in `Frontend/src/config/api.js`

2. **CORS errors**:
   - **Solution**: Backend CORS should already be configured
   - If not, check `Backend/server.js` CORS settings

3. **API URL mismatch**:
   - **Solution**: Verify `API_URL` in `Frontend/src/config/api.js` matches your Render backend URL

### Issue: Predictions page shows "Insufficient data"

**This is Normal!**
- You need at least 2-3 sales records to generate predictions
- Add some sales data through your application first
- Then refresh the predictions page

### Issue: Build fails on Vercel

**Possible Causes:**
1. **Missing import**:
   - **Solution**: Check Vercel build logs for specific import errors
   - Verify all imports in `SalesPrediction.js` are correct

2. **Environment variables**:
   - **Solution**: If using env vars, ensure they're set in Vercel dashboard
   - Project Settings → Environment Variables

---

## Quick Deployment Checklist

- [ ] All changes committed to git
- [ ] Changes pushed to main/master branch
- [ ] Backend deployment started on Render (check dashboard)
- [ ] Backend deployment completed successfully (check logs)
- [ ] Frontend deployment started on Vercel (check dashboard)
- [ ] Frontend deployment completed successfully
- [ ] Tested Predictions page on live site
- [ ] Verified API endpoints are working

---

## Post-Deployment Testing

1. **Login** to your deployed application
2. **Add Sales Data** (if you don't have any):
   - Go to Sales page
   - Add a few sales records
3. **Test Predictions**:
   - Navigate to "Predictions" in sidebar
   - Select different prediction periods (7/14/30 days)
   - Try filtering by product
   - Verify charts and tables display correctly

---

## Rollback (If Something Goes Wrong)

### Rollback on Render:
1. Go to Render Dashboard → Your Service
2. Click "Manual Deploy"
3. Select a previous commit from the dropdown
4. Deploy that commit

### Rollback on Vercel:
1. Go to Vercel Dashboard → Your Project
2. Click "Deployments" tab
3. Find the previous working deployment
4. Click "..." menu → "Promote to Production"

---

## Notes

- **Render Free Tier**: Services may spin down after 15 minutes of inactivity. First request after spin-down takes 30-60 seconds.
- **Vercel Free Tier**: Has generous limits, should be fine for most use cases.
- **Caching**: If changes don't appear immediately, try hard refresh (Ctrl+Shift+R or Cmd+Shift+R).

---

## Need Help?

If you encounter issues:
1. Check the deployment logs on both platforms
2. Verify all environment variables are set correctly
3. Ensure your git repository is properly connected to both services
4. Check that the branch you're pushing to matches the deployment branch in Render/Vercel settings
