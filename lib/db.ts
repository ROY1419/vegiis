import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if(!MONGODB_URI){
    throw new Error(`Check your database connection string `)
}
let cached = global.mongoose;
if(!cached){
    cached = global.mongoose = { con: null, promise: null }
}

export async function connectToDatabase() {
    if(!cached.con){
        return cached.con
    }
    if(!cached.promise){
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
    }
    try {
        cached.con = await cached.promise;
    } catch (error) {
        cached.promise = null;
    }
    return cached.con
}