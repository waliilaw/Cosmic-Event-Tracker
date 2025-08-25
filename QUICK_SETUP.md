# 🚀 Quick Setup Guide - Remove Demo Mode

## Why is "Demo Mode Active" showing?

The app is showing **Demo Mode Active** because it can't find your Supabase credentials in the environment variables.

## 📝 Quick Fix (2 minutes):

### 1. Create `.env.local` file in your project root:

```bash
# In your terminal, from the project root:
touch .env.local
```

### 2. Add your credentials to `.env.local`:

```env
# NASA API (Optional - DEMO_KEY works fine)
NEXT_PUBLIC_NASA_API_KEY=DEMO_KEY

# Supabase Credentials (Required to remove Demo Mode)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Get your Supabase credentials:

1. Go to [supabase.com](https://supabase.com)
2. Sign in and go to your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Restart your dev server:

```bash
# Stop the current server (Ctrl+C) then:
npm run dev
```

## ✅ That's it!

- **Demo Mode banner** will disappear
- **Authentication** will work properly
- **Success messages** will show after account creation
- **Email verification** prompts will appear

## 🎯 Expected Behavior After Setup:

1. **Sign Up**: Shows "Account created! Check your email to verify..."
2. **Sign In**: Shows "Welcome back! Redirecting..."
3. **No Demo Mode**: Banner disappears completely
4. **Full Features**: All authentication features work

---

**Need help?** The app works perfectly in demo mode for testing, but you'll need Supabase for full authentication features.
