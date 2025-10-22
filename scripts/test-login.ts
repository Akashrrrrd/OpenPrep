// Test script to verify login functionality
import { loginUser, registerUser } from '../lib/auth'

async function testAuth() {
  console.log('🧪 Testing Authentication System...')
  
  try {
    // Test registration first
    console.log('\n1. Testing Registration...')
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123'
    }
    
    const registerResult = await registerUser(testUser)
    if (registerResult) {
      console.log('✅ Registration successful:', registerResult.user.email)
    } else {
      console.log('ℹ️ User might already exist, trying login...')
    }
    
    // Test login
    console.log('\n2. Testing Login...')
    const loginResult = await loginUser({
      email: testUser.email,
      password: testUser.password
    })
    
    if (loginResult) {
      console.log('✅ Login successful:', loginResult.user.email)
      console.log('✅ Token generated:', loginResult.token ? 'Yes' : 'No')
    } else {
      console.log('❌ Login failed')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testAuth()