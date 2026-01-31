import mongoose, { Mongoose } from "mongoose"

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  }
}

const cached = global.mongooseConnection || { conn: null, promise: null }

if (!global.mongooseConnection) {
  global.mongooseConnection = cached
}

async function dbConnect(): Promise<Mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local",
    )
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
