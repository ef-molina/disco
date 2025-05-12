// src/api/artists.js
// Use relative paths so Vite can proxy to http://localhost:4000
const BASE = 'http://localhost:4000/artists';

/**
 * Fetch all artists, or only those in a given genre
 * @param {string} genreLink optional genre slug
 * @returns {Promise<Array>} array of artist docs
 */
export async function getArtists(genreLink = '') {
    const url = genreLink ? `${BASE}?genre=${encodeURIComponent(genreLink)}` : BASE;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Could not load artists (${res.status})`);
    return res.json();
}

/**
 * Fetch a single artist by MongoDB _id
 * @param {string} id MongoDB ObjectId string
 * @returns {Promise<Object>} artist document
 */
export async function getArtistById(id) {
    const res = await fetch(`${BASE}/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Could not load artist (${res.status})`);
    return res.json();
}
