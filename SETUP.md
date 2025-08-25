# 🚀 Quick Setup Guide - Cosmic Event Tracker

## ⚡ Instant Demo (No Setup Required)

The application works **immediately** out of the box! Just run:

```bash
npm install
npm run dev
```

Visit http://localhost:3000 and start exploring NASA's Near-Earth Objects data right away!

## 🔧 Production Setup (Optional)

### 1. NASA API Key (Recommended for Production)

**Why:** The demo uses `DEMO_KEY` which has rate limits. Get your own free key for better performance.

**Steps:**
1. Go to https://api.nasa.gov/
2. Click "Generate API Key"
3. Fill out the form (takes 30 seconds)
4. Update `.env.local`:
   ```env
   NEXT_PUBLIC_NASA_API_KEY=your_actual_nasa_key_here
   ```

### 2. Supabase Authentication (Optional)

**Why:** Enables real user accounts, data persistence, and user-specific features.

**Steps:**
1. Create free account at https://supabase.com/
2. Create a new project (takes 2-3 minutes to provision)
3. Go to Settings → API in your Supabase dashboard
4. Copy your Project URL and anon key
5. Update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
6. Restart your dev server: `npm run dev`

**Supabase Setup Details:**
- **Email Auth:** Enabled by default
- **Email Confirmations:** You can disable for development in Authentication → Settings
- **Allowed Domains:** Add your production domain when deploying

## 🌟 What Works Without Setup

✅ **NASA NEO Data**: Live asteroid and comet data  
✅ **Interactive Charts**: Compare objects with beautiful visualizations  
✅ **Filtering & Sorting**: Find potentially hazardous asteroids  
✅ **Responsive Design**: Works on mobile, tablet, and desktop  
✅ **Detail Views**: Comprehensive information about each object  

## 🔐 What Requires Supabase Setup

🔒 **User Accounts**: Sign up and sign in functionality  
🔒 **Data Persistence**: Save favorite objects (future feature)  
🔒 **User Preferences**: Custom filters and settings (future feature)  

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/cosmic-event-tracker.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

### Environment Variables for Production

In Vercel dashboard, add these environment variables:

**Required:**
- `NEXT_PUBLIC_NASA_API_KEY` = Your NASA API key (or DEMO_KEY for testing)
- `NEXT_PUBLIC_NASA_BASE_URL` = `https://api.nasa.gov`

**Optional (for authentication):**
- `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key

## 🐛 Troubleshooting

### "Failed to fetch NEO data"
- **Solution:** Check your NASA API key or use `DEMO_KEY`
- **Rate Limits:** DEMO_KEY has 30 requests/hour, personal key has 1000/hour

### Authentication not working
- **Check:** Environment variables are set correctly
- **Check:** Supabase project is active and not paused
- **Note:** App works fine without authentication in demo mode

### Build errors
- **Solution:** Run `npm run build` to check for TypeScript errors
- **Solution:** Ensure all environment variables are properly formatted

## 📊 Features Overview

### Core Features (No Setup Required)
- **Live NASA Data**: Real-time Near-Earth Object information
- **Smart Filtering**: Show only potentially hazardous asteroids
- **Advanced Sorting**: By date, size, distance, or name
- **Comparison Tool**: Select multiple objects and compare with charts
- **Detailed Views**: Comprehensive object information in modals
- **Mobile Responsive**: Works perfectly on all devices

### Enhanced Features (With Supabase)
- **User Authentication**: Secure sign-up and sign-in
- **Personal Dashboard**: User-specific experience
- **Future Features**: Favorites, alerts, custom dashboards

---

**Need Help?** Check the main README.md or create an issue on GitHub.

**Ready to Deploy?** See DEPLOYMENT.md for detailed deployment instructions.
