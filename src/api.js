"use strict";

const BASE_URL = "https://data.foli.fi";

function fetchJSON(url) {
  console.info("Fetching", url); // eslint-disable-line no-console
  return fetch(url).then(res => res.json());
}

export function getIncomingBuses(stopID) {
  return fetchJSON(BASE_URL + "/siri/sm/" + stopID);
}

export function getStops() {
  return fetchJSON(BASE_URL + "/gtfs/stops");
}
