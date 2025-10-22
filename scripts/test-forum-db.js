const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test forum database functionality
async function testForumDB() {
  console.log('🧪 Testing Forum Database...\n');
  
  try {
    await connectDB();
    
    // Get questions collection
    const questionsCollection = mongoose.connection.db.collection('questions');
    
    // Count questions
    const questionCount = await questionsCollection.countDocuments();
    console.log(`📊 Total questions in database: ${questionCount}`);
    
    if (questionCount > 0) {
      // Get a sample question
      const sampleQuestion = await questionsCollection.findOne();
      console.log('\n📝 Sample question structure:');
      console.log('- ID:', sampleQuestion.id);
      console.log('- Title:', sampleQuestion.title);
      console.log('- Author:', sampleQuestion.author);
      console.log('- Tags:', sampleQuestion.tags);
      console.log('- Answers count:', sampleQuestion.answers?.length || 0);
      console.log('- Has accepted answer:', sampleQuestion.hasAcceptedAnswer);
    } else {
      console.log('\n⚠️ No questions found in database');
      console.log('💡 You may need to seed the forum with sample data');
    }
    
    // Test if we can create a question
    console.log('\n🔧 Testing question creation...');
    const testQuestion = {
      id: `test-${Date.now()}`,
      title: 'Test Question - Database Connection',
      content: 'This is a test question to verify database connectivity.',
      author: 'System Test',
      authorReputation: 0,
      tags: ['test', 'database'],
      difficulty: 'easy',
      answers: [],
      hasAcceptedAnswer: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await questionsCollection.insertOne(testQuestion);
    console.log('✅ Test question created with ID:', result.insertedId);
    
    // Clean up test question
    await questionsCollection.deleteOne({ _id: result.insertedId });
    console.log('🧹 Test question cleaned up');
    
    console.log('\n✅ Forum database is working correctly!');
    
  } catch (error) {
    console.error('❌ Forum database test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

testForumDB();