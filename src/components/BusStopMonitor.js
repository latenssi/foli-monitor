"use strict";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import isAfter from "date-fns/isAfter";
import Please from "pleasejs";

import BusStopStore from "../stores/BusStopStore";

export default function BusStopMonitor({ match }) {
  const [buses, setBuses] = useState([]);
  const [now, setNow] = useState(new Date());

  let isMounted = true;
  let refreshIntervalId;
  let nowIntervalId;

  const stopId = match.params.stopId;

  function getIncomingBuses(id) {
    BusStopStore.getIncomingBuses(id)
      .then(buses => {
        if (isMounted) setBuses(buses);
      })
      .catch(e => {
        console.error(e); // eslint-disable-line no-console
        if (isMounted) setBuses([]);
      });
  }

  useEffect(() => {
    getIncomingBuses(stopId);
    refreshIntervalId = setInterval(() => getIncomingBuses(stopId), 60 * 1000);
    nowIntervalId = setInterval(() => setNow(new Date()), 1000);
    return () => {
      isMounted = false;
      clearInterval(refreshIntervalId);
      clearInterval(nowIntervalId);
    };
  }, [stopId]);

  return (
    <IncomingBusList
      buses={buses.filter(bus => isAfter(bus.expectedarrivaltime * 1000, now))}
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
  function makeColor(seed) {
    return Please.make_color({
      seed,
      saturation: 1,
      value: 0.7
    });
  }

  return (
    <div className="bus-list-row">
      <span
        className="bus-list-col bus-number"
        style={{ color: makeColor(bus.lineref + bus.destinationref + bus.originref) }}>
        {bus.lineref}
      </span>
      <span className="bus-list-col bus-arrival-time">
        {format(bus.expectedarrivaltime * 1000, "kk:mm:ss")}
      </span>
      <span className="bus-list-col bus-arrival-time-relative">
        {formatDistanceStrict(bus.expectedarrivaltime * 1000, now, {
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
