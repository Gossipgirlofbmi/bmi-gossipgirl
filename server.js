const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const GOSSIPS_FILE = path.join(__dirname, 'gossips.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Initialize gossips file if it doesn't exist
if (!fs.existsSync(GOSSIPS_FILE)) {
    const initialGossips = [
        {
            id: 1,
            text: "Someone leaving the sports ground with the one person they swore they hated. Interesting.",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            badge: "Spotted",
            image: null
        },
        {
            id: 2,
            text: "Looks like someone's pretending they don't read this page. Nice try.",
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            badge: "Tea",
            image: null
        }
    ];
    fs.writeFileSync(GOSSIPS_FILE, JSON.stringify(initialGossips, null, 2));
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${unique}${ext}`);
    }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.get('/api/gossips', (req, res) => {
    try {
        const gossips = JSON.parse(fs.readFileSync(GOSSIPS_FILE, 'utf8')) || [];
        res.json(gossips.slice().reverse());
    } catch (err) {
        res.status(500).json({ error: 'Failed to load gossips' });
    }
});

app.post('/api/gossips', upload.single('image'), (req, res) => {
    try {
        const text = req.body.text || '';
        const gossips = JSON.parse(fs.readFileSync(GOSSIPS_FILE, 'utf8')) || [];

        const newGossip = {
            id: Date.now(),
            text: text,
            timestamp: new Date().toISOString(),
            badge: 'Spotted',
            image: req.file ? `/uploads/${req.file.filename}` : null
        };

        gossips.push(newGossip);
        fs.writeFileSync(GOSSIPS_FILE, JSON.stringify(gossips, null, 2));
        res.status(201).json(newGossip);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save gossip' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});