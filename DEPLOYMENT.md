# 🚀 OpenPrep Deployment Guide

## 📋 **Pre-Deployment Checklist**

### **1. Environment Setup**
- [ ] MongoDB Atlas cluster created and configured
- [ ] Environment variables configured
- [ ] Chrome AI APIs tested locally
- [ ] Database seeded with sample data

### **2. Code Preparation**
- [ ] All features tested locally
- [ ] TypeScript compilation successful
- [ ] No console errors or warnings
- [ ] Responsive design verified

## 🌐 **Vercel Deployment (Recommended)**

### **Step 1: Prepare Repository**
```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### **Step 2: Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### **Step 3: Configure Environment Variables**
In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.example`
3. Set `NODE_ENV=production`

### **Step 4: Seed Production Database**
```bash
# After deployment, seed the database
npm run seed-all
```

## 🗄️ **MongoDB Atlas Setup**

### **1. Create Cluster**
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (M0 free tier is sufficient for demo)
3. Configure network access (allow all IPs: 0.0.0.0/0 for demo)

### **2. Create Database User**
1. Go to Database Access
2. Create new user with read/write permissions
3. Note username and password for connection string

### **3. Get Connection String**
1. Go to Clusters → Connect
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<username>`, `<password>`, and `<dbname>`

## 🔧 **Environment Variables**

### **Required Variables**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/openprep
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
NEXTAUTH_SECRET=your-nextauth-secret-key-minimum-32-characters
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-domain.vercel.app
```

### **Generate Secure Keys**
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate NextAuth secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🧪 **Testing Deployment**

### **1. Basic Functionality**
- [ ] Homepage loads correctly
- [ ] User registration/login works
- [ ] Dashboard displays user data
- [ ] Forum functionality works
- [ ] Study materials load

### **2. Chrome AI Features**
- [ ] AI buttons appear on supported browsers
- [ ] Question generation works (if APIs available)
- [ ] Graceful fallback when AI unavailable
- [ ] No console errors related to AI

### **3. Database Operations**
- [ ] User data persists correctly
- [ ] Forum posts save and display
- [ ] Study materials load from database
- [ ] Interview history tracks properly

## 🐛 **Troubleshooting**

### **Common Issues**

#### **MongoDB Connection Failed**
```bash
# Check connection string format
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Verify network access in MongoDB Atlas
# Ensure IP whitelist includes 0.0.0.0/0 or specific IPs
```

#### **Environment Variables Not Loading**
```bash
# Ensure variables are set in Vercel dashboard
# Check variable names match exactly (case-sensitive)
# Redeploy after adding variables
```

#### **Chrome AI Not Working**
```bash
# Expected behavior - APIs are experimental
# Ensure graceful fallback is working
# Check browser console for specific errors
```

#### **Build Failures**
```bash
# Check TypeScript errors
npm run build

# Fix any type errors or warnings
# Ensure all imports are correct
```

## 📊 **Performance Optimization**

### **1. Database Optimization**
- Index frequently queried fields
- Implement pagination for large datasets
- Use MongoDB aggregation for complex queries

### **2. Frontend Optimization**
- Enable Next.js image optimization
- Implement proper caching headers
- Use dynamic imports for large components

### **3. API Optimization**
- Implement rate limiting
- Add request validation
- Use connection pooling for database

## 🔒 **Security Considerations**

### **1. Environment Security**
- Never commit `.env` files
- Use strong, unique secrets
- Rotate secrets regularly

### **2. Database Security**
- Use MongoDB Atlas security features
- Implement proper user permissions
- Enable audit logging

### **3. Application Security**
- Validate all user inputs
- Implement CSRF protection
- Use HTTPS in production

## 📈 **Monitoring & Analytics**

### **1. Error Tracking**
```bash
# Add error tracking service (optional)
npm install @sentry/nextjs
```

### **2. Performance Monitoring**
- Use Vercel Analytics
- Monitor Core Web Vitals
- Track user engagement

### **3. Database Monitoring**
- Monitor MongoDB Atlas metrics
- Set up alerts for high usage
- Track query performance

## 🚀 **Post-Deployment**

### **1. Seed Database**
```bash
# Run seeding script
npm run seed-all

# Verify data in MongoDB Atlas
```

### **2. Test All Features**
- Complete user registration flow
- Test all major features
- Verify Chrome AI integration
- Check responsive design

### **3. Share & Document**
- Update README with live demo link
- Create demo video
- Document any known issues

## 📝 **Deployment Checklist**

- [ ] Repository pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster configured
- [ ] Database seeded with sample data
- [ ] All features tested in production
- [ ] Chrome AI features verified
- [ ] Demo video created
- [ ] README updated with live links

## 🎯 **Hackathon Submission**

### **Required Links**
- [ ] Live application URL
- [ ] GitHub repository URL
- [ ] Demo video URL (YouTube/Vimeo)
- [ ] Documentation (README.md)

### **Submission Description**
Use the comprehensive description from `CHROME_AI_INTEGRATION.md` highlighting:
- Chrome AI APIs used
- Problem solved
- Technical implementation
- Real user value

---

**Your OpenPrep platform is now ready for the Google Chrome Built-in AI Challenge 2025!** 🏆