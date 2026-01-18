/**
 * PHOTO BOOK FLIPBOOK
 * 
 * A high-quality, responsive flipbook implementation using StPageFlip
 * 
 * HOW TO ADD/REMOVE PAGES:
 * 1. Add your image files to the /pages/ folder (or /images/ folder)
 * 2. Update the PAGE_COUNT constant below to match the number of images
 * 3. Ensure images are named sequentially (e.g., page-01.jpg, page-02.jpg, etc.)
 *    OR update the getPageImage() function to match your naming convention
 * 
 * CONFIGURATION:
 * - PAGE_COUNT: Total number of pages in your flipbook
 * - IMAGE_FOLDER: Path to your images folder
 * - IMAGE_PREFIX: Prefix for image filenames
 * - IMAGE_EXTENSION: File extension (.jpg, .png, .webp, etc.)
 */

/* ============================================
   CONFIGURATION
   ============================================ */

// Total number of pages (UPDATE THIS when adding/removing pages)
const PAGE_COUNT = 48;

// Image configuration
const IMAGE_FOLDER = 'images'; // Change to 'pages' if using a pages folder
const IMAGE_PREFIX = 'image_'; // Change to match your naming (e.g., 'page-' for page-01.jpg)
const IMAGE_EXTENSION = '.webp'; // Change to .jpg, .png, etc. as needed

/* ============================================
   GLOBAL VARIABLES
   ============================================ */

let pageFlip = null;
let currentPageNumber = 0;
let isFullscreen = false;
let isMobile = false;
let controlsTimeout = null;

// DOM Elements
const elements = {
    loading: null,
    container: null,
    controls: null,
    prevBtn: null,
    nextBtn: null,
    currentPageSpan: null,
    totalPagesSpan: null,
    fullscreenBtn: null,
    instructions: null,
    closeInstructions: null
};

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initialize the flipbook when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Photo Book Flipbook...');
    
    // Cache DOM elements
    cacheElements();
    
    // Detect device type
    detectDevice();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show instructions on first visit
    checkFirstVisit();
    
    // Initialize the flipbook
    initializeFlipbook();
});

/**
 * Cache all DOM elements for performance
 */
function cacheElements() {
    elements.loading = document.getElementById('loading');
    elements.container = document.getElementById('flipbook-container');
    elements.controls = document.getElementById('controls');
    elements.prevBtn = document.getElementById('prev-btn');
    elements.nextBtn = document.getElementById('next-btn');
    elements.currentPageSpan = document.getElementById('current-page');
    elements.totalPagesSpan = document.getElementById('total-pages');
    elements.fullscreenBtn = document.getElementById('fullscreen-btn');
    elements.instructions = document.getElementById('instructions');
    elements.closeInstructions = document.getElementById('close-instructions');
}

/**
 * Detect if device is mobile/tablet
 */
function detectDevice() {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                || window.innerWidth < 768;
    
    console.log(`📱 Device type: ${isMobile ? 'Mobile' : 'Desktop'}`);
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Navigation buttons
    elements.prevBtn.addEventListener('click', () => previousPage());
    elements.nextBtn.addEventListener('click', () => nextPage());
    
    // Fullscreen button
    elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Instructions
    elements.closeInstructions.addEventListener('click', closeInstructions);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
    
    // Window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResize();
        }, 250);
    });
    
    // Fullscreen change detection
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // Mouse movement for auto-hiding controls (desktop only)
    if (!isMobile) {
        document.addEventListener('mousemove', showControlsTemporarily);
    }
}

/* ============================================
   FLIPBOOK INITIALIZATION
   ============================================ */

/**
 * Initialize the StPageFlip flipbook
 */
async function initializeFlipbook() {
    try {
        // First, load one image to get actual dimensions
        console.log('📐 Detecting image dimensions...');
        const firstImagePath = getPageImagePath(1);
        const imageDimensions = await getImageDimensions(firstImagePath);
        
        console.log(`✓ Image size: ${imageDimensions.width}x${imageDimensions.height}`);
        
        // Calculate dimensions based on actual image size
        const dimensions = calculateDimensions(imageDimensions);
        
        // Create configuration
        const config = {
            width: dimensions.width,
            height: dimensions.height,
            size: 'stretch', // Makes the book responsive
            minWidth: 200,
            maxWidth: 4000, // Allow much larger sizes for high quality
            minHeight: 300,
            maxHeight: 3000, // Allow much larger sizes for high quality
            maxShadowOpacity: 0.5,
            showCover: true,
            mobileScrollSupport: false, // Disable vertical scroll in flipbook
            swipeDistance: 30,
            clickEventForward: true,
            usePortrait: isMobile, // Single page on mobile
            startPage: 0,
            drawShadow: true,
            flippingTime: 1000,
            useMouseEvents: true,
            autoSize: false,
            showPageCorners: true,
            disableFlipByClick: false
        };
        
        console.log('📖 Configuration:', config);
        
        // Initialize StPageFlip
        pageFlip = new St.PageFlip(elements.container, config);
        
        // Load all pages
        await loadPages();
        
        // Update UI
        updatePageIndicator();
        updateNavigationButtons();
        
        // Hide loading, show controls
        elements.loading.classList.add('hidden');
        elements.controls.classList.remove('hidden');
        elements.container.classList.add('loaded');
        
        console.log('✅ Flipbook initialized successfully!');
        
        // Show controls briefly on desktop
        if (!isMobile) {
            showControlsTemporarily();
        }
        
    } catch (error) {
        console.error('❌ Error initializing flipbook:', error);
        showError('Failed to load photo book. Please refresh the page.');
    }
}

/**
 * Get actual dimensions of an image
 */
function getImageDimensions(imagePath) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight,
                aspectRatio: img.naturalWidth / img.naturalHeight
            });
        };
        img.onerror = () => {
            reject(new Error(`Failed to load image: ${imagePath}`));
        };
        img.src = imagePath;
    });
}

/**
 * Calculate optimal dimensions for the flipbook based on actual image size
 */
function calculateDimensions(imageDimensions) {
    const containerWidth = window.innerWidth * 0.85;
    const containerHeight = window.innerHeight * 0.80;
    
    // Use actual image aspect ratio
    const imageAspectRatio = imageDimensions.aspectRatio;
    
    // Calculate display size (what fits on screen)
    let displayWidth, displayHeight;
    
    if (isMobile) {
        // Single page on mobile - fill viewport
        displayHeight = containerHeight;
        displayWidth = displayHeight * imageAspectRatio;
        
        if (displayWidth > containerWidth) {
            displayWidth = containerWidth;
            displayHeight = displayWidth / imageAspectRatio;
        }
    } else {
        // Desktop: double-page spread - fill viewport
        displayHeight = containerHeight;
        displayWidth = displayHeight * imageAspectRatio;
        
        // Check if double spread fits
        if (displayWidth * 2 > containerWidth) {
            displayWidth = containerWidth / 2.2;
            displayHeight = displayWidth / imageAspectRatio;
        }
    }
    
    // Now calculate RENDER resolution (internal canvas size for quality)
    // Use 2-3x the display size or up to 80% of original image, whichever is smaller
    const qualityMultiplier = 2.5; // Render at 2.5x display resolution for high quality
    let renderWidth = Math.min(displayWidth * qualityMultiplier, imageDimensions.width * 0.8);
    let renderHeight = Math.min(displayHeight * qualityMultiplier, imageDimensions.height * 0.8);
    
    // Make sure we maintain aspect ratio
    if (renderWidth / imageAspectRatio !== renderHeight) {
        renderHeight = renderWidth / imageAspectRatio;
    }
    
    console.log(`📐 Original image: ${imageDimensions.width}x${imageDimensions.height}`);
    console.log(`📐 Display size: ${Math.floor(displayWidth)}x${Math.floor(displayHeight)}`);
    console.log(`📐 Render size: ${Math.floor(renderWidth)}x${Math.floor(renderHeight)} (${Math.floor(renderWidth/imageDimensions.width*100)}% of original)`);
    console.log(`📐 Quality multiplier: ${qualityMultiplier}x`);
    
    // Return the display size - the library will use this to determine displayed size
    // The high-res images will be scaled down by CSS, maintaining quality
    return {
        width: Math.floor(displayWidth),
        height: Math.floor(displayHeight)
    };
}

/**
 * Load all pages into the flipbook
 */
async function loadPages() {
    console.log(`📄 Loading ${PAGE_COUNT} pages...`);
    
    // Create array of image paths (strings, not Image objects)
    const imagePaths = [];
    
    for (let i = 1; i <= PAGE_COUNT; i++) {
        imagePaths.push(getPageImagePath(i));
    }
    
    console.log('📚 Image paths prepared, loading into flipbook...');
    
    // Add pages to flipbook - pass array of path strings
    pageFlip.loadFromImages(imagePaths);
    
    // Update total pages display
    elements.totalPagesSpan.textContent = PAGE_COUNT;
    
    // Setup page flip event listeners
    pageFlip.on('flip', (e) => {
        currentPageNumber = e.data;
        updatePageIndicator();
        updateNavigationButtons();
        console.log(`📖 Flipped to page ${currentPageNumber + 1}`);
    });
    
    pageFlip.on('changeOrientation', (e) => {
        console.log('📐 Orientation changed:', e.data);
    });
    
    pageFlip.on('changeState', (e) => {
        console.log('🔄 State changed:', e.data);
    });
}

/**
 * Load a single page image
 * Implements lazy loading with error handling
 */
function loadPageImage(pageNumber) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const imagePath = getPageImagePath(pageNumber);
        
        img.onload = () => {
            console.log(`✓ Loaded: ${imagePath}`);
            // Set additional attributes after load
            img.alt = `Page ${pageNumber}`;
            img.draggable = false;
            img.dataset.pageNumber = pageNumber;
            resolve(img);
        };
        
        img.onerror = () => {
            console.warn(`⚠ Failed to load: ${imagePath}`);
            // Create a placeholder for missing images
            const placeholder = createPlaceholderImage(pageNumber);
            resolve(placeholder);
        };
        
        // Set src last to trigger loading
        img.src = imagePath;
    });
}

/**
 * Get the path for a page image
 * Customize this function to match your naming convention
 */
function getPageImagePath(pageNumber) {
    // Format: images/pho_1.webp, images/pho_2.webp, etc.
    return `${IMAGE_FOLDER}/${IMAGE_PREFIX}${pageNumber}${IMAGE_EXTENSION}`;
    
    // Alternative formats (uncomment and modify as needed):
    
    // Zero-padded format: pages/page-01.jpg, pages/page-02.jpg, etc.
    // const paddedNumber = pageNumber.toString().padStart(2, '0');
    // return `${IMAGE_FOLDER}/${IMAGE_PREFIX}${paddedNumber}${IMAGE_EXTENSION}`;
    
    // Three-digit format: pages/page-001.jpg
    // const paddedNumber = pageNumber.toString().padStart(3, '0');
    // return `${IMAGE_FOLDER}/${IMAGE_PREFIX}${paddedNumber}${IMAGE_EXTENSION}`;
}

/**
 * Create a placeholder image for missing pages
 */
function createPlaceholderImage(pageNumber) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1200;
    
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Text
    ctx.fillStyle = '#666';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Page ${pageNumber}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText('Image not found', canvas.width / 2, canvas.height / 2 + 40);
    
    const img = new Image();
    img.src = canvas.toDataURL('image/png');
    img.alt = `Page ${pageNumber} placeholder`;
    img.draggable = false;
    img.dataset.pageNumber = pageNumber;
    
    return img;
}

/* ============================================
   NAVIGATION CONTROLS
   ============================================ */

/**
 * Go to the next page
 */
function nextPage() {
    if (pageFlip && currentPageNumber < PAGE_COUNT - 1) {
        pageFlip.flipNext();
    }
}

/**
 * Go to the previous page
 */
function previousPage() {
    if (pageFlip && currentPageNumber > 0) {
        pageFlip.flipPrev();
    }
}

/**
 * Update the page indicator display
 */
function updatePageIndicator() {
    const displayPage = currentPageNumber + 1;
    elements.currentPageSpan.textContent = displayPage;
}

/**
 * Update navigation button states
 */
function updateNavigationButtons() {
    // Disable previous button on first page
    elements.prevBtn.disabled = currentPageNumber === 0;
    
    // Disable next button on last page
    elements.nextBtn.disabled = currentPageNumber >= PAGE_COUNT - 1;
}

/**
 * Handle keyboard navigation
 */
function handleKeyPress(event) {
    switch(event.key) {
        case 'ArrowLeft':
        case 'PageUp':
            previousPage();
            break;
        case 'ArrowRight':
        case 'PageDown':
        case ' ': // Spacebar
            event.preventDefault(); // Prevent page scroll
            nextPage();
            break;
        case 'Home':
            if (pageFlip) {
                pageFlip.flip(0);
            }
            break;
        case 'End':
            if (pageFlip) {
                pageFlip.flip(PAGE_COUNT - 1);
            }
            break;
        case 'f':
        case 'F':
            toggleFullscreen();
            break;
        case 'Escape':
            if (isFullscreen) {
                exitFullscreen();
            }
            break;
    }
}

/* ============================================
   FULLSCREEN FUNCTIONALITY
   ============================================ */

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    if (!isFullscreen) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

/**
 * Enter fullscreen mode
 */
function enterFullscreen() {
    const wrapper = document.querySelector('.flipbook-wrapper');
    
    if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen();
    } else if (wrapper.webkitRequestFullscreen) {
        wrapper.webkitRequestFullscreen();
    } else if (wrapper.mozRequestFullScreen) {
        wrapper.mozRequestFullScreen();
    } else if (wrapper.msRequestFullscreen) {
        wrapper.msRequestFullscreen();
    }
}

/**
 * Exit fullscreen mode
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * Handle fullscreen change events
 */
function handleFullscreenChange() {
    isFullscreen = !!(document.fullscreenElement || 
                      document.webkitFullscreenElement || 
                      document.mozFullScreenElement || 
                      document.msFullscreenElement);
    
    console.log(`🖥 Fullscreen: ${isFullscreen ? 'ON' : 'OFF'}`);
    
    // Update fullscreen icon
    updateFullscreenIcon();
    
    // Resize flipbook if needed
    if (pageFlip) {
        setTimeout(() => {
            pageFlip.updateFromHtml();
        }, 300);
    }
}

/**
 * Update fullscreen button icon
 */
function updateFullscreenIcon() {
    const icon = document.getElementById('fullscreen-icon');
    
    if (isFullscreen) {
        // Exit fullscreen icon
        icon.innerHTML = '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>';
    } else {
        // Enter fullscreen icon
        icon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>';
    }
}

/* ============================================
   RESPONSIVE BEHAVIOR
   ============================================ */

/**
 * Handle window resize
 */
function handleResize() {
    const wasMobile = isMobile;
    detectDevice();
    
    // If device type changed, reinitialize
    if (wasMobile !== isMobile) {
        console.log('📱 Device type changed, reinitializing...');
        const currentPage = currentPageNumber;
        
        // Destroy and recreate
        if (pageFlip) {
            pageFlip.destroy();
        }
        
        initializeFlipbook().then(() => {
            // Return to the same page
            if (currentPage > 0 && pageFlip) {
                pageFlip.flip(currentPage);
            }
        });
    } else if (pageFlip) {
        // Just update dimensions
        pageFlip.updateFromHtml();
    }
}

/* ============================================
   UI ENHANCEMENTS
   ============================================ */

/**
 * Show controls temporarily on desktop
 */
function showControlsTemporarily() {
    if (isMobile) return;
    
    elements.controls.classList.add('active');
    
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
        elements.controls.classList.remove('active');
    }, 3000);
}

/**
 * Check if this is the user's first visit
 */
function checkFirstVisit() {
    const hasVisited = localStorage.getItem('photobook_visited');
    
    if (!hasVisited) {
        // Show instructions
        elements.instructions.classList.remove('hidden');
    } else {
        // Hide instructions
        elements.instructions.classList.add('hidden');
    }
}

/**
 * Close instructions overlay
 */
function closeInstructions() {
    elements.instructions.classList.add('hidden');
    localStorage.setItem('photobook_visited', 'true');
}

/**
 * Display an error message to the user
 */
function showError(message) {
    elements.loading.innerHTML = `
        <div style="color: #ff6b6b; text-align: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 15px;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">Error</p>
            <p style="font-size: 14px; opacity: 0.8;">${message}</p>
        </div>
    `;
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Preload images for better performance (optional enhancement)
 */
function preloadImages(startIndex, count) {
    for (let i = startIndex; i < startIndex + count && i <= PAGE_COUNT; i++) {
        const img = new Image();
        img.src = getPageImagePath(i);
    }
}

/**
 * Log flipbook statistics (for debugging)
 */
function logStatistics() {
    if (!pageFlip) return;
    
    console.log('📊 Flipbook Statistics:', {
        totalPages: PAGE_COUNT,
        currentPage: currentPageNumber + 1,
        isMobile: isMobile,
        isFullscreen: isFullscreen,
        orientation: pageFlip.getOrientation(),
        pageCount: pageFlip.getPageCount(),
        bounds: pageFlip.getBoundsRect()
    });
}

// Expose statistics function to console for debugging
window.flipbookStats = logStatistics;

console.log('✨ Flipbook script loaded successfully!');
console.log('💡 Tip: Type flipbookStats() in the console to see detailed statistics');
