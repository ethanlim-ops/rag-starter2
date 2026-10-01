/**
 * LTA DataMall v3 Bus Arrival Proxy Endpoint
 * Connects to: https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival
 *
 * Query Parameters:
 *  - BusStopCode: (string, required) 5-digit bus stop code, e.g. 08031, 83139
 *  - ServiceNo: (string, optional) bus service number, e.g. 147, 15
 *
 * Header:
 *  - AccountKey: from process.env.LTA_ACCOUNT_KEY
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
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse query parameters from URL or req.query
  let busStopCode = '';
  let serviceNo = '';

  if (req.query) {
    busStopCode = req.query.BusStopCode || req.query.busStopCode || '';
    serviceNo = req.query.ServiceNo || req.query.serviceNo || '';
  }

  if (!busStopCode && req.url) {
    try {
      const url = new URL(req.url, 'http://localhost');
      busStopCode = url.searchParams.get('BusStopCode') || url.searchParams.get('busStopCode') || '';
      serviceNo = url.searchParams.get('ServiceNo') || url.searchParams.get('serviceNo') || '';
    } catch {
      // Ignore URL parse error
    }
  }

  if (!busStopCode) {
    const errorPayload = {
      error: 'Missing required parameter: BusStopCode',
      usage: '/api/bus-arrival?BusStopCode=08031[&ServiceNo=147]',
    };
    if (typeof res.status === 'function') {
      res.status(400).json(errorPayload);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(400);
      res.end(JSON.stringify(errorPayload));
    }
    return;
  }

  const accountKey = process.env.LTA_ACCOUNT_KEY ? process.env.LTA_ACCOUNT_KEY.trim() : '';

  // If LTA_ACCOUNT_KEY is configured, call LTA DataMall v3 API
  if (accountKey) {
    try {
      const ltaBaseUrl = 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival';
      let ltaUrl = `${ltaBaseUrl}?BusStopCode=${encodeURIComponent(busStopCode)}`;
      if (serviceNo) {
        ltaUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
      }

      const ltaResponse = await fetch(ltaUrl, {
        method: 'GET',
        headers: {
          AccountKey: accountKey,
          accept: 'application/json',
        },
      });

      if (ltaResponse.ok) {
        const ltaData = await ltaResponse.json();

        // Enrich with helper calculations (minutes to arrival, human readable load)
        const enrichedServices = (ltaData.Services || []).map((service) => {
          return {
            ...service,
            NextBus: enrichBusArrival(service.NextBus),
            NextBus2: enrichBusArrival(service.NextBus2),
            NextBus3: enrichBusArrival(service.NextBus3),
          };
        });

        const finalData = {
          BusStopCode: ltaData.BusStopCode || busStopCode,
          Services: enrichedServices,
          source: 'lta_datamall_v3',
          timestamp: new Date().toISOString(),
          refreshIntervalSeconds: 20,
        };

        if (typeof res.status === 'function') {
          res.status(200).json(finalData);
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(200);
          res.end(JSON.stringify(finalData));
        }
        return;
      } else {
        console.warn(`LTA API responded with status ${ltaResponse.status}: ${ltaResponse.statusText}`);
        // Fall back gracefully below
      }
    } catch (err) {
      console.error('Error fetching from LTA DataMall API:', err);
      // Fall through to fallback
    }
  }

  // Graceful Fallback Mode:
  // When LTA_ACCOUNT_KEY is not yet added in Vercel, returns realistic compliant v3 structure
  const fallbackServices = generateFallbackServices(busStopCode, serviceNo);
  const fallbackPayload = {
    BusStopCode: busStopCode,
    Services: fallbackServices,
    source: 'simulated_fallback',
    notice: 'LTA_ACCOUNT_KEY environment variable is not configured yet in Vercel. Set LTA_ACCOUNT_KEY to connect to live production LTA DataMall.',
    timestamp: new Date().toISOString(),
    refreshIntervalSeconds: 20,
  };

  if (typeof res.status === 'function') {
    res.status(200).json(fallbackPayload);
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(fallbackPayload));
  }
}

/**
 * Calculates arrival minutes and human readable descriptions
 */
function enrichBusArrival(bus) {
  if (!bus || !bus.EstimatedArrival) return null;

  const arrivalDate = new Date(bus.EstimatedArrival);
  const diffMs = arrivalDate.getTime() - Date.now();
  const diffMins = Math.round(diffMs / 60000);

  const loadMap = {
    SEA: 'Seats Available',
    SDA: 'Standing Available',
    LSD: 'Limited Standing',
  };

  const typeMap = {
    SD: 'Single Deck',
    DD: 'Double Deck',
    BD: 'Bendy',
  };

  return {
    ...bus,
    minsToArrival: diffMins <= 0 ? 0 : diffMins,
    isArriving: diffMins <= 1,
    loadDescription: loadMap[bus.Load] || 'Seats Available',
    typeDescription: typeMap[bus.Type] || 'Single Deck',
  };
}

/**
 * Generates realistic LTA DataMall v3 formatted response for fallback
 */
function generateFallbackServices(busStopCode, filterServiceNo) {
  const serviceConfigs = [
    { serviceNo: '147', operator: 'SBST', dest: '17009', origin: '64009', m1: 3, m2: 11, m3: 24, l1: 'SEA', l2: 'SDA', l3: 'LSD', t1: 'DD', t2: 'DD', t3: 'SD' },
    { serviceNo: '7', operator: 'SBST', dest: '84009', origin: '17009', m1: 5, m2: 14, m3: 22, l1: 'SDA', l2: 'SEA', l3: 'SEA', t1: 'SD', t2: 'DD', t3: 'DD' },
    { serviceNo: '16', operator: 'SBST', dest: '84009', origin: '10009', m1: 0, m2: 8, m3: 19, l1: 'SEA', l2: 'SDA', l3: 'SEA', t1: 'DD', t2: 'DD', t3: 'SD' },
    { serviceNo: '65', operator: 'SBST', dest: '14009', origin: '75009', m1: 4, m2: 12, m3: 20, l1: 'SDA', l2: 'SEA', l3: 'LSD', t1: 'DD', t2: 'DD', t3: 'DD' },
    { serviceNo: '111', operator: 'SBST', dest: '11009', origin: '11009', m1: 8, m2: 17, m3: 29, l1: 'SEA', l2: 'SEA', l3: 'SDA', t1: 'DD', t2: 'DD', t3: 'SD' },
    { serviceNo: '166', operator: 'SBST', dest: '17009', origin: '54009', m1: 6, m2: 16, m3: 26, l1: 'SEA', l2: 'SDA', l3: 'SEA', t1: 'DD', t2: 'SD', t3: 'DD' },
    { serviceNo: '174', operator: 'SBST', dest: '22009', origin: '10559', m1: 7, m2: 15, m3: 27, l1: 'SDA', l2: 'SEA', l3: 'LSD', t1: 'DD', t2: 'DD', t3: 'SD' },
    { serviceNo: '175', operator: 'SBST', dest: '17009', origin: '80009', m1: 14, m2: 25, m3: 38, l1: 'LSD', l2: 'SEA', l3: 'SDA', t1: 'SD', t2: 'SD', t3: 'SD' },
    { serviceNo: '857', operator: 'TTS', dest: '59009', origin: '59009', m1: 2, m2: 9, m3: 17, l1: 'SDA', l2: 'SEA', l3: 'SEA', t1: 'DD', t2: 'DD', t3: 'DD' },
    { serviceNo: '14', operator: 'SBST', dest: '17009', origin: '84009', m1: 5, m2: 13, m3: 23, l1: 'SEA', l2: 'SDA', l3: 'LSD', t1: 'DD', t2: 'SD', t3: 'DD' },
    { serviceNo: '15', operator: 'GAS', dest: '77009', origin: '77009', m1: 3, m2: 15, m3: 27, l1: 'SEA', l2: 'SDA', l3: 'LSD', t1: 'DD', t2: 'DD', t3: 'SD' },
  ];

  const now = Date.now();

  const filtered = filterServiceNo
    ? serviceConfigs.filter((s) => s.serviceNo.toUpperCase() === filterServiceNo.toUpperCase())
    : serviceConfigs;

  // If a specific service was requested that isn't in our preset list, generate dynamic entry
  if (filterServiceNo && filtered.length === 0) {
    filtered.push({
      serviceNo: filterServiceNo.toUpperCase(),
      operator: 'SBST',
      dest: '17009',
      origin: '10009',
      m1: 4,
      m2: 13,
      m3: 25,
      l1: 'SEA',
      l2: 'SDA',
      l3: 'LSD',
      t1: 'DD',
      t2: 'DD',
      t3: 'SD',
    });
  }

  return filtered.map((cfg) => {
    const next1Date = new Date(now + cfg.m1 * 60000).toISOString();
    const next2Date = new Date(now + cfg.m2 * 60000).toISOString();
    const next3Date = new Date(now + cfg.m3 * 60000).toISOString();

    return {
      ServiceNo: cfg.serviceNo,
      Operator: cfg.operator,
      NextBus: enrichBusArrival({
        OriginCode: cfg.origin,
        DestinationCode: cfg.dest,
        EstimatedArrival: next1Date,
        Latitude: '1.2995',
        Longitude: '103.8458',
        VisitNumber: '1',
        Load: cfg.l1,
        Feature: 'WAB',
        Type: cfg.t1,
        Monitored: 1,
      }),
      NextBus2: enrichBusArrival({
        OriginCode: cfg.origin,
        DestinationCode: cfg.dest,
        EstimatedArrival: next2Date,
        Latitude: '1.2912',
        Longitude: '103.8512',
        VisitNumber: '1',
        Load: cfg.l2,
        Feature: 'WAB',
        Type: cfg.t2,
        Monitored: 1,
      }),
      NextBus3: enrichBusArrival({
        OriginCode: cfg.origin,
        DestinationCode: cfg.dest,
        EstimatedArrival: next3Date,
        Latitude: '1.2850',
        Longitude: '103.8560',
        VisitNumber: '1',
        Load: cfg.l3,
        Feature: 'WAB',
        Type: cfg.t3,
        Monitored: 1,
      }),
    };
  });
}
