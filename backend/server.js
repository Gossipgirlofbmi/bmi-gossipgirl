const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Data storage
const POSTS_FILE = path.join(__dirname, 'posts.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure directories exist
fs.ensureDirSync(UPLOADS_DIR);
fs.ensureFileSync(POSTS_FILE);

// Initialize posts file if empty
if (fs.readJsonSync(POSTS_FILE, { throws: false }) === undefined) {
    fs.writeJsonSync(POSTS_FILE, []);
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with original extension
        const ext = path.extname(file.originalname);
        const filename = uuidv4() + ext;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Helper functions
function loadPosts() {
    try {
        return fs.readJsonSync(POSTS_FILE);
    } catch (error) {
        console.error('Error loading posts:', error);
        return [];
    }
}

function savePosts(posts) {
    try {
        fs.writeJsonSync(POSTS_FILE, posts, { spaces: 2 });
        return true;
    } catch (error) {
        console.error('Error saving posts:', error);
        return false;
    }
}

function generateBadge() {
    const badges = [
        'Anonymous', 'Mysterious', 'Secret', 'Whisper', 'Rumor',
        'Tea Time', 'Spotted', 'Heard', 'Buzz', 'Scoop'
    ];
    return badges[Math.floor(Math.random() * badges.length)];
}

// Routes

// GET /api/posts - Get all posts
app.get('/api/posts', (req, res) => {
    try {
        const posts = loadPosts();
        
        // Sort posts by timestamp (newest first)
        const sortedPosts = posts.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        res.json(sortedPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ 
            error: 'Failed to fetch posts',
            message: 'Internal server error'
        });
    }
});

// POST /api/posts - Create a new post
app.post('/api/posts', upload.single('image'), (req, res) => {
    try {
        const { text } = req.body;
        
        // Validation
        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                error: 'Missing text field',
                message: 'Gossip text is required'
            });
        }
        
        const trimmedText = text.trim();
        if (!trimmedText) {
            return res.status(400).json({
                error: 'Empty text',
                message: 'Gossip text cannot be empty'
            });
        }
        
        if (trimmedText.length > 500) {
            return res.status(400).json({
                error: 'Text too long',
                message: 'Gossip text must be less than 500 characters'
            });
        }
        
        // Create new post object
        const newPost = {
            id: uuidv4(),
            text: trimmedText,
            timestamp: new Date().toISOString(),
            badge: generateBadge()
        };
        
        // Add image path if image was uploaded
        if (req.file) {
            newPost.imagePath = `/uploads/${req.file.filename}`;
        }
        
        // Load existing posts
        const posts = loadPosts();
        
        // Add new post
        posts.push(newPost);
        
        // Save posts
        if (!savePosts(posts)) {
            return res.status(500).json({
                error: 'Save failed',
                message: 'Failed to save post'
            });
        }
        
        // Return success response
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post: newPost
        });
        
        console.log(`New post created: ${newPost.id}`);
        
    } catch (error) {
        console.error('Error creating post:', error);
        
        // Handle multer errors
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    error: 'File too large',
                    message: 'Image size must be less than 5MB'
                });
            }
            return res.status(400).json({
                error: 'Upload error',
                message: error.message
            });
        }
        
        res.status(500).json({
            error: 'Server error',
            message: 'Internal server error'
        });
    }
});

// GET /api/posts/:id - Get a specific post (optional, for admin)
app.get('/api/posts/:id', (req, res) => {
    try {
        const { id } = req.params;
        const posts = loadPosts();
        
        const post = posts.find(p => p.id === id);
        
        if (!post) {
            return res.status(404).json({
                error: 'Post not found',
                message: 'No post found with that ID'
            });
        }
        
        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({
            error: 'Server error',
            message: 'Internal server error'
        });
    }
});

// DELETE /api/posts/:id - Delete a post (admin functionality)
app.delete('/api/posts/:id', (req, res) => {
    try {
        const { id } = req.params;
        const posts = loadPosts();
        
        const postIndex = posts.findIndex(p => p.id === id);
        
        if (postIndex === -1) {
            return res.status(404).json({
                error: 'Post not found',
                message: 'No post found with that ID'
            });
        }
        
        const deletedPost = posts[postIndex];
        
        // Delete associated image if exists
        if (deletedPost.imagePath) {
            const imagePath = path.join(__dirname, deletedPost.imagePath);
            try {
                fs.removeSync(imagePath);
                console.log(`Deleted image: ${imagePath}`);
            } catch (error) {
                console.error(`Failed to delete image ${imagePath}:`, error);
            }
        }
        
        // Remove post from array
        posts.splice(postIndex, 1);
        
        // Save updated posts
        if (!savePosts(posts)) {
            return res.status(500).json({
                error: 'Save failed',
                message: 'Failed to update posts after deletion'
            });
        }
        
        res.json({
            success: true,
            message: 'Post deleted successfully',
            deletedPost: deletedPost
        });
        
        console.log(`Post deleted: ${id}`);
        
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            error: 'Server error',
            message: 'Internal server error'
        });
    }
});

// GET /api/admin/stats - Get admin statistics (optional)
app.get('/api/admin/stats', (req, res) => {
    try {
        const posts = loadPosts();
        
        const stats = {
            totalPosts: posts.length,
            postsWithImages: posts.filter(p => p.imagePath).length,
            lastPostTime: posts.length > 0 ? 
                new Date(Math.max(...posts.map(p => new Date(p.timestamp)))) : null,
            storageUsed: 0 // Could calculate actual file sizes if needed
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            error: 'Server error',
            message: 'Internal server error'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'BMI Gossip Backend API',
        version: '1.0.0',
        endpoints: {
            'GET /api/posts': 'Get all posts',
            'POST /api/posts': 'Create a new post',
            'GET /api/posts/:id': 'Get a specific post',
            'DELETE /api/posts/:id': 'Delete a post',
            'GET /api/admin/stats': 'Get admin statistics',
            'GET /health': 'Health check'
        }
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Server error',
        message: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🌸 BMI Gossip Backend running on port ${PORT}`);
    console.log(`📁 Uploads directory: ${UPLOADS_DIR}`);
    console.log(`💾 Posts file: ${POSTS_FILE}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
