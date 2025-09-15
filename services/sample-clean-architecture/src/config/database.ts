import mongoose from 'mongoose';
import { env } from './environment';

// Database connection options
const clientOptions: mongoose.ConnectOptions = {
  serverApi: { version: '1' as const, strict: true, deprecationErrors: true },
};

// Connect to MongoDB
export async function connectDb() {
  try {
    const DATABASE_URL = env.DATABASE_URL;

    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(DATABASE_URL, clientOptions);

    // Check if MongoDB is running
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().command({ ping: 1 });
    }
    console.log('Successfully connected to MongoDB!');
  } catch (error) {
    throw new Error(
      `Error connecting to MongoDB: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Disconnect from MongoDB
export async function disconnectDb() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB!');
  } catch (error) {
    throw new Error(
      `Error disconnecting from MongoDB: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Get connection status
export function getDbConnectionStatus() {
  const readyState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return {
    status: states[readyState] || 'unknown',
    name: mongoose.connection.name,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
  };
}
