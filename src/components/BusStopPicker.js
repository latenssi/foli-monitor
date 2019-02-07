"use strict";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Async from "react-select/lib/Async";

import usePosition from "./usePosition";
import BusStopStore from "../stores/BusStopStore";

export default function BusStopPicker({ history, match }) {
  const [nearbyStops, setNearbyStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [query, setQuery] = useState("");

  const position = usePosition();

  const { stopId: selectedStopId = null } = match.params;

  useEffect(() => {
    BusStopStore.getStopByCode(selectedStopId).then(setSelectedStop);
  }, [selectedStopId]);

  useEffect(() => {
    if (position) {
      BusStopStore.getStopsNearPosition({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }).then(setNearbyStops);
    }
  }, [position]);

  return (
    <Async
      value={selectedStop}
      inputValue={query}
      onChange={value => history.push("/stop/" + value.stop_code)}
      onInputChange={input => setQuery(input)}
      getOptionLabel={opt => `${opt.stop_code} - ${opt.stop_name}`}
      getOptionValue={opt => opt.stop_code}
      defaultOptions={nearbyStops}
      loadOptions={BusStopStore.searchStops}
    />
  );
}

BusStopPicker.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};
