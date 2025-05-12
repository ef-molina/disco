// routes/orders.js
import { Router } from 'express';
import { ObjectId } from 'mongodb';

const router = Router();

/**
 * POST /orders
 * Body: { userId: string, items: Array, total: number }
 * Inserts a new order document.
 */
router.post('/', async (req, res) => {
    const { userId, items, total } = req.body;
    if (!userId || !Array.isArray(items) || typeof total !== 'number') {
        return res.status(400).json({ error: 'Missing or invalid order data' });
    }

    try {
        const order = {
            userId: new ObjectId(userId),
            items: items.map((it) => ({
                albumId: it.id,
                title: it.title,
                artistName: it.artistName,
                price: parseFloat(it.price),
                quantity: 1,
            })),
            total,
            status: 'pending',
            createdAt: new Date(),
        };

        const { insertedId } = await req.db.collection('orders').insertOne(order);

        res.status(201).json({ orderId: insertedId });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * GET /orders
 * Query: ?userId=<ObjectId>
 * Returns all orders for that user, most recent first.
 */
router.get('/', async (req, res) => {
    const { userId } = req.query;
    const filter = {};

    if (userId && ObjectId.isValid(userId)) {
        filter.userId = new ObjectId(userId);
    } else {
        return res.status(400).json({ error: 'Missing or invalid userId' });
    }

    try {
        const orders = await req.db.collection('orders').find(filter).sort({ createdAt: -1 }).toArray();

        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
