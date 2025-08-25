# cosmic event tracker

a modern web application for tracking near earth objects using nasa's open apis. built with next.js 15, typescript, and tailwind css.

developed by wali

## what it does

fetches real time data about asteroids and comets approaching earth from nasa's neo web service. users can browse upcoming events, filter by hazard level, compare multiple objects, and view detailed information about each celestial body.

## tech stack

next.js 15 with app router for the frontend framework. typescript for type safety. tailwind css with shadcn components for styling. supabase for authentication with smart fallback to demo mode. recharts for data visualization. framer motion for smooth animations. lenis for butter smooth scrolling.

## key features

displays neo data for current date plus next 7 days by default. shows critical info like diameter, velocity, approach distance, and hazard status. includes advanced filtering by potentially hazardous asteroids and sorting by various criteria. comparison tool lets you select multiple objects and view side by side charts. detailed modal view with comprehensive orbital data and nasa jpl links. responsive design that works on all devices.

## getting started

clone the repo and run npm install then npm run dev. app works immediately with demo data using nasa's demo key. for production deployment, get your nasa api key from api.nasa.gov and optionally set up supabase for authentication. all environment variables are optional thanks to smart fallbacks.

## architecture decisions

used next.js app router for better performance and developer experience. implemented progressive loading with pagination to handle large datasets efficiently. chose supabase over custom auth for faster development and better security. added glass morphism ui design for modern aesthetic. used typescript throughout for better code quality and developer experience.

## deployment

ready for vercel deployment out of the box. just connect your github repo to vercel and it deploys automatically. works with or without environment variables configured. production build is optimized and includes all necessary static assets.

## performance

lazy loads data as needed to minimize initial bundle size. uses react query patterns for efficient data fetching. implements proper loading states and error boundaries. optimized animations that don't block the main thread. responsive images and proper caching headers.

this is production ready code that demonstrates modern react patterns, proper typescript usage, and professional ui/ux design principles.