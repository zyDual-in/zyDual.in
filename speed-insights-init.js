// Import and initialize Vercel Speed Insights
import { injectSpeedInsights } from './vendor/speed-insights.js';

// Initialize Speed Insights
// Note: In development, this will use the debug script
// In production on Vercel, it will use the optimized script
injectSpeedInsights({
  // Enable debug mode in development
  debug: true
});
