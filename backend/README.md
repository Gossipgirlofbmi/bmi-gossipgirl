# BMI Gossip Backend

Node.js Express backend for the BMI Gossip anonymous gossip website.

## Features

- Accepts anonymous gossip posts with optional images
- Stores posts in JSON file for easy deployment
- Handles image uploads with validation
- RESTful API endpoints
- CORS enabled for frontend integration
- Error handling and validation
- Admin endpoints for post management

## API Endpoints

### GET /api/posts
Get all posts in reverse chronological order.

**Response:**
```json
[
  {
    "id": "uuid",
    "text": "Gossip text here",
    "timestamp": "2023-12-07T10:30:00.000Z",
    "badge": "Anonymous",
    "imagePath": "/uploads/filename.jpg"
  }
]
```

### POST /api/posts
Create a new gossip post.

**Request:** `multipart/form-data`
- `text` (string, required): Gossip text (max 500 characters)
- `image` (file, optional): Image file (max 5MB, image types only)

**Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "id": "uuid",
    "text": "Gossip text here",
    "timestamp": "2023-12-07T10:30:00.000Z",
    "badge": "Anonymous",
    "imagePath": "/uploads/filename.jpg"
  }
}
```

### GET /api/posts/:id
Get a specific post by ID.

### DELETE /api/posts/:id
Delete a post by ID (admin functionality).

### GET /api/admin/stats
Get admin statistics about posts.

### GET /health
Health check endpoint.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Production
npm start

# Development (with nodemon)
npm run dev
```

The server will start on port 3000 (or PORT environment variable).

## Deployment

### Environment Variables
- `PORT`: Server port (default: 3000)

### Deployment Platforms
This backend can be deployed on:
- **Render**: Free tier available
- **Railway**: Free tier available  
- **Vercel**: Serverless functions
- **Heroku**: Paid tier only
- **DigitalOcean App Platform**: Paid tier

### Render Deployment Instructions

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free
4. Deploy!

### Railway Deployment Instructions

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`

## File Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── uploads/           # Uploaded images (created automatically)
├── posts.json         # Posts storage (created automatically)
└── README.md          # This file
```

## Security Considerations

- Image file type validation
- File size limits (5MB)
- Text length limits (500 characters)
- CORS configuration
- Input sanitization
- Error handling

## Development Notes

- Posts are stored in `posts.json` for simplicity
- Images are stored in the `uploads/` directory
- The server creates necessary directories automatically
- All timestamps are in ISO 8601 format
- UUID v4 is used for post IDs
- Anonymous badges are randomly assigned
