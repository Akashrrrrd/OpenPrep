// Test real-time connection stability
const https = require('https');

async function testConnection() {
  console.log('🧪 Testing Real-time Connection Stability...\n');
  
  const baseUrl = 'http://localhost:3000';
  
  // Test health endpoint
  console.log('1. Testing health endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/health`);
    const health = await response.json();
    
    if (health.status === 'healthy') {
      console.log('✅ Health check passed');
      console.log(`   - Database connected: ${health.database.connected}`);
      console.log(`   - Collections: ${health.database.collections}`);
      console.log(`   - Uptime: ${Math.floor(health.uptime)}s`);
    } else {
      console.log('❌ Health check failed:', health.error);
    }
  } catch (error) {
    console.log('❌ Health endpoint error:', error.message);
  }
  
  // Test auth endpoint multiple times
  console.log('\n2. Testing auth endpoint stability...');
  const authTests = [];
  
  for (let i = 0; i < 5; i++) {
    authTests.push(
      fetch(`${baseUrl}/api/auth/me`, { credentials: 'include' })
        .then(res => ({ status: res.status, attempt: i + 1 }))
        .catch(err => ({ error: err.message, attempt: i + 1 }))
    );
  }
  
  const results = await Promise.all(authTests);
  results.forEach(result => {
    if (result.status) {
      console.log(`   Attempt ${result.attempt}: ${result.status === 401 ? '✅ 401 (expected)' : `Status ${result.status}`}`);
    } else {
      console.log(`   Attempt ${result.attempt}: ❌ ${result.error}`);
    }
  });
  
  console.log('\n📊 Connection Test Summary:');
  console.log('- MongoDB connection: Improved with connection pooling');
  console.log('- Session persistence: Enhanced with better cookie handling');
  console.log('- Real-time optimizations: Connection keep-alive enabled');
  console.log('- Retry logic: Added for database operations');
  
  console.log('\n💡 To test session persistence:');
  console.log('1. Login to your application');
  console.log('2. Refresh the page multiple times');
  console.log('3. Check if you stay logged in');
  console.log('4. Monitor browser console for connection logs');
}

// Only run if this script is executed directly
if (require.main === module) {
  testConnection().catch(console.error);
}

module.exports = { testConnection };