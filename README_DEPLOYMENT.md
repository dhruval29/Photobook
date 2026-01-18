# Photo Book Flipbook - Deployment Guide

## Vercel Deployment

This project is ready to deploy to Vercel!

### Prerequisites
- A Vercel account (free tier works fine)
- Git repository (GitHub, GitLab, or Bitbucket)

### Option 1: Deploy via Git (Recommended)

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Photo book flipbook"
   ```

2. **Push to GitHub/GitLab**:
   ```bash
   git remote add origin YOUR_REPO_URL
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect the settings
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd "C:\Users\dhruv\Pictures\Photobook"
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? Yes
   - Which scope? (Select your account)
   - Link to existing project? No
   - Project name? (Enter a name or press Enter)
   - In which directory is your code located? ./
   - Want to override the settings? No

### What Gets Deployed

The deployment includes:
- ✅ `index.html` - Main page
- ✅ `css/styles.css` - Styles
- ✅ `js/flipbook.js` - Flipbook logic
- ✅ `images/` - All 48 photos (image_1.webp to image_48.webp)
- ✅ `node_modules/page-flip/` - Required library files

### Deployment Configuration

The `vercel.json` file configures:
- Static file serving
- Image caching (1 year for optimal performance)
- Proper routing

### After Deployment

Once deployed, you'll get a URL like:
- `https://your-project-name.vercel.app`
- `https://your-project-name-username.vercel.app`

### Custom Domain (Optional)

You can add a custom domain:
1. Go to your project settings on Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Performance Tips

Your deployment is already optimized with:
- ✅ WebP images (small file size, high quality)
- ✅ Long cache headers for images
- ✅ Efficient loading with StPageFlip
- ✅ Responsive design
- ✅ High-quality image rendering

### Updating the Deployment

To update after making changes:

**Via Git:**
```bash
git add .
git commit -m "Update: description of changes"
git push
```
Vercel will automatically redeploy.

**Via CLI:**
```bash
vercel --prod
```

### Environment Variables

No environment variables needed for this project!

### Troubleshooting

**Images not loading?**
- Check that all images are in the `images/` folder
- Verify filenames match the pattern: `image_1.webp` to `image_48.webp`
- Check browser console for 404 errors

**Flipbook not initializing?**
- Ensure `node_modules/page-flip/` is included in deployment
- Check that `package.json` has the page-flip dependency
- Open browser console to see error messages

**Performance issues?**
- Vercel serves files from a global CDN, so performance should be excellent
- Images are cached for 1 year after first load
- Consider reducing image file sizes if needed

### Support

- Vercel docs: https://vercel.com/docs
- Project docs: See README.md
- StPageFlip docs: https://nodlik.github.io/StPageFlip/

---

Your photo book flipbook is production-ready! 🚀
