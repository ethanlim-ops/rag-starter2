/**
 * API Health Check Endpoint
 * Monitors server status and whether LTA_ACCOUNT_KEY environment variable is configured in Vercel.
 */

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    if (typeof res.writeHead === 'function') {
      res.writeHead(200);
    } else if (typeof res.status === 'function') {
      res.status(200);
    }
    res.end();
    return;
  }

  const isLtaKeySet = Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY.trim() !== '');

  const payload = {
    status: 'ok',
    service: 'SBS Transit Live API Service',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    ltaApiKeyConfigured: isLtaKeySet,
    environment: process.env.NODE_ENV || 'production',
    endpoints: {
      busArrival: '/api/bus-arrival?BusStopCode=08031&ServiceNo=147',
      BusArrival: '/api/BusArrival?BusStopCode=83139&ServiceNo=15',
      health: '/api/health',
    },
    message: isLtaKeySet
      ? 'LTA DataMall API Key is configured and ready.'
      : 'API is running in fallback mode. Add LTA_ACCOUNT_KEY to Vercel Environment Variables to fetch live LTA production data.',
  };

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(200).json(payload);
  } else {
    res.setHeader('Content-Type', 'application/json');
    if (typeof res.writeHead === 'function') {
      res.writeHead(200);
    }
    res.end(JSON.stringify(payload, null, 2));
  }
}
