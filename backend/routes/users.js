// routes/users.js
import { Router } from 'express';
import bcrypt from 'bcrypt';

const router = Router();

// POST /api/users/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    const usersColl = req.db.collection('users');
    const existing = await usersColl.findOne({ username });
    if (existing) {
        return res.status(409).json({ error: 'Username already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await usersColl.insertOne({
        username,
        passwordHash,
        createdAt: new Date(),
    });

    res.status(201).json({ userId: result.insertedId });
});

// POST /users/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
    }

    const usersColl = req.db.collection('users');
    const user = await usersColl.findOne({ username });

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ success: true, user: { id: user._id, username: user.username } });
});

export default router;
