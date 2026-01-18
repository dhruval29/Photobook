# Photo Book Flipbook

A beautiful, responsive photo book flipbook built with StPageFlip library. Perfect for showcasing photo albums, portfolios, or digital publications.

## Features

✨ **Smooth Page Transitions** - Realistic page-turning animations with curl effects  
📱 **Fully Responsive** - Adapts to desktop (double-page) and mobile (single-page)  
👆 **Touch & Mouse Support** - Swipe, drag, or click to turn pages  
⌨️ **Keyboard Navigation** - Use arrow keys, spacebar, Home/End  
🖥️ **Fullscreen Mode** - Immersive reading experience  
🎨 **Modern UI** - Minimal controls, dark theme, smooth animations  
⚡ **Lazy Loading** - Optimized performance with image loading  
♿ **Accessible** - Keyboard navigation and ARIA labels

## Quick Start

### 1. Setup

The project is already configured with the page-flip library. Your images are in the `images` folder.

### 2. Configuration

Edit `js/flipbook.js` to configure your flipbook:

```javascript
// Total number of pages
const PAGE_COUNT = 25;

// Image configuration
const IMAGE_FOLDER = 'images';
const IMAGE_PREFIX = 'pho_';
const IMAGE_EXTENSION = '.webp';
```

### 3. Run

Simply open `index.html` in a modern web browser, or use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## How to Add/Remove Pages

### Method 1: Update existing images

1. Place your images in the `images` folder (or create a `pages` folder)
2. Name them sequentially: `pho_1.webp`, `pho_2.webp`, `pho_3.webp`, etc.
3. Update `PAGE_COUNT` in `js/flipbook.js`

### Method 2: Custom naming convention

If your images have a different naming pattern (e.g., `page-01.jpg`, `page-02.jpg`):

1. Place images in your desired folder
2. Update the configuration in `js/flipbook.js`:

```javascript
const PAGE_COUNT = 40;
const IMAGE_FOLDER = 'pages';
const IMAGE_PREFIX = 'page-';
const IMAGE_EXTENSION = '.jpg';
```

3. Modify the `getPageImagePath()` function for zero-padded numbers:

```javascript
function getPageImagePath(pageNumber) {
    const paddedNumber = pageNumber.toString().padStart(2, '0');
    return `${IMAGE_FOLDER}/${IMAGE_PREFIX}${paddedNumber}${IMAGE_EXTENSION}`;
}
```

## Controls

### Desktop
- **Click & Drag** - Grab and drag pages to turn
- **Arrow Keys** - ← Previous page, → Next page
- **Spacebar** - Next page
- **Home/End** - Jump to first/last page
- **F Key** - Toggle fullscreen
- **Mouse Buttons** - Click prev/next buttons at bottom

### Mobile
- **Swipe** - Swipe left/right to turn pages
- **Tap** - Tap prev/next buttons at bottom
- **Pinch** - Use controls at bottom (always visible on mobile)

## Image Recommendations

For best results:
- **Format**: JPG, PNG, or WebP
- **Resolution**: 1600-2400px width for high-quality display
- **DPI**: 200 DPI recommended
- **Aspect Ratio**: Keep consistent across all pages
- **Color Profile**: sRGB
- **File Size**: Optimize to < 500KB per page for faster loading

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 13+)
- Chrome Mobile (Android 5+)

## Customization

### Change Background Color

Edit `css/styles.css`:

```css
.flipbook-wrapper {
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
}
```

### Adjust Flipbook Size

Edit `js/flipbook.js` in the `calculateDimensions()` function:

```javascript
function calculateDimensions() {
    const containerWidth = window.innerWidth * 0.9; // 90% of viewport
    const containerHeight = window.innerHeight * 0.85; // 85% of viewport
    // ...
}
```

### Change Page Turn Speed

Edit the StPageFlip configuration in `js/flipbook.js`:

```javascript
const config = {
    // ...
    flippingTime: 1000, // milliseconds (1000 = 1 second)
    // ...
};
```

### Disable Shadow Effects

```javascript
const config = {
    // ...
    drawShadow: false,
    maxShadowOpacity: 0,
    // ...
};
```

## Troubleshooting

### Images not loading
- Check that image paths are correct in `getPageImagePath()`
- Verify images exist in the specified folder
- Check browser console for errors (F12)
- Ensure you're running from a web server (not `file://`)

### Flipbook not displaying
- Open browser console (F12) and check for errors
- Verify page-flip library is loaded correctly
- Check that `PAGE_COUNT` matches your image count

### Performance issues
- Reduce image file sizes (optimize/compress images)
- Lower image resolution if very high
- Check browser extensions aren't interfering

### Touch gestures not working on mobile
- Ensure you're testing on an actual device or device emulator
- Check that `mobileScrollSupport: false` in config
- Verify touch events aren't being captured by another element

## File Structure

```
Photobook/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styles
├── js/
│   └── flipbook.js        # Flipbook logic
├── images/                # Your images
│   ├── pho_1.webp
│   ├── pho_2.webp
│   └── ...
├── node_modules/
│   └── page-flip/         # StPageFlip library
└── README.md              # This file
```

## API Reference

The flipbook exposes a global `pageFlip` object. Use these in the browser console:

```javascript
// Navigate
pageFlip.flipNext()      // Next page
pageFlip.flipPrev()      // Previous page
pageFlip.flip(5)         // Go to page 5

// Information
pageFlip.getPageCount()  // Total pages
pageFlip.getCurrentPageIndex() // Current page

// Debug
flipbookStats()          // Show statistics (custom function)
```

## License

This project uses the [page-flip](https://github.com/Nodlik/StPageFlip) library, which is MIT licensed.

## Credits

- Built with [StPageFlip](https://github.com/Nodlik/StPageFlip) by Nodlik
- Icons: Feather Icons (embedded inline)

## Support

For issues with:
- **This implementation**: Check troubleshooting section above
- **StPageFlip library**: Visit [StPageFlip GitHub](https://github.com/Nodlik/StPageFlip)

---

Enjoy your photo book! 📖✨
