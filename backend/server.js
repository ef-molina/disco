// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import usersRouter from './routes/users.js';
import artistsRouter from './routes/artists.js';
import genresRouter from './routes/genres.js';
import albumsRouter from './routes/albums.js';
import ordersRouter from './routes/orders.js';
import path from 'path';

dotenv.config();

async function startServer() {
    const db = await connectDB(); // ← connects to “disco”

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    // attach db to each request
    app.use((req, res, next) => {
        req.db = db;
        next();
    });

    app.use('/assets', express.static(path.join(process.cwd(), 'src', 'assets')));
    app.use('/genres', genresRouter);
    app.use('/users', usersRouter);
    app.use('/artists', artistsRouter);
    app.use('/albums', albumsRouter);
    app.use('/orders', ordersRouter);

    app.listen(process.env.PORT, () => console.log(`🚀 Server on http://localhost:${process.env.PORT}`));
}

startServer().catch((err) => {
    console.error(err);
    process.exit(1);
});
