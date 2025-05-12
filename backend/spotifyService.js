const SPOTIFY_BASE = 'https://api.spotify.com/v1';

/**
 * Retrieve the stored Spotify access token.
 */
function getSpotifyToken() {
    return localStorage.getItem('access_token');
}

/**
 * Fetch new releases from Spotify.
 * @param {string} country ISO 3166-1 alpha-2 country code (e.g. 'us')
 * @returns {Promise<Array>} list of album objects
 */
export async function fetchNewReleases(country = 'us') {
    const token = getSpotifyToken();
    const res = await fetch(`${SPOTIFY_BASE}/browse/new-releases?country=${country}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        throw new Error(`Spotify API error: ${res.status}`);
    }
    const { albums } = await res.json();
    return albums.items;
}

/**
 * Generic GET wrapper for Spotify endpoints.
 * @param {string} path API path, e.g. '/albums/{id}'
 * @returns {Promise<any>} parsed JSON
 */
export async function spotifyGet(path) {
    const token = getSpotifyToken();
    const res = await fetch(`${SPOTIFY_BASE}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        throw new Error(`Spotify API error: ${res.status}`);
    }
    return res.json();
}

/**
 * Search for artists by name.
 * @param {string} query Artist name or keywords to search.
 * @param {number} limit Number of artist results to return.
 * @returns {Promise<Array>} List of artist objects.
 */
export async function searchArtists(query, limit = 20) {
    const path = `/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}`;
    const data = await spotifyGet(path);
    return data.artists.items;
}
