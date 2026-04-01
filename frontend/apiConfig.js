import { Platform } from 'react-native';

/**
 * CENTRAL BACKEND CONFIGURATION
 * ----------------------------
 * 1. LOCAL TESTING (Web Browser): Use 'http://localhost:8000'
 * 2. LOCAL TESTING (Physical Phone): Use your machine IP (e.g., 'http://192.168.137.235:8000')
 * 3. PRODUCTION: Use your Railway URL (e.g., 'https://englishessay-production.up.railway.app')
 */

// CHANGE THIS TO YOUR RAILWAY URL FOR PRODUCTION
const PRODUCTION_URL = "https://englishessay-production.up.railway.app";

// YOUR CURRENT LOCAL IP (found via ipconfig)
const LOCAL_IP = "192.168.137.235"; 

// EXPORT PRODUCTION URL FOR DEPLOYMENT (use this for pushing to GitHub/Railway)
export const BACKEND_URL = PRODUCTION_URL;

// Optional: Platform-specific config (use LOCAL_IP for local testing)
/*
export const BACKEND_URL = Platform.select({
  web: "http://localhost:8000",
  default: `http://${LOCAL_IP}:8000`
});
*/
