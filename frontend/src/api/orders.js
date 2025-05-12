// src/api/orders.js
const BASE = 'http://localhost:4000/orders';

/** Fetch all orders for a given userId */
export async function getOrders(userId) {
    const res = await fetch(`${BASE}?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error(`Could not load orders (${res.status})`);
    return res.json(); // array of order docs
}

export async function postOrder({ userId, items, total }) {
    const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, items, total }),
    });
    if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText);
        throw new Error(`Order failed: ${errText}`);
    }
    return res.json();
}
