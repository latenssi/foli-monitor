"use strict";

import * as api from "../api";

async function getStops() {
  let stops = JSON.parse(localStorage.getItem("foli-stops") || "null");
  if (!stops) {
    stops = await api.getStops();
    localStorage.setItem("foli-stops", JSON.stringify(stops));
  }
  return stops;
}

async function getIncomingBuses(stopId) {
  return api.getIncomingBuses(stopId).then(data => data.result);
}

export default { getStops, getIncomingBuses };
