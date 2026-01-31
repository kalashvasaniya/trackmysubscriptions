import { MongoClient, MongoClientOptions } from "mongodb"

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

const options: MongoClientOptions = {}

let clientPromise: Promise<MongoClient>

const uri = process.env.MONGODB_URI

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    const client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
} else {
  // Create a promise that will be rejected when accessed without MONGODB_URI
  clientPromise = Promise.reject(
    new Error("Please define the MONGODB_URI environment variable"),
  )
}

export default clientPromise
