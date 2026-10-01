export interface LTANextBus {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load: 'SEA' | 'SDA' | 'LSD' | string;
  Feature: 'WAB' | string;
  Type: 'SD' | 'DD' | 'BD' | string;
  Monitored?: number;
  minsToArrival?: number;
  isArriving?: boolean;
  loadDescription?: string;
  typeDescription?: string;
}

export interface LTABusService {
  ServiceNo: string;
  Operator: string;
  NextBus: LTANextBus | null;
  NextBus2: LTANextBus | null;
  NextBus3: LTANextBus | null;
}

export interface LTABusArrivalResponse {
  BusStopCode: string;
  Services: LTABusService[];
  source: 'lta_datamall_v3' | 'simulated_fallback';
  notice?: string;
  timestamp: string;
  refreshIntervalSeconds: number;
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  timestamp: string;
  uptimeSeconds: number;
  ltaApiKeyConfigured: boolean;
  environment: string;
  message: string;
}

/**
 * Fetch live bus arrival data from the /api/bus-arrival endpoint
 */
export async function fetchBusArrivals(
  busStopCode: string,
  serviceNo?: string
): Promise<LTABusArrivalResponse> {
  let url = `/api/bus-arrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
  if (serviceNo) {
    url += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch bus arrivals: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check API Health Status
 */
export async function fetchApiHealth(): Promise<HealthCheckResponse> {
  const response = await fetch('/api/health', {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }

  return response.json();
}
