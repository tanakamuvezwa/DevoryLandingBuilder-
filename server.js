const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'projects.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

// Endpoint to save project draft
app.post('/api/projects', (req, res) => {
    try {
        const projectData = req.body;
        // In a real app we'd use a database and auth. Here we just store it.
        fs.writeFileSync(DATA_FILE, JSON.stringify(projectData, null, 2));
        res.json({ message: 'Project saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save project' });
    }
});

// Endpoint to load project draft
app.get('/api/projects', (req, res) => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load project' });
    }
});

// Mock endpoint for contact form submissions from the exported landing pages
app.post('/api/contact', (req, res) => {
    console.log('Received contact form submission:', req.body);
    // In a real application, you'd send an email here using nodemailer, sendgrid, etc.
    res.json({ message: 'Contact form submitted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
