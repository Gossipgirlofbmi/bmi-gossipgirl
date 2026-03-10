# BMI Gossip - Deployment Guide

Complete guide to deploy the BMI Gossip anonymous gossip website.

## Overview

- **Frontend**: Static HTML/CSS/JS files → GitHub Pages
- **Backend**: Node.js Express server → Render/Railway/Vercel

## Step 1: Deploy Backend First

### Option A: Render (Recommended - Free)

1. **Prepare Backend Repository**
   ```bash
   # Create a new GitHub repository for your backend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/bmi-gossip-backend.git
   git push -u origin main
   ```

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Sign up/login with GitHub
   - Click "New +" → "Web Service"
   - Connect your backend repository
   - Configure:
     - **Name**: bmi-gossip-backend
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free
   - Click "Create Web Service"

3. **Get Your Backend URL**
   - After deployment, Render will give you a URL like: `https://bmi-gossip-backend.onrender.com`
   - Copy this URL for the next step

### Option B: Railway (Alternative - Free)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy**
   ```bash
   cd backend
   railway up
   ```

3. **Get Your Backend URL**
   - Railway will provide a URL like: `https://your-app-name.up.railway.app`

### Option C: Vercel (Serverless)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Create vercel.json in backend folder**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/server.js"
       }
     ]
   }
   ```

3. **Deploy**
   ```bash
   cd backend
   vercel --prod
   ```

## Step 2: Update Frontend Configuration

1. **Update Backend URL in script.js**
   ```javascript
   // Change this line in frontend/script.js
   const BACKEND_URL = 'https://your-backend-url.onrender.com'; // Your deployed backend URL
   ```

2. **Test Locally**
   ```bash
   # Start your backend locally first to test
   cd backend
   npm install
   npm start
   
   # Open frontend/index.html in browser
   # Test with: const BACKEND_URL = 'http://localhost:3000';
   ```

## Step 3: Deploy Frontend to GitHub Pages

### Method A: Direct GitHub Pages (Easiest)

1. **Create Frontend Repository**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/bmi-gossip-frontend.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your frontend repository on GitHub
   - Click Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /root
   - Click Save

3. **Get Your Frontend URL**
   - GitHub will provide: `https://yourusername.github.io/bmi-gossip-frontend`

### Method B: GitHub Pages from Main Repository

1. **Create gh-pages branch**
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   cp -r frontend/* .
   git add .
   git commit -m "Deploy frontend"
   git push origin gh-pages
   ```

2. **Enable GitHub Pages**
   - Settings → Pages → Source: gh-pages branch

## Step 4: Final Configuration

1. **Update Production Backend URL**
   - Make sure `frontend/script.js` has your deployed backend URL:
   ```javascript
   const BACKEND_URL = 'https://bmi-gossip-backend.onrender.com';
   ```

2. **Test Everything**
   - Visit your frontend URL
   - Try submitting a post with text
   - Try submitting a post with an image
   - Check if posts appear in the feed
   - Test on mobile and desktop

## Step 5: Optional Enhancements

### Custom Domain (Frontend)

1. **GitHub Pages Custom Domain**
   - In repository Settings → Pages
   - Add your custom domain
   - Configure DNS records

### Custom Domain (Backend)

1. **Render Custom Domain**
   - Go to your service settings
   - Add custom domain
   - Configure DNS records

### SSL Certificates
- Both GitHub Pages and Render provide free SSL certificates
- Your sites will be accessible via HTTPS

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure backend URL is correct in script.js
   - Check that backend is running and accessible

2. **Image Upload Issues**
   - Check backend logs for file upload errors
   - Verify image size is under 5MB
   - Ensure image is valid format

3. **Posts Not Loading**
   - Check browser console for errors
   - Verify backend API endpoints are working
   - Test backend health endpoint: `https://your-backend-url/health`

4. **GitHub Pages Not Updating**
   - Clear browser cache
   - Wait up to 10 minutes for changes to propagate
   - Check Actions tab for deployment status

### Debug Commands

```bash
# Test backend health
curl https://your-backend-url/health

# Test posts endpoint
curl https://your-backend-url/api/posts

# Check backend logs (Render)
# Go to Render dashboard → Logs tab

# Check frontend network requests
# Open browser DevTools → Network tab
```

## File Structure After Deployment

```
your-repo/
├── frontend/           # Deployed to GitHub Pages
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/            # Deployed to Render/Railway
│   ├── server.js
│   ├── package.json
│   └── README.md
└── DEPLOYMENT.md       # This file
```

## Security Notes

- Backend URL is exposed in frontend JavaScript
- Consider adding rate limiting for production
- Monitor for abuse and spam
- Regular backup of posts.json file
- Consider adding content moderation

## Scaling Considerations

- **Free Tier Limits**: Render free tier sleeps after 15min inactivity
- **Database**: Consider switching to MongoDB/PostgreSQL for large scale
- **CDN**: Use CloudFlare for better performance
- **Monitoring**: Add uptime monitoring and alerts

## Support

If you encounter issues:

1. Check browser console for JavaScript errors
2. Check backend logs for server errors
3. Verify all URLs are correct
4. Test each component separately
5. Check CORS configuration

Your BMI Gossip site should now be live and accessible to anyone on the internet! 🌸
