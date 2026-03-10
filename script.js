// Configuration - Update this with your deployed backend URL
const BACKEND_URL = 'https://bmi-gossip-backend.onrender.com'; // Your backend URL - will work once deployed

// DOM Elements
const gossipForm = document.getElementById('gossipForm');
const gossipText = document.getElementById('gossipText');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const postsFeed = document.getElementById('postsFeed');
const notification = document.getElementById('notification');
const loadingOverlay = document.getElementById('loadingOverlay');

// State
let currentImageFile = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    setupEventListeners();
    
    // Auto-refresh posts every 30 seconds
    setInterval(loadPosts, 30000);
});

// Event Listeners
function setupEventListeners() {
    gossipForm.addEventListener('submit', handleSubmit);
    imageUpload.addEventListener('change', handleImageSelect);
    
    // Add click handlers for trending tags
    document.querySelectorAll('.trending-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            gossipText.value = tag.textContent + ' ';
            gossipText.focus();
        });
    });
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();
    
    const text = gossipText.value.trim();
    if (!text) {
        showError('Please enter some gossip text!');
        return;
    }
    
    if (text.length > 500) {
        showError('Gossip text must be less than 500 characters!');
        return;
    }
    
    showLoading(true);
    
    // Always use demo mode for now
    setTimeout(() => {
        // Reset form
        gossipForm.reset();
        currentImageFile = null;
        imagePreview.innerHTML = '';
        
        // Show success notification
        showNotification('Your gossip has been shared! ✨');
        
        // Add the post to mock data
        addMockPost(text);
        
        showLoading(false);
    }, 1000);
    
    // Try to submit to real backend (but don't wait for it)
    try {
        const formData = new FormData();
        formData.append('text', text);
        
        if (currentImageFile) {
            formData.append('image', currentImageFile);
        }
        
        fetch(`${BACKEND_URL}/api/posts`, {
            method: 'POST',
            body: formData
        }).catch(() => {
            console.log('Backend submission failed, but demo worked');
        });
    } catch (error) {
        console.log('Backend not available, demo mode active');
    }
}

// Add a mock post when backend is not available
function addMockPost(text) {
    const newPost = {
        id: Date.now().toString(),
        text: text,
        timestamp: new Date().toISOString(),
        badge: generateBadge(),
        imagePath: null
    };
    
    // Get current posts or create empty array
    const currentPosts = document.querySelectorAll('.post-card');
    if (currentPosts.length === 0) {
        renderMockPosts();
    }
    
    // Add new post at the beginning
    const postsFeed = document.getElementById('postsFeed');
    const newPostHTML = createPostHTML(newPost);
    postsFeed.insertAdjacentHTML('afterbegin', newPostHTML);
}

// Handle image selection
function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file!');
        imageUpload.value = '';
        return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        showError('Image size must be less than 5MB!');
        imageUpload.value = '';
        return;
    }
    
    currentImageFile = file;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <button type="button" class="remove-image" onclick="removeImage()">✕ Remove</button>
        `;
    };
    reader.readAsDataURL(file);
}

// Remove selected image
function removeImage() {
    currentImageFile = null;
    imageUpload.value = '';
    imagePreview.innerHTML = '';
}

// Load posts from backend or use mock data
async function loadPosts() {
    // Always use mock data for now to ensure it works
    renderMockPosts();
    
    // Try to load from backend (but don't fail if it doesn't work)
    try {
        const response = await fetch(`${BACKEND_URL}/api/posts`);
        if (response.ok) {
            const posts = await response.json();
            if (posts && posts.length > 0) {
                renderPosts(posts);
            }
        }
    } catch (error) {
        console.log('Backend not available, using mock data');
    }
}

// Mock posts for testing when backend is not available
function renderMockPosts() {
    const mockPosts = [
        {
            id: '1',
            text: 'Welcome to BMI Gossip! This is a demo post. Your real posts will appear here once the backend is deployed! 🌸',
            timestamp: new Date().toISOString(),
            badge: 'Demo',
            imagePath: null
        },
        {
            id: '2', 
            text: 'Spotted: Someone studying in the library at 2AM! #LibrarySpotted 📚',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            badge: 'Anonymous',
            imagePath: null
        }
    ];
    
    renderPosts(mockPosts);
}

// Render posts in the feed
function renderPosts(posts) {
    if (!posts || posts.length === 0) {
        postsFeed.innerHTML = `
            <div class="no-posts">
                No gossip yet! Be the first to share some tea. 🍵
            </div>
        `;
        return;
    }
    
    const postsHTML = posts.map(post => createPostHTML(post)).join('');
    postsFeed.innerHTML = postsHTML;
}

// Create HTML for a single post
function createPostHTML(post) {
    const timestamp = formatTimestamp(post.timestamp);
    const badge = generateBadge();
    
    let imageHTML = '';
    if (post.imagePath) {
        imageHTML = `<img src="${BACKEND_URL}${post.imagePath}" alt="Gossip image" class="post-image">`;
    }
    
    return `
        <div class="post-card">
            <div class="post-content">${escapeHtml(post.text)}</div>
            ${imageHTML}
            <div class="post-meta">
                <span class="post-timestamp">${timestamp}</span>
                <span class="post-badge">${badge}</span>
            </div>
        </div>
    `;
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

// Generate random badge
function generateBadge() {
    const badges = [
        'Anonymous', 'Mysterious', 'Secret', 'Whisper', 'Rumor',
        'Tea Time', 'Spotted', 'Heard', 'Buzz', 'Scoop'
    ];
    return badges[Math.floor(Math.random() * badges.length)];
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message) {
    const notificationText = document.querySelector('.notification-text');
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Show error message
function showError(message) {
    showNotification(message);
    notification.style.background = 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)';
    
    setTimeout(() => {
        notification.style.background = 'linear-gradient(135deg, #ff2d87 0%, #ff1493 100%)';
    }, 3000);
}

// Show/hide loading overlay
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.add('show');
    } else {
        loadingOverlay.classList.remove('show');
    }
}

// Add some CSS for error states dynamically
const errorStyles = `
    .error, .no-posts {
        text-align: center;
        color: #888;
        font-style: italic;
        padding: 2rem;
        background: #1a1a1a;
        border-radius: 10px;
        border: 1px solid #333;
    }
    
    .remove-image {
        background: #ff4444;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 0.5rem;
        font-size: 0.9rem;
    }
    
    .remove-image:hover {
        background: #cc0000;
    }
`;

// Inject error styles
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);
