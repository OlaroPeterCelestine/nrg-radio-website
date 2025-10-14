// Client-side API configuration - uses direct Railway API
export const CLIENT_API_CONFIG = {
  BASE_URL: 'https://nrgug-api-production.up.railway.app/api', // Direct API call
  TIMEOUT: 30000, // Increased to 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Helper function to get the full API URL for client-side requests
export function getClientApiUrl(endpoint: string): string {
  const baseUrl = CLIENT_API_CONFIG.BASE_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}

// Client-side fetch wrapper with timeout
export async function clientFetch(endpoint: string, options: RequestInit = {}) {
  const url = getClientApiUrl(endpoint);
  
  // Add aggressive cache-busting parameter to force fresh data
  const cacheBuster = `?t=${Date.now()}&v=${Math.random().toString(36).substr(2, 9)}`;
  const finalUrl = url + cacheBuster;
  
  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLIENT_API_CONFIG.TIMEOUT);
  
  try {
    const response = await fetch(finalUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        ...CLIENT_API_CONFIG.HEADERS,
        ...options.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`API request timed out after ${CLIENT_API_CONFIG.TIMEOUT}ms`);
    }
    
    throw error;
  }
}
