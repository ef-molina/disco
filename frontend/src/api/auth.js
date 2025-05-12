// src/api/auth.js
const BASE = 'http://localhost:4000/users';

/**
 * Register a new user.
 *
 * @param {Object} user - The user object containing username, email, and password.
 * @param {string} user.username - The username of the user.
 * @param {string} user.email - The email of the user.
 * @param {string} user.password - The password of the user.
 * @returns {Promise<Object>} - A promise that resolves to the response from the server.
 * @throws {Error} - Throws an error if the registration fails.
 */
export async function registerUser({ username, email, password }) {
    const res = await fetch(`${BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Registration failed');
    return body; // { userId: ... }
}

/**
 * Login a user.
 *
 * @param {Object} user - The user object containing username and password.
 * @param {string} user.username - The username of the user.
 * @param {string} user.password - The password of the user.
 * @returns {Promise<Object>} - A promise that resolves to the user object.
 * @throws {Error} - Throws an error if the login fails.
 */
export async function loginUser({ username, password }) {
    const res = await fetch(`${BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok || !body.success) {
        throw new Error(body.error || 'Login failed');
    }

    return body.user; // { id, username }
}
