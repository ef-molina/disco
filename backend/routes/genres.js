// routes/genres.js
import { Router } from 'express';

const router = Router();

/**
 * GET /genres
 * Returns all genres.
 */
router.get('/', async (req, res) => {
    try {
        const genres = await req.db.collection('genres').find({}).toArray();
        res.json(genres);
    } catch (err) {
        console.error('Error fetching genres:', err);
        res.status(500).json({ error: 'Failed to load genres' });
    }
});

/**
 * GET /genres/:link
 * Returns a single genre by its “link” field (e.g. “jazz”)
 */
router.get('/:link', async (req, res) => {
    try {
        const genre = await req.db.collection('genres').findOne({ link: req.params.link });
        if (!genre) {
            return res.status(404).json({ error: 'Genre not found' });
        }
        res.json(genre);
    } catch (err) {
        console.error(`Error fetching genre ${req.params.link}:`, err);
        res.status(500).json({ error: 'Failed to load genre' });
    }
});

export default router;
