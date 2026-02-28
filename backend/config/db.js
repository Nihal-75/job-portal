const mongoose = require('mongoose');

let isConnected; // Track connection status

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = conn.connections[0].readyState;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // In serverless, do not kill the process. Throw an error instead.
    throw new Error('Failed to connect to MongoDB');
  }
};

module.exports = connectDB;
