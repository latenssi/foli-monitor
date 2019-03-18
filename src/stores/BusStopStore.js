"use strict";

import * as api from "../api";
import { distance } from "../utils/position-utils";

let getStopsPromise;

async function getIncomingBuses(stopId) {
  return api.getIncomingBuses(stopId).then(data => data.result);
}

function getStops() {
  getStopsPromise = getStopsPromise || api.getStops();
  return getStopsPromise;
}

async function getStopByCode(stopCode) {
  const stops = await getStops();
  return stops[stopCode];
}

async function searchStops(query) {
  if (query.length < 2) return [];
  query = query.toLowerCase();
  const stops = await getStops();
  return Object.values(stops).filter(
    o =>
      o.stop_code.toLowerCase().indexOf(query) !== -1 ||
      o.stop_name.toLowerCase().indexOf(query) !== -1
  );
}

async function getStopsNearPosition(position, count = 10) {
  const stops = await getStops();
  const sortedStops = Object.values(stops)
    .map(s =>
      Object.assign(s, { distance: distance(s.stop_lat, s.stop_lon, position.lat, position.lon) })
    )
    .sort((a, b) => a.distance - b.distance);
  return sortedStops.slice(0, count);
}

export default { getStops, getStopsNearPosition, getStopByCode, searchStops, getIncomingBuses };
