export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        // On Vercel the filesystem is ephemeral, so data is managed client-side in localStorage.
        return res.status(200).json({});
    }

    if (req.method === 'POST') {
        // Acknowledge the save; actual persistence happens via localStorage on the client.
        return res.status(200).json({ message: 'Project saved successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
