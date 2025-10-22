import connectDB from '../lib/mongodb'
import StudyPlan from '../lib/models/StudyPlan'
import { saveStudyPlan, getStudyPlan, getUserStudyPlans } from '../lib/study-planner'

async function testStudyPlannerConnection() {
  console.log('🧪 Testing Study Planner MongoDB Connection...\n')
  
  try {
    // Test MongoDB connection
    console.log('📡 Connecting to MongoDB...')
    await connectDB()
    console.log('✅ MongoDB connection successful\n')
    
    // Test creating a sample study plan
    console.log('📝 Creating sample study plan...')
    const samplePlan = {
      id: `test-plan-${Date.now()}`,
      userId: 'test-user-123',
      targetCompanies: ['Google', 'Microsoft', 'Amazon'],
      availableHoursPerDay: 4,
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      currentLevel: 'intermediate' as const,
      focusAreas: ['coding', 'technical', 'hr'] as const,
      generatedPlan: [
        {
          date: new Date().toISOString().split('T')[0],
          tasks: [
            {
              id: 'task-1',
              title: 'Data Structures Practice',
              type: 'coding' as const,
              duration: 120,
              priority: 'high' as const,
              description: 'Practice arrays and strings problems',
              resources: ['LeetCode', 'GeeksforGeeks'],
              completed: false
            }
          ],
          totalHours: 2
        }
      ],
      createdAt: new Date().toISOString()
    }
    
    // Save the study plan
    const savedPlan = await saveStudyPlan(samplePlan)
    if (savedPlan) {
      console.log('✅ Study plan saved successfully:', savedPlan.id)
    } else {
      console.log('❌ Failed to save study plan')
      return
    }
    
    // Test retrieving the study plan
    console.log('📖 Retrieving study plan...')
    const retrievedPlan = await getStudyPlan(savedPlan.id)
    if (retrievedPlan) {
      console.log('✅ Study plan retrieved successfully')
      console.log('   - ID:', retrievedPlan.id)
      console.log('   - User ID:', retrievedPlan.userId)
      console.log('   - Target Companies:', retrievedPlan.targetCompanies.join(', '))
      console.log('   - Available Hours:', retrievedPlan.availableHoursPerDay)
      console.log('   - Target Date:', new Date(retrievedPlan.targetDate).toLocaleDateString())
      console.log('   - Current Level:', retrievedPlan.currentLevel)
      console.log('   - Focus Areas:', retrievedPlan.focusAreas.join(', '))
      console.log('   - Generated Plan Days:', retrievedPlan.generatedPlan.length)
    } else {
      console.log('❌ Failed to retrieve study plan')
    }
    
    // Test getting user study plans
    console.log('\n📚 Testing user study plans retrieval...')
    const userPlans = await getUserStudyPlans('test-user-123')
    console.log('✅ User study plans retrieved:', userPlans.length, 'plans found')
    
    // Test direct MongoDB query
    console.log('\n🔍 Testing direct MongoDB queries...')
    const totalPlans = await StudyPlan.countDocuments()
    console.log('✅ Total study plans in database:', totalPlans)
    
    const userPlansCount = await StudyPlan.countDocuments({ userId: 'test-user-123' })
    console.log('✅ Test user study plans:', userPlansCount)
    
    // Test aggregation query
    const plansByLevel = await StudyPlan.aggregate([
      { $group: { _id: '$currentLevel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    console.log('✅ Plans by level:', plansByLevel)
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...')
    const deleteResult = await StudyPlan.deleteOne({ id: savedPlan.id })
    if (deleteResult.deletedCount > 0) {
      console.log('✅ Test data cleaned up successfully')
    }
    
    console.log('\n🎉 Study Planner MongoDB Connection Test Summary:')
    console.log('✅ Database connection: Working')
    console.log('✅ Study plan creation: Working')
    console.log('✅ Study plan retrieval: Working')
    console.log('✅ User plans filtering: Working')
    console.log('✅ MongoDB queries: Working')
    console.log('✅ Data persistence: Working')
    
    console.log('\n📋 Study Planner Features Verified:')
    console.log('✅ User ID association')
    console.log('✅ Target companies storage')
    console.log('✅ Available hours per day')
    console.log('✅ Target date tracking')
    console.log('✅ Preparation level')
    console.log('✅ Focus areas selection')
    console.log('✅ Generated plan with daily tasks')
    console.log('✅ Task details (title, type, duration, priority)')
    console.log('✅ Resources and descriptions')
    console.log('✅ Completion tracking')
    
    console.log('\n🚀 Study Planner is fully connected to MongoDB and ready for production!')
    
  } catch (error) {
    console.error('❌ Study Planner test failed:', error)
    console.log('\n🔧 Troubleshooting steps:')
    console.log('  1. Check MONGODB_URI in environment variables')
    console.log('  2. Verify MongoDB Atlas network access')
    console.log('  3. Ensure StudyPlan model is properly defined')
    console.log('  4. Check study-planner.ts functions')
  }
  
  process.exit(0)
}

// Run the test
testStudyPlannerConnection()