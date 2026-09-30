/**
 * Backend base URL. Switches automatically based on where the app is being
 * served from, so the same build works locally and deployed without a
 * separate environment-file setup:
 *  - localhost -> your local tutorflow-mcp REST API
 *  - anywhere else (e.g. the deployed Vercel URL) -> the deployed backend
 *
 * IMPORTANT: replace the URL below with your actual deployed Render URL
 * if it's different from this placeholder.
 */
const DEPLOYED_API_BASE_URL = 'https://tutorflow-mcp.onrender.com/api';
const LOCAL_API_BASE_URL = 'http://localhost:3001/api';

export const API_BASE_URL =
  location.hostname === 'localhost' ? LOCAL_API_BASE_URL : DEPLOYED_API_BASE_URL;
