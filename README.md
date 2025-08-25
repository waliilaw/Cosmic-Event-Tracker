# Cosmic Event Tracker 🚀

A modern web application for tracking Near-Earth Objects (NEOs) and cosmic events using NASA's Open APIs. Built with Next.js, TypeScript, and Tailwind CSS.

**Developed by @KuldipPatel**

## Features

- 🌌 **Real-time NEO Data**: Fetch and display Near-Earth Objects using NASA's API
- 🔐 **Authentication**: Secure user authentication with Supabase (or mock auth for demo)
- 📊 **Data Visualization**: Interactive charts and graphs for comparing NEOs
- 🔍 **Advanced Filtering**: Filter by hazardous status, sort by various criteria
- 📱 **Responsive Design**: Modern UI with ShadCN components and Tailwind CSS
- ⚡ **Performance**: Built with Next.js App Router and TypeScript

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN UI
- **Authentication**: Supabase (with mock fallback)
- **Charts**: Recharts
- **API**: NASA Near Earth Object Web Service (NeoWs)
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### ⚡ Instant Demo (No Setup Required!)

```bash
git clone <repository-url>
cd cosmic-event-tracker
npm install
npm run dev
```

**That's it!** Open [http://localhost:3000](http://localhost:3000) and start exploring NASA's asteroid data immediately.

### 🔧 Optional Production Setup

**For NASA API:** Get your free key at https://api.nasa.gov/ (recommended for production)  
**For Authentication:** Set up free Supabase project at https://supabase.com/ (optional)

See [SETUP.md](SETUP.md) for detailed configuration instructions.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page with NEO listing
│   ├── compare/           # Comparison page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── ui/                # ShadCN UI components
│   ├── Header.tsx         # Main header
│   ├── NEOCard.tsx        # Individual NEO display
│   ├── NEOComparison.tsx  # Comparison charts
│   └── FilterControls.tsx # Filtering interface
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utility libraries
│   └── supabase.ts        # Supabase client
├── services/              # API services
│   └── nasa-api.ts        # NASA API integration
└── types/                 # TypeScript type definitions
    └── neo.ts             # NEO-related types
```

## Key Features Explained

### 1. NEO Data Display
- Fetches data from NASA's Near Earth Object Web Service
- Displays upcoming NEOs for the next 7 days by default
- Shows key information: name, diameter, approach date, velocity, distance
- Highlights potentially hazardous asteroids

### 2. Filtering & Sorting
- Filter by potentially hazardous asteroids only
- Sort by approach date, name, diameter, or distance
- Ascending/descending order options

### 3. Comparison Tool
- Select multiple NEOs using checkboxes
- Compare diameter, distance, and velocity
- Interactive charts using Recharts
- Side-by-side detailed comparison table

### 4. Authentication (Optional)
- **Demo Mode**: Works immediately without any setup
- **Production Mode**: Full Supabase authentication when configured
- **Smart Detection**: Automatically switches between demo and production modes

### 5. Responsive Design
- Mobile-first design approach
- Modern UI with ShadCN components
- Dark/light theme support through Tailwind

## API Usage

The application uses NASA's Near Earth Object Web Service:

- **Endpoint**: `https://api.nasa.gov/neo/rest/v1/feed`
- **Parameters**: `start_date`, `end_date`, `api_key`
- **Rate Limits**: 1,000 requests per hour with API key

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_NASA_API_KEY` | NASA API key from api.nasa.gov | Yes |
| `NEXT_PUBLIC_NASA_BASE_URL` | NASA API base URL | No (defaults to https://api.nasa.gov) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | No (uses mock auth if not provided) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | No (uses mock auth if not provided) |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- NASA for providing the amazing Open APIs
- The Next.js team for the excellent framework
- Supabase for authentication services
- ShadCN for the beautiful UI components

---

**Live Demo**: [Add your Vercel deployment URL here]
**Repository**: [Add your GitHub repository URL here]

