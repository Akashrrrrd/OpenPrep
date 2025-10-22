// Test login API directly
async function testLoginAPI() {
  console.log('🧪 Testing Login API...\n');
  
  const baseUrl = 'http://localhost:3000';
  
  // Test 1: Try login with test credentials
  console.log('1. Testing login endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, data);
    
    if (response.status === 401) {
      console.log('   ✅ Expected 401 for invalid credentials');
    } else if (response.status === 200) {
      console.log('   ✅ Login successful');
    } else {
      console.log('   ❌ Unexpected response');
    }
  } catch (error) {
    console.log('   ❌ Login API error:', error.message);
  }
  
  // Test 2: Check auth/me endpoint
  console.log('\n2. Testing auth/me endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/auth/me`);
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 401) {
      console.log('   ✅ Expected 401 for no auth token');
    } else {
      const data = await response.json();
      console.log(`   Response:`, data);
    }
  } catch (error) {
    console.log('   ❌ Auth/me API error:', error.message);
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Make sure your app is running (npm run dev)');
  console.log('2. Create a test user account');
  console.log('3. Try logging in with real credentials');
  console.log('4. Check browser console for debug messages');
}

testLoginAPI().catch(console.error);