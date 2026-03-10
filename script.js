// Configuration - Update this with your deployed backend URL
const BACKEND_URL = 'https://bmi-gossip-backend-production.up.railway.app'; // Railway backend URL

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
    
    try {
        const formData = new FormData();
        formData.append('text', text);
        
        if (currentImageFile) {
            // Validate image
            if (!currentImageFile.type.startsWith('image/')) {
                showError('Please select a valid image file!');
                return;
            }
            
            if (currentImageFile.size > 5 * 1024 * 1024) { // 5MB limit
                showError('Image size must be less than 5MB!');
                return;
            }
            
            formData.append('image', currentImageFile);
        }
        
        const response = await fetch(`${BACKEND_URL}/api/posts`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to submit gossip');
        }
        
        // Reset form
        gossipForm.reset();
        currentImageFile = null;
        imagePreview.innerHTML = '';
        
        // Show success notification
        showNotification('Your gossip has been shared! ✨');
        
        // Reload posts
        await loadPosts();
        
    } catch (error) {
        console.error('Error submitting post:', error);
        showError(error.message || 'Failed to submit gossip. Please try again.');
    } finally {
        showLoading(false);
    }
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

// Load posts from backend
async function loadPosts() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/posts`);
        
        if (!response.ok) {
            throw new Error('Failed to load posts');
        }
        
        const posts = await response.json();
        renderPosts(posts);
        
    } catch (error) {
        console.error('Error loading posts:', error);
        postsFeed.innerHTML = `
            <div class="error">
                Failed to load posts. Please refresh the page.
            </div>
        `;
    }
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
