"use strict";

import React, { lazy, Suspense } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

const BusStopMonitor = lazy(() => import("./components/BusStopMonitor"));
const BusStopPicker = lazy(() => import("./components/BusStopPicker"));

function App() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <Router>
        <Route path="(/stop/:stopId)?" component={BusStopPicker} />
        <Route path="/stop/:stopId" component={BusStopMonitor} />
      </Router>
    </Suspense>
  );
}

render(<App />, document.getElementById("root"));
