# BMI Gossip - Anonymous Gossip Website

A full-stack anonymous gossip website where users can share and read anonymous gossip posts with optional images.

![BMI Gossip](https://img.shields.io/badge/GOSSIP-GIRL-ff2d87?style=for-the-badge&logo=)

## Features

### Frontend ✨
- **Responsive Design**: Works perfectly on mobile and desktop
- **Dark Theme**: Modern black background with pink highlights (#ff2d87)
- **Anonymous Posting**: Submit gossip with text and optional images
- **Trending Topics**: Click hashtags to quickly add trending topics
- **Real-time Feed**: Auto-refreshes every 30 seconds
- **Image Upload**: Support for images up to 5MB
- **Notifications**: Success/error messages with animations
- **Mobile Optimized**: Touch-friendly interface

### Backend 🚀
- **Node.js + Express**: Fast and reliable server
- **Image Handling**: Multer for secure file uploads
- **JSON Storage**: Simple and deployment-friendly data storage
- **RESTful API**: Clean endpoints for all operations
- **Error Handling**: Comprehensive validation and error responses
- **CORS Enabled**: Ready for frontend integration
- **Admin Endpoints**: Post management and statistics

### Tech Stack 🛠️
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express, Multer
- **Storage**: JSON file + local file system
- **Deployment**: GitHub Pages + Render/Railway

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```

### 2. Frontend Setup
```bash
# Open frontend/index.html in your browser
# Or use a live server extension
```

### 3. Test Locally
- Backend runs on `http://localhost:3000`
- Open `frontend/index.html` in browser
- Try submitting a post!

## Live Demo

[Check out the live demo here](https://your-demo-url.com) *(Replace with your deployed URL)*

## Project Structure

```
BMI-GOSSIP/
├── frontend/           # Frontend files
│   ├── index.html     # Main HTML structure
│   ├── style.css      # Responsive CSS styling
│   └── script.js      # Frontend JavaScript
├── backend/           # Backend files
│   ├── server.js      # Express server
│   ├── package.json   # Dependencies
│   └── README.md      # Backend documentation
├── DEPLOYMENT.md      # Complete deployment guide
└── README.md          # This file
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create new post |
| GET | `/api/posts/:id` | Get specific post |
| DELETE | `/api/posts/:id` | Delete post |
| GET | `/api/admin/stats` | Get statistics |
| GET | `/health` | Health check |

## Deployment

### 🚀 Quick Deploy (5 minutes)

1. **Deploy Backend to Render**
   - Fork this repository
   - Create new Web Service on Render
   - Connect the `backend` folder
   - Build: `npm install`, Start: `npm start`

2. **Deploy Frontend to GitHub Pages**
   - Create new repository for frontend
   - Enable GitHub Pages
   - Deploy `frontend` folder

3. **Update Configuration**
   - Edit `frontend/script.js`
   - Change `BACKEND_URL` to your Render URL

📖 **Detailed Instructions**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## Screenshots

### Desktop View
- Clean, modern interface with dark theme
- Form for submitting gossip
- Trending topics sidebar
- Real-time feed with images

### Mobile View
- Fully responsive design
- Touch-optimized controls
- Mobile-friendly image handling

## Features in Detail

### Anonymous Posting
- No registration required
- Random badges assigned (Anonymous, Mysterious, Secret, etc.)
- Optional image uploads with preview
- Character limit (500) for concise posts

### Real-time Updates
- Feed auto-refreshes every 30 seconds
- New posts appear with smooth animations
- Success notifications for submissions
- Error handling with user-friendly messages

### Image Support
- Upload images up to 5MB
- Automatic image resizing and optimization
- Preview before submission
- Secure file handling with validation

### Trending Topics
- Click hashtags to add to posts
- Popular topics: #CafeteriaDrama, #LibrarySpotted, etc.
- Quick topic selection for engagement

## Security Features

- Input validation and sanitization
- File type and size restrictions
- CORS configuration
- Error handling without information leakage
- Rate limiting ready (can be added)

## Customization

### Colors & Theme
Edit `frontend/style.css`:
```css
:root {
  --primary-color: #ff2d87;  /* Pink accent */
  --bg-color: #000;          /* Black background */
  --text-color: #fff;        /* White text */
}
```

### Trending Topics
Edit `frontend/index.html`:
```html
<span class="trending-tag">#YourCustomTopic</span>
```

### Badges
Edit `backend/server.js`:
```javascript
const badges = ['Custom1', 'Custom2', 'Custom3'];
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this for your projects!

## Support

If you encounter any issues:

1. Check the [deployment guide](./DEPLOYMENT.md)
2. Review the [backend documentation](./backend/README.md)
3. Test locally first
4. Check browser console for errors
5. Verify backend endpoints are working

## Roadmap

- [ ] Real-time WebSocket updates
- [ ] User voting system
- [ ] Content moderation
- [ ] Advanced search/filtering
- [ ] Mobile app (React Native)
- [ ] Database integration (MongoDB)
- [ ] Admin dashboard
- [ ] Analytics and insights

---

Made with ❤️ and lots of gossip! 🌸

**GOSSIP GIRL** - "Who am I? That's one secret I'll never tell..."
