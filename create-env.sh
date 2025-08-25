#!/bin/bash

echo "🚀 Creating .env.local file to remove Demo Mode..."
echo ""

# Create .env.local file
cat > .env.local << 'EOF'
# ====================================================================================
# COSMIC EVENT TRACKER - ENVIRONMENT CONFIGURATION
# ====================================================================================

# NASA API Configuration
NEXT_PUBLIC_NASA_API_KEY=DEMO_KEY

# Supabase Configuration (REPLACE WITH YOUR ACTUAL VALUES)
# Get these from: https://supabase.com → Your Project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# ====================================================================================
# INSTRUCTIONS:
# 1. Go to https://supabase.com and sign in
# 2. Create a new project (or select existing)
# 3. Go to Settings → API
# 4. Replace the values above with your actual:
#    - Project URL
#    - anon/public key
# 5. Save this file and restart: npm run dev
# ====================================================================================
EOF

echo "✅ Created .env.local file!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.local with your Supabase credentials"
echo "2. Get them from: https://supabase.com → Settings → API"
echo "3. Restart dev server: npm run dev"
echo ""
echo "🎯 This will remove the 'Demo Mode Active' banner!"
