export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        console.log('Contact form submission received:', req.body);
        // In production you'd send an email here via SendGrid, Resend, etc.
        return res.status(200).json({ message: 'Contact form submitted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
