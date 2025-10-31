// Simple debug script to test authentication
// Run this in browser console after login

console.log('🔍 Debugging Authentication...')

// Check if auth cookie exists
const cookies = document.cookie.split(';').map(c => c.trim())
const authCookie = cookies.find(c => c.startsWith('auth-token='))

console.log('📋 All cookies:', cookies)
console.log('🔑 Auth cookie:', authCookie ? 'Found' : 'Not found')

if (authCookie) {
  console.log('✅ Auth cookie exists')
  
  // Test API call
  fetch('/api/auth/me', { credentials: 'include' })
    .then(response => {
      console.log('🌐 API Response status:', response.status)
      return response.json()
    })
    .then(data => {
      console.log('📊 API Response data:', data)
      if (data.user) {
        console.log('✅ Authentication working!')
        console.log('👤 User:', data.user.name, data.user.email)
      } else {
        console.log('❌ Authentication failed')
      }
    })
    .catch(error => {
      console.log('❌ API Error:', error)
    })
} else {
  console.log('❌ No auth cookie found')
}