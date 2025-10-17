import connectDB from '../lib/mongodb'
import Company from '../lib/models/Company'
import InterviewExperience from '../lib/models/InterviewExperience'
import Question from '../lib/models/Question'

// Import existing JSON data
import companiesData from '../src/data/companies.json'
import experiencesData from '../src/data/interview-experiences.json'
import questionsData from '../src/data/questions.json'

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Connect to MongoDB
    await connectDB()
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await Company.deleteMany({})
    await InterviewExperience.deleteMany({})
    await Question.deleteMany({})
    console.log('✅ Existing data cleared')

    // Seed Companies
    console.log('🏢 Seeding companies...')
    const companies = await Company.insertMany(companiesData)
    console.log(`✅ Seeded ${companies.length} companies`)

    // Seed Interview Experiences
    console.log('💼 Seeding interview experiences...')
    const experiencesWithDates = experiencesData.map(exp => ({
      ...exp,
      date: new Date(exp.date)
    }))
    const experiences = await InterviewExperience.insertMany(experiencesWithDates)
    console.log(`✅ Seeded ${experiences.length} interview experiences`)

    // Seed Questions
    console.log('❓ Seeding forum questions...')
    const questionsWithDates = questionsData.map(q => ({
      ...q,
      createdAt: new Date(q.createdAt),
      updatedAt: new Date(q.updatedAt),
      answers: q.answers.map(a => ({
        ...a,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt)
      }))
    }))
    const questions = await Question.insertMany(questionsWithDates)
    console.log(`✅ Seeded ${questions.length} forum questions`)

    console.log('🎉 Database seeding completed successfully!')
    
    // Display summary
    console.log('\n📊 Seeding Summary:')
    console.log(`   Companies: ${companies.length}`)
    console.log(`   Interview Experiences: ${experiences.length}`)
    console.log(`   Forum Questions: ${questions.length}`)
    console.log(`   Total Documents: ${companies.length + experiences.length + questions.length}`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

// Run the seeding script
if (require.main === module) {
  seedDatabase()
}

export default seedDatabase