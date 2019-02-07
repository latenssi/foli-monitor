"use strict";

import { useEffect, useState } from "react";

export default function usePosition() {
  const [position, setPosition] = useState(null);

  let watchID;

  useEffect(() => {
    if ("geolocation" in navigator) {
      if (!watchID) watchID = navigator.geolocation.watchPosition(setPosition);
    } else {
      // eslint-disable-next-line no-console
      console.warn("geolocation is not avaible in browser");
    }
    return () => {
      if (watchID) navigator.geolocation.clearWatch(watchID);
    };
  }, []);

  return position;
}
