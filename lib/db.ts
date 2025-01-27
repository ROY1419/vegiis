import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
    throw new Error(`Check your database connection string `)
}
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { con: null, promise: null }
}

export async function connectToDatabase() {
    if (!cached.promise) {
        console.log("Creating new database connection...");
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then(() => mongoose.connection);
    }
    if (!cached.con) {
        console.log("Reusing existing database connection");
        return cached.con
    }

    try {
        cached.con = await cached.promise;
    } catch (error) {
        cached.promise = null;
    }
    return cached.con
}