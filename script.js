// Configurable Image URLs (Update these with your actual URLs if needed)
const config = {
    welcomeBg: 'Phantom_Guard_wedge.png', // For welcome section background
    tabBg: ''          // For tab content background (if needed)
};

// Apply backgrounds dynamically
if (document.querySelector('#welcome-section')) {
    document.querySelector('#welcome-section').style.backgroundImage = `url(${config.welcomeBg})`;
}
if (document.querySelector('.tab-content')) {
    document.querySelector('.tab-content').style.backgroundImage = `url(${config.tabBg})`;
}

// Video Handling (Autoplay with Play Button Fallback)
const playBtn = document.getElementById('play-video-btn');
const video = document.getElementById('welcome-video');
const videoSection = document.getElementById('video-section');
const welcomeSection = document.getElementById('welcome-section');
const gallerySection = document.getElementById('gallery-section'); // Add this for gallery

if (playBtn && video) {
    // Show play button initially (for mobile or autoplay failure)
    playBtn.style.display = 'block';

    playBtn.addEventListener('click', async () => {
        try {
            await video.play(); // Wait for play to succeed
            playBtn.style.display = 'none'; // Hide only on success
            console.log('Video started playing');
        } catch (error) {
            console.error('Video play failed:', error);
            // On mobile, show a message if play fails
            playBtn.textContent = 'Tap Again to Play';
            setTimeout(() => playBtn.textContent = 'Play Video', 2000); // Reset text
        }
    });
}

if (video) {
    // Try autoplay
    video.play().then(() => {
        console.log('Autoplay succeeded');
        if (playBtn) playBtn.style.display = 'none'; // Hide button if autoplay works
    }).catch(() => {
        console.log('Autoplay failed, showing play button');
        // Keep play button visible
    });

    video.addEventListener('ended', () => {
        // Hide video section and show welcome section
        videoSection.style.display = 'none';
        welcomeSection.classList.add('active');
        if (gallerySection) gallerySection.classList.add('active'); // Add this to show gallery
        // Smooth scroll to welcome section
        welcomeSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// Enter Button (Redirect to info.html)
if (document.getElementById('enter-btn')) {
    document.getElementById('enter-btn').addEventListener('click', () => {
        window.location.href = 'info.html';
    });
}

// Gallery Navigation (Enhanced Debugging)
const gallery = document.querySelector('.gallery');
const images = document.querySelectorAll('.gallery-img');
let currentIndex = 0;

console.log('Gallery element found:', !!gallery); // Debug: Check if gallery exists
console.log('Gallery images found:', images.length); // Debug: Check image count
console.log('Images:', images); // List images for debugging

function updateGallery() {
    if (gallery && images.length > 0) {
        const offset = -currentIndex * 100;
        gallery.style.transform = `translateX(${offset}%)`;
        console.log(`Gallery updated: Index ${currentIndex}, Offset ${offset}%`);
    } else {
        console.error('Gallery or images not ready. Gallery:', gallery, 'Images:', images.length);
    }
}

if (document.getElementById('prev-btn')) {
    document.getElementById('prev-btn').addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
        updateGallery();
    });
}

if (document.getElementById('next-btn')) {
    document.getElementById('next-btn').addEventListener('click', () => {
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        updateGallery();
    });
}

// Initialize gallery on load and after images load
document.addEventListener('DOMContentLoaded', () => {
    updateGallery();
    console.log('Gallery initialized on DOMContentLoaded');
});

// Fallback: Update gallery when images load
images.forEach((img, index) => {
    img.addEventListener('load', () => {
        console.log(`Image ${index} loaded`);
        updateGallery(); // Re-update if images load late
    });
    img.addEventListener('error', () => {
        console.error(`Image ${index} failed to load: ${img.src}`);
    });
});

// Member Lookup (Client-Side - No Server Needed)
if (document.getElementById('lookup-form')) {
    document.getElementById('lookup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const resultDiv = document.getElementById('lookup-result');
        resultDiv.innerHTML = 'Searching...';

        // Google Sheets API details (Update these!)
        const SHEET_ID = '1KbPTvmZdWRyREnB9HC4AHPUp_qow0uss40stNvScGEE'; // e.g., '1ABC123...your-spreadsheet-id'
        const API_KEY = 'AIzaSyDIg-I7jcAucRcI_BRC6okfLqjVzgf1wuk'; // Your API key (exposed - use server for security)
        
        // Define ranges for multiple subsheets
        const ranges = [
            'Officers!A1:Z100',        // First subsheet
            'Company members!A1:Z100'  // Second subsheet
        ];

        try {
            let match = null;
            let headers = null;

            // Loop through ranges
            for (const range of ranges) {
                const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
                const response = await fetch(url);
                const data = await response.json();
                const rows = data.values || [];
                headers = rows[4]; // Headers are in row 5 (0-indexed as 4)
                match = rows.slice(5).find(row => row.includes(username)); // Search from row 6 onwards (after headers)
                if (match) break;
            }

            if (match) {
                resultDiv.innerHTML = '<h3>Member Found:</h3>' + match.map((val, i) => `<p>${headers[i] || `Column ${i + 1}`}: ${val}</p>`).join('');
            } else {
                resultDiv.innerHTML = '<p>No member found with that username.</p>';
            }
        } catch (error) {
            resultDiv.innerHTML = '<p>Error fetching data. Check console for details.</p>';
            console.error('Lookup error:', error);
        }
    });
}

// Disable Right-Click and Inspect Element (Deterrent Only)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Disable right-click menu
});

document.addEventListener('keydown', (e) => {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (view source)
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        alert('Inspecting is disabled for security reasons.'); // Optional alert
    }
});
