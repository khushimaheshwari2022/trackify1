# Vercel Frontend Deployment Guide

This guide will help you deploy your React frontend to Vercel step by step.

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com (free, use GitHub/Google)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Render Backend URL**: Your Render backend should be deployed and running
   - Example: `https://your-backend.onrender.com`

## Step 1: Push Your Code to GitHub

If you haven't already:

```bash
# In your project root
git add .
git commit -m "Prepare frontend for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** (use GitHub account for easiest setup)
3. **Click "Add New Project"**
4. **Import your GitHub repository**
   - Select the repository: `trackify1` (or your repo name)
   - Vercel will detect it's a React app automatically

5. **Configure Project Settings:**
   - **Framework Preset**: `Create React App` (auto-detected)
   - **Root Directory**: Leave empty (or set to `Frontend` if your repo structure requires it)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

6. **Environment Variables** (IMPORTANT!):
   - Click **"Environment Variables"** section
   - Add:
     - **Key**: `REACT_APP_API_URL`
     - **Value**: `https://your-backend.onrender.com` (your Render backend URL)
     - **Environment**: Select all (Production, Preview, Development)
   - Click **"Add"**

7. **Click "Deploy"**

### Option B: Using Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to Frontend folder**:
   ```bash
   cd Frontend
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked for environment variables, add:
     - `REACT_APP_API_URL=https://your-backend.onrender.com`

## Step 3: Get Your Frontend URL

After deployment:

1. **Your frontend will be live at**: `https://your-project-name.vercel.app`
2. **Save this URL!** You'll need it for:
   - Updating Render backend CORS settings
   - Sharing your application

## Step 4: Update Render Backend CORS

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your backend service**
3. **Go to "Environment" tab**
4. **Add/Update environment variable**:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-project-name.vercel.app`
5. **Save changes** (Render will automatically redeploy)

## Step 5: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-project-name.vercel.app`
2. **Test login/register**
3. **Test adding products, stores, sales, purchases**
4. **Check browser console** for any errors

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

1. **Production**: Deploys from `main` branch
2. **Preview**: Creates preview deployments for pull requests
3. **Every push** triggers a new deployment

## Environment Variables

### Required:
- `REACT_APP_API_URL`: Your Render backend URL

### How to Update:
1. Go to your project on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add or edit variables
4. Redeploy (or wait for next git push)

## Custom Domain (Optional)

1. Go to project **"Settings"** → **"Domains"**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

## Troubleshooting

### Issue: "API calls failing" / CORS errors
- **Solution**: 
  1. Check `REACT_APP_API_URL` is set correctly in Vercel
  2. Verify `FRONTEND_URL` is set in Render backend
  3. Check backend CORS configuration allows your Vercel domain

### Issue: "Build fails"
- **Solution**:
  1. Check build logs in Vercel dashboard
  2. Ensure all dependencies are in `package.json`
  3. Check for any TypeScript/compilation errors

### Issue: "Blank page" / "404 on routes"
- **Solution**:
  1. Check if you need to configure redirects (see vercel.json below)
  2. Ensure React Router is set up correctly

### Issue: Environment variables not working
- **Solution**:
  1. Variables must start with `REACT_APP_` to be available in the browser
  2. Rebuild after adding variables (trigger redeploy)
  3. Check variable names match exactly (case-sensitive)

## Vercel Configuration File (Optional)

Create `vercel.json` in your `Frontend` folder if you need custom configuration:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures React Router works correctly with client-side routing.

## Next Steps

After successful deployment:

1. ✅ Test all functionality
2. ✅ Update Render backend `FRONTEND_URL` environment variable
3. ✅ Share your application URL
4. ✅ Monitor logs in Vercel dashboard

## Additional Resources

- Vercel Documentation: https://vercel.com/docs
- React on Vercel: https://vercel.com/docs/frameworks/react
- Vercel Status: https://www.vercel-status.com

