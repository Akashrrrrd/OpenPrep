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
declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  // Check if connection is still alive
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn
  }

  // Reset cached connection if it's not connected
  if (cached.conn && mongoose.connection.readyState !== 1) {
    cached.conn = null
    cached.promise = null
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 20, // Increased pool size for better concurrency
      minPoolSize: 5, // Maintain minimum connections
      serverSelectionTimeoutMS: 30000, // Increased timeout
      socketTimeoutMS: 0, // No timeout for socket operations
      connectTimeoutMS: 30000, // Increased connection timeout
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      maxIdleTimeMS: 300000, // 5 minutes - keep connections alive longer
      heartbeatFrequencyMS: 10000, // Check connection health every 10 seconds
      autoIndex: false, // Don't build indexes in production
      autoCreate: false, // Don't create collections automatically
    }

    console.log('🔌 Connecting to MongoDB...')
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ Successfully connected to MongoDB')
        
        // Set up connection event listeners for better monitoring
        mongoose.connection.on('connected', () => {
          console.log('📡 MongoDB connection established')
        })
        
        mongoose.connection.on('error', (err) => {
          console.error('❌ MongoDB connection error:', err)
        })
        
        mongoose.connection.on('disconnected', () => {
          console.log('🔌 MongoDB disconnected')
          // Reset cache when disconnected
          cached.conn = null
          cached.promise = null
        })
        
        mongoose.connection.on('reconnected', () => {
          console.log('🔄 MongoDB reconnected')
        })
        
        return mongoose
      })
      .catch((error) => {
        console.error('❌ MongoDB connection failed:', error)
        cached.promise = null
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    console.error('❌ MongoDB connection error:', e)
    cached.promise = null
    
    // If connection fails, try to reconnect after a delay
    setTimeout(() => {
      cached.promise = null
    }, 5000)
    
    throw e
  }

  return cached.conn
}

export { connectDB }
export default connectDB