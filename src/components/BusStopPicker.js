"use strict";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Async from "react-select/lib/Async";

import BusStopStore from "../stores/BusStopStore";

export default function BusStopPicker({ history, match }) {
  const [stops, setStops] = useState([]);

  let isMounted = true;

  const { stopId: selectedStopId = null } = match.params;

  useEffect(getStops, [selectedStopId]);

  function getStops() {
    BusStopStore.getStops().then(stops => {
      if (isMounted) setStops(Object.values(stops));
    });
    return () => {
      isMounted = false;
    };
  }

  function handleChange(selectedOption) {
    history.push("/stop/" + selectedOption.stop_code);
  }

  const defaultOptions = stops.slice(0, 10);

  return (
    <Async
      value={stops.find(o => o.stop_code === selectedStopId)}
      onChange={handleChange}
      getOptionLabel={opt => `${opt.stop_code} - ${opt.stop_name}`}
      getOptionValue={opt => opt.stop_code}
      cacheOptions
      defaultOptions={defaultOptions}
      loadOptions={inputValue =>
        Promise.resolve(
          stops.filter(o => {
            return (
              o.stop_code.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 ||
              o.stop_name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
            );
          })
        )
      }
    />
  );
}

BusStopPicker.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};
