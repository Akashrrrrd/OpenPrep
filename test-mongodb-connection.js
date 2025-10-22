const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://aakashrajendran2004_db_user:rFMV7OBWSpxS5BFk@openprep.2jfzhki.mongodb.net/?retryWrites=true&w=majority&appName=OpenPrep';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Check if your IP address is whitelisted in MongoDB Atlas');
      console.log('2. Verify your cluster is running (not paused)');
      console.log('3. Check your internet connection');
    }
  } finally {
    await mongoose.disconnect();
    console.log('Connection test completed.');
  }
}

testConnection();