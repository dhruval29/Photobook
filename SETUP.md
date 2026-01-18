# Quick Setup Guide

## ✅ What's Already Done

Your photo book flipbook is ready to use! Here's what has been set up:

### Files Created
- ✅ `index.html` - Main HTML file with flipbook structure
- ✅ `css/styles.css` - Complete styling with responsive design
- ✅ `js/flipbook.js` - Flipbook logic and interactivity
- ✅ `README.md` - Comprehensive documentation

### Current Configuration
- **Images**: 25 photos in the `images` folder
- **Format**: WebP files (`pho_1.webp` to `pho_25.webp`)
- **Library**: StPageFlip already installed in `node_modules`

## 🚀 How to Run

You need to run the flipbook through a web server (not by directly opening the HTML file).

### Option 1: Using Python (Recommended for beginners)

```bash
# Navigate to the Photobook folder
cd "C:\Users\dhruv\Pictures\Photobook"

# Start the server
python -m http.server 8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 2: Using Node.js

```bash
# Navigate to the Photobook folder
cd "C:\Users\dhruv\Pictures\Photobook"

# Install http-server globally (one time only)
npm install -g http-server

# Run the server
http-server
```

### Option 3: Using VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 4: Using PHP

```bash
cd "C:\Users\dhruv\Pictures\Photobook"
php -S localhost:8000
```

## 📝 Next Steps

### To Test Right Now
1. Open a terminal/command prompt
2. Navigate to `C:\Users\dhruv\Pictures\Photobook`
3. Run: `python -m http.server 8000`
4. Open your browser to `http://localhost:8000`
5. Enjoy your flipbook! 📖

### To Customize

1. **Change number of pages**: Edit `PAGE_COUNT` in `js/flipbook.js`
2. **Add more images**: Place them in the `images` folder
3. **Change colors**: Edit `css/styles.css`
4. **Adjust page turn speed**: Modify `flippingTime` in `js/flipbook.js`

## 🎨 Using Your Own Images

### If you want to use different images:

1. **Replace existing images**: Simply replace files in the `images` folder, keeping the same naming pattern (`pho_1.webp`, `pho_2.webp`, etc.)

2. **Use different names**: Create a `pages` folder and update `js/flipbook.js`:

```javascript
const PAGE_COUNT = 40; // Your page count
const IMAGE_FOLDER = 'pages';
const IMAGE_PREFIX = 'page-';
const IMAGE_EXTENSION = '.jpg';
```

3. **For zero-padded numbers** (like `page-01.jpg`, `page-02.jpg`):

Uncomment this code in `js/flipbook.js` in the `getPageImagePath()` function:

```javascript
function getPageImagePath(pageNumber) {
    const paddedNumber = pageNumber.toString().padStart(2, '0');
    return `${IMAGE_FOLDER}/${IMAGE_PREFIX}${paddedNumber}${IMAGE_EXTENSION}`;
}
```

## 🔧 Troubleshooting

### "Page not loading" error
- Make sure you're using a web server (not opening `file://` directly)
- Check browser console for errors (Press F12)

### Images not showing
- Verify image paths match the configuration
- Check that images exist in the specified folder
- Ensure `PAGE_COUNT` matches the number of images

### Flipbook not responsive
- Clear browser cache (Ctrl + F5)
- Check browser console for JavaScript errors

## 💡 Features Available

- ✅ Desktop: Double-page spread
- ✅ Mobile: Single-page view
- ✅ Touch gestures (swipe)
- ✅ Mouse drag
- ✅ Keyboard navigation (arrow keys, spacebar)
- ✅ Previous/Next buttons
- ✅ Page indicator
- ✅ Fullscreen mode (F key or button)
- ✅ Auto-hiding controls (desktop)
- ✅ Page shadows and curl effect
- ✅ Responsive resizing

## 📱 Testing on Mobile

1. Find your computer's local IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

2. Start the server on your computer

3. On your mobile device (connected to same WiFi):
   - Go to `http://YOUR_IP_ADDRESS:8000`
   - Example: `http://192.168.1.100:8000`

## 🎯 Key Keyboard Shortcuts

- `←` / `→` : Previous/Next page
- `Space` : Next page
- `Home` / `End` : First/Last page
- `F` : Toggle fullscreen
- `Esc` : Exit fullscreen

---

**Need help?** Check the full `README.md` for detailed documentation!
