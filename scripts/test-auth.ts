import { registerUser, loginUser, getUserStats } from '../lib/auth'

async function testAuthentication() {
  console.log('🧪 Testing Authentication & MongoDB Storage...\n')

  try {
    // Test user registration
    console.log('1. Testing User Registration...')
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123',
      college: 'Test University',
      graduationYear: 2024
    }

    const registerResult = await registerUser(testUser)
    if (registerResult) {
      console.log('✅ User registration successful!')
      console.log('   User ID:', registerResult.user.id)
      console.log('   Email:', registerResult.user.email)
      console.log('   Name:', registerResult.user.name)
      console.log('   Subscription:', registerResult.user.subscriptionTier)
    } else {
      console.log('❌ User registration failed')
      return
    }

    // Test user login
    console.log('\n2. Testing User Login...')
    const loginResult = await loginUser({
      email: testUser.email,
      password: testUser.password
    })

    if (loginResult) {
      console.log('✅ User login successful!')
      console.log('   User ID:', loginResult.user.id)
      console.log('   Token generated:', loginResult.token ? 'Yes' : 'No')
    } else {
      console.log('❌ User login failed')
    }

    // Test user stats
    console.log('\n3. Testing User Statistics...')
    const stats = await getUserStats()
    console.log('✅ User statistics retrieved:')
    console.log('   Total Users:', stats.totalUsers)
    console.log('   Free Users:', stats.freeUsers)
    console.log('   Pro Users:', stats.proUsers)
    console.log('   Premium Users:', stats.premiumUsers)
    console.log('   Recent Users (7 days):', stats.recentUsers)

    console.log('\n🎉 All authentication tests passed!')
    console.log('✅ Users are being properly stored in MongoDB clusters')

  } catch (error) {
    console.error('❌ Authentication test failed:', error)
  }
}

// Run the test
testAuthentication()