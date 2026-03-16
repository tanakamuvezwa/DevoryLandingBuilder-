const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'projects.json');
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(bodyParser.json());

// Prevent browser caching for API routes so dashboard data is always fresh
app.use((req, res, next) => {
    if (req.url.startsWith('/api/')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

// Initialize users file with a default admin
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([
        { id: 1, name: 'Administrator', email: 'admin@devory.com', password: 'admin', role: 'admin', plan: 'Admin' }
    ], null, 2));
}

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

function generatePassword() {
    return Math.random().toString(36).slice(-8);
}

app.post('/api/auth/signup', (req, res) => {
    try {
        const { name, email, plan } = req.body;
        let users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const password = generatePassword();
        const newUser = { id: Date.now(), name, email, password, role: 'user', plan: plan || 'Starter' };
        users.push(newUser);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        res.json({ message: 'User created', user: { name, email, role: 'user', plan }, generatedPassword: password });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        let users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', user: { name: user.name, email: user.email, role: user.role, plan: user.plan } });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/admin/users', (req, res) => {
    try {
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.post('/api/admin/users', (req, res) => {
    try {
        const { name, email, password, role, plan } = req.body;
        let users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const newUser = { id: Date.now(), name, email, password: password || generatePassword(), role: role || 'user', plan: plan || 'Starter' };
        users.push(newUser);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        res.json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

app.put('/api/admin/users/:id', (req, res) => {
    try {
        const id = String(req.params.id);
        const { name, email, password, role, plan } = req.body;
        let users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        const index = users.findIndex(u => String(u.id) === id);
        if (index === -1) return res.status(404).json({ error: 'User not found' });
        
        if (users.find(u => u.email === email && String(u.id) !== id)) {
            return res.status(400).json({ error: 'Email already exists for another account' });
        }
        
        users[index] = { ...users[index], name, email, password, role, plan };
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        res.json(users[index]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

app.delete('/api/admin/users/:id', (req, res) => {
    try {
        const id = String(req.params.id);
        if (id === '1') {
            return res.status(403).json({ error: 'Cannot delete primary admin account' });
        }
        let users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        users = users.filter(u => String(u.id) !== id);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
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
