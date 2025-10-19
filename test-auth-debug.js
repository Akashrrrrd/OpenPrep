// Quick test to debug authentication
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production-openprep-2024'

// Test token generation and verification
const testUser = {
  id: 'user-1760806753945-vl5svwbdf',
  email: 'aakashrajendran2004@gmail.com',
  subscriptionTier: 'free'
}

console.log('Testing JWT with user:', testUser)

// Generate token
const token = jwt.sign(testUser, JWT_SECRET, { expiresIn: '7d' })
console.log('Generated token:', token.substring(0, 50) + '...')

// Verify token
try {
  const decoded = jwt.verify(token, JWT_SECRET)
  console.log('Token verified successfully:', decoded)
} catch (error) {
  console.error('Token verification failed:', error)
}