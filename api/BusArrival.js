/**
 * LTA BusArrival Endpoint (PascalCase alias for /api/bus-arrival.js)
 * Supports /api/BusArrival?BusStopCode=83139&ServiceNo=15
 */
import busArrivalHandler from './bus-arrival.js';

export default async function handler(req, res) {
  return busArrivalHandler(req, res);
}
