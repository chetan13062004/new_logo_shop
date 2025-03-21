// import mongoose from 'mongoose'

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const cached = (global as any).mongoose || { conn: null, promise: null }

// export const connectToDatabase = async (
//   MONGODB_URI = process.env.MONGODB_URI
// ) => {
//   if (cached.conn) return cached.conn

//   if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

//   cached.promise = cached.promise || mongoose.connect(MONGODB_URI)


//   cached.conn = await cached.promise

//   return cached.conn
// }

import mongoose from 'mongoose'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI
) => {
  if (cached.conn) return cached.conn

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

  // Log that we're attempting to connect to the database
  console.log('Connecting to database...')

  try {
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI)
    cached.conn = await cached.promise
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Failed to connect to database:', error)
    throw new Error('Database connection failed')
  }

  return cached.conn
}
