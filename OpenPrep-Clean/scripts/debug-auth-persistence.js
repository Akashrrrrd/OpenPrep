// Debug script to test authentication persistence
const testAuth = async () => {
  console.log('🔍 Testing authentication persistence...')
  
  try {
    // Test login
    console.log('1. Testing login...')
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
      credentials: 'include'
    })
    
    const loginData = await loginResponse.json()
    console.log('Login response:', loginData)
    console.log('Login cookies:', loginResponse.headers.get('set-cookie'))
    
    // Test auth check
    console.log('2. Testing auth check...')
    const authResponse = await fetch('http://localhost:3000/api/auth/me', {
      credentials: 'include'
    })
    
    const authData = await authResponse.json()
    console.log('Auth check response:', authData)
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testAuth()