# 🔍 Google Search Console Setup Guide

## Step 1: Property Setup
✅ **Choose:** URL prefix
✅ **Enter:** `https://openprep.vercel.app`

## Step 2: Verification (Choose One Method)

### Method 1: HTML File Upload (Recommended)
1. Download the HTML verification file from Google
2. Place it in your `public/` folder
3. Deploy to Vercel
4. Verify in Google Search Console

### Method 2: HTML Tag (Alternative)
Add this meta tag to your `app/layout.tsx` in the head section:
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

### Method 3: Google Analytics (If you have GA)
Link your existing Google Analytics account

## Step 3: After Verification

### Submit Your Sitemap
1. Go to **Sitemaps** in the left menu
2. Add new sitemap: `sitemap.xml`
3. Submit and wait for processing

### Request Indexing for Key Pages
1. Go to **URL Inspection**
2. Test these important URLs:
   - `https://openprep.vercel.app/`
   - `https://openprep.vercel.app/chrome-ai-showcase`
   - `https://openprep.vercel.app/interview`
   - `https://openprep.vercel.app/materials`
   - `https://openprep.vercel.app/forum`

3. Click "Request Indexing" for each

## Step 4: Monitor Performance
- Check **Performance** tab for search analytics
- Monitor **Coverage** for indexing issues
- Review **Core Web Vitals** for user experience
- Set up **Email notifications** for issues

## Expected Timeline
- **24-48 hours**: Verification and initial crawling
- **1-2 weeks**: Most pages indexed
- **2-4 weeks**: Search performance data available
- **1-3 months**: Ranking improvements visible

## Troubleshooting
- If verification fails, ensure the file is accessible
- Check that your site is live and responding
- Verify HTTPS is working properly
- Make sure robots.txt allows crawling