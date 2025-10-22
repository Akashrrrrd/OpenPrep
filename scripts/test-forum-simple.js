// Simple forum database test using existing connection method
const { MongoClient } = require('mongodb');

async function testForumDB() {
  console.log('🧪 Testing Forum Database Connection...\n');
  
  // You'll need to replace this with your actual MongoDB URI
  // Check your .env.local file for MONGODB_URI
  const uri = process.env.MONGODB_URI || 'your-mongodb-uri-here';
  
  if (uri === 'your-mongodb-uri-here') {
    console.log('⚠️ Please set your MONGODB_URI in .env.local file');
    console.log('💡 The database connection should work if your app is running');
    return;
  }
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const questionsCollection = db.collection('questions');
    
    // Count questions
    const questionCount = await questionsCollection.countDocuments();
    console.log(`📊 Total questions in database: ${questionCount}`);
    
    if (questionCount > 0) {
      const sampleQuestion = await questionsCollection.findOne();
      console.log('\n📝 Sample question:');
      console.log('- Title:', sampleQuestion.title);
      console.log('- Author:', sampleQuestion.author);
      console.log('- Answers:', sampleQuestion.answers?.length || 0);
    }
    
    console.log('\n✅ Forum database is accessible!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await client.close();
  }
}

// Check if MongoDB URI is available
if (process.env.MONGODB_URI) {
  testForumDB();
} else {
  console.log('📋 Database Connection Status:');
  console.log('- MongoDB URI: Not found in environment');
  console.log('- Forum functionality: Should work if app is running');
  console.log('- Answer submission: Will connect to database when needed');
  console.log('\n💡 To test database connection:');
  console.log('1. Make sure your .env.local file has MONGODB_URI');
  console.log('2. Try asking and answering questions in the forum');
  console.log('3. Check if answers persist after page refresh');
}