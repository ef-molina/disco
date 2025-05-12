// src/api/albums.js
const BASE = 'http://localhost:4000/albums';

/** Fetch all albums (flattened across artists) */
export async function getAlbums() {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Could not load albums');
    return res.json(); // array of album objects
}

/** Fetch one album by its generated ID ("<artistId>-<index>") */
export async function getAlbumById(id) {
    const res = await fetch(`${BASE}/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Could not load album');
    return res.json(); // single album object
}
