import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aakashrajendran2004_db_user:rFMV7OBWSpxS5BFk@openprep.2jfzhki.mongodb.net/?retryWrites=true&w=majority&appName=OpenPrep'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    }

    console.log('Connecting to MongoDB...')
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Successfully connected to MongoDB')
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    console.error('MongoDB connection error:', e)
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB