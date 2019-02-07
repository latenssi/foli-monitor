"use strict";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import isAfter from "date-fns/isAfter";
import randomColor from "randomcolor";

import BusStopStore from "../stores/BusStopStore";

export default function BusStopMonitor({ match }) {
  const [buses, setBuses] = useState([]);
  const [now, setNow] = useState(new Date());

  let refreshIntervalId;
  let nowIntervalId;

  const stopId = match.params.stopId;

  function getIncomingBuses(id) {
    BusStopStore.getIncomingBuses(id).then(setBuses);
  }

  useEffect(() => {
    getIncomingBuses(stopId);
    refreshIntervalId = setInterval(() => getIncomingBuses(stopId), 60 * 1000);
    nowIntervalId = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(refreshIntervalId);
      clearInterval(nowIntervalId);
    };
  }, [stopId]);

  return (
    <IncomingBusList
      buses={buses.filter(bus => isAfter(bus.expecteddeparturetime * 1000, now))}
      now={now}
    />
  );
}

BusStopMonitor.propTypes = {
  match: PropTypes.object.isRequired
};

function IncomingBusList({ buses = [], now = new Date() }) {
  return (
    <div className="bus-list">
      {buses.map(bus => (
        <IncomingBus
          bus={bus}
          now={now}
          key={`${bus.lineref}-${bus.originref}-${bus.originaimeddeparturetime}`}
        />
      ))}
    </div>
  );
}

IncomingBusList.propTypes = {
  buses: PropTypes.array,
  now: PropTypes.any
};

function IncomingBus({ bus, now = new Date() }) {
  const departureTime = bus.expecteddeparturetime * 1000;

  const lineColor = randomColor({
    seed: bus.lineref + bus.destinationdisplay,
    luminosity: "dark",
    hue: "random"
  });

  return (
    <div className="bus-list-row">
      <span className="bus-list-col bus-number" style={{ color: lineColor }}>
        {bus.lineref}
      </span>
      <span className="bus-list-col bus-departure-time">{format(departureTime, "kk:mm:ss")}</span>
      <span className="bus-list-col bus-departure-time-distance">
        {formatDistanceStrict(departureTime, now, {
          addSuffix: true
        })}
      </span>
      <span className="bus-list-col bus-destination">{bus.destinationdisplay}</span>
    </div>
  );
}

IncomingBus.propTypes = {
  bus: PropTypes.object.isRequired,
  now: PropTypes.any
};
