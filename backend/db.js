// db.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config(); // ← loads .env into process.env

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;

if (!uri || !dbName) {
    throw new Error('Missing MONGO_URI or MONGO_DB in .env');
}

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db;

export async function connectDB() {
    await client.connect();
    db = client.db(dbName); // ← use your “disco” DB here
    console.log(`✅ MongoDB connected to database “${dbName}”`);
    return db;
}

export function getDb() {
    if (!db) throw new Error('Database not initialized! Call connectDB first.');
    return db;
}
