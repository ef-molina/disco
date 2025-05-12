// routes/albums.js
import { Router } from 'express';
import { ObjectId } from 'mongodb';

const router = Router();

/**
 * GET /albums
 * Returns every album from every artist, flattened into one array.
 * Each album gets an `id` of `${artist._id}-${index}`.
 */
router.get('/', async (req, res) => {
    try {
        const artists = await req.db.collection('artists').find().toArray();
        const albums = [];

        artists.forEach((artist) => {
            (artist.discography || []).forEach((alb, idx) => {
                // build your album object here
                albums.push({
                    id: `${artist._id.toString()}-${idx}`,
                    title: alb.title,
                    artistId: artist._id,
                    artistName: artist.name,
                    release_date: alb.release_date,
                    tracks: alb.tracks,
                    // if you stored img_url on alb:
                    img_url: alb.img_url || alb.img,
                });
            });
        });

        res.json(albums);
    } catch (err) {
        console.error('Error fetching albums:', err);
        res.status(500).json({ error: 'Failed to fetch albums' });
    }
});

/**
 * GET /albums/:id
 * Returns one album by its generated composite ID.
 */
router.get('/:id', async (req, res) => {
    console.log('Fetching album:', req.params.id);
    const [artistId, idxStr] = req.params.id.split('-');
    if (!ObjectId.isValid(artistId) || isNaN(+idxStr)) {
        return res.status(400).json({ error: 'Invalid album ID' });
    }

    try {
        const artist = await req.db.collection('artists').findOne({ _id: new ObjectId(artistId) }, { projection: { discography: 1, name: 1, img_url: 1 } });
        if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
        }

        const idx = parseInt(idxStr, 10);
        const alb = (artist.discography || [])[idx];
        if (!alb) {
            return res.status(404).json({ error: 'Album not found' });
        }

        // return album + artist info
        return res.json({
            id: req.params.id,
            title: alb.title,
            artistId,
            artistName: artist.name,
            release_date: alb.release_date,
            tracks: alb.tracks,
            img_url: alb.img_url || alb.img,
        });
    } catch (err) {
        console.error(`Error fetching album ${req.params.id}:`, err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
