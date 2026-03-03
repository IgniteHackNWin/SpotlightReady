import mongoose from 'mongoose'

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set – running without database (session save/load disabled)')
    return
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB_NAME || 'spotlightready',
      serverSelectionTimeoutMS: 5000,   // fail fast in dev
    })
    console.log('✅ MongoDB connected')
  } catch (err) {
    // Don't crash the server – let it start without DB
    // Routes will return 503 when DB operations fail
    console.error('❌ MongoDB connection failed (server will start without DB):', (err as Error).message)
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected')
  })
}
