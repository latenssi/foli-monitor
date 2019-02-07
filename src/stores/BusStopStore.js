"use strict";

import * as api from "../api";
import { distance } from "../utils/position-utils";

let stopCache;

async function getIncomingBuses(stopId) {
  return api.getIncomingBuses(stopId).then(data => data.result);
}

async function getStops() {
  if (stopCache) return stopCache;
  const stops = await api.getStops();
  stopCache = stops;
  return stops;
}

async function getStopByCode(stopCode) {
  const stops = await getStops();
  return stops[stopCode];
}

async function searchStops(query) {
  if (query.length < 2) return [];
  const stops = await getStops();
  return Object.values(stops).filter(
    o =>
      o.stop_code.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
      o.stop_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );
}

async function getStopsNearPosition(position, count = 10) {
  const stops = await getStops();
  const sortedStops = Object.values(stops)
    .map(s => {
      s.distance = distance(s.stop_lat, s.stop_lon, position.lat, position.lon);
      return s;
    })
    .sort((a, b) => a.distance - b.distance);
  return sortedStops.slice(0, count);
}

export default { getStops, getStopsNearPosition, getStopByCode, searchStops, getIncomingBuses };
