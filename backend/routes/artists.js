import { Router } from 'express';
import { ObjectId } from 'mongodb';

const router = Router();

/**
 * GET /artists
 * Optional query param: genre (e.g. /artists?genre=jazz)
 * Returns an array of artist documents.
 */
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.genre) filter.genreLink = req.query.genre;
        const artists = await req.db.collection('artists').find(filter).toArray();
        res.json(artists);
    } catch (err) {
        console.error('Error fetching artists list:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * GET /artists/:id
 * Returns a single artist document (including its `discography`) by ObjectId.
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // 1) Validate
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid artist ID' });
    }

    try {
        // 2) Query
        const artist = await req.db.collection('artists').findOne({ _id: new ObjectId(id) });

        if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
        }

        // 3) Send the full document—discography is included
        res.json(artist);
    } catch (err) {
        console.error(`Error fetching artist ${id}:`, err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
