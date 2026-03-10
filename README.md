BMI Gossip — Backend and Frontend

Overview
- Simple gossip site with frontend (HTML/CSS/JS) and backend (Node.js + Express).
- Backend stores posts in `gossips.json` and saves uploaded images to `/uploads`.

Run locally
1. Install Node.js (>=14).
2. In project folder run:

```bash
npm install
npm start
```

3. Open `http://localhost:3000` in your browser.

API
- GET /api/gossips — returns list of posts (latest first)
- POST /api/gossips — accepts `multipart/form-data` with fields:
  - `text` (string)
  - `image` (file, optional)

Deployment
- Deploy to a Node-friendly host (Render, Railway, Heroku, Fly). Example (Render):
  - Create a new Web Service, connect to your repo.
  - Build command: `npm install`
  - Start command: `npm start`
  - Make sure the `uploads` folder is persisted or use an external object store (S3) for production.

Notes
- Uploaded images are served from `/uploads/<filename>`.
- For production use, swap file storage for an object store (S3) or a database.
