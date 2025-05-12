// src/api/genres.js
const BASE = 'http://localhost:4000/genres';

export async function getGenres() {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Could not load genres');
    return res.json(); // array of genre objects
}

export async function getGenre(link) {
    const res = await fetch(`${BASE}/${encodeURIComponent(link)}`);
    if (!res.ok) throw new Error('Could not load genre');
    return res.json(); // single genre object
}
