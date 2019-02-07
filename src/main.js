"use strict";

import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const BusStopMonitor = React.lazy(() => import("./components/BusStopMonitor"));
const BusStopPicker = React.lazy(() => import("./components/BusStopPicker"));

function asFunction(Component) {
  // eslint-disable-next-line react/display-name
  return props => <Component {...props} />;
}

function Loading() {
  return <div className="loading">Loading...</div>;
}

function App() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Router>
        <>
          <Switch>
            <Route path="/stop/:stopId" component={asFunction(BusStopPicker)} />
            <Route component={asFunction(BusStopPicker)} />
          </Switch>
          <Route path="/stop/:stopId" component={asFunction(BusStopMonitor)} />
        </>
      </Router>
    </React.Suspense>
  );
}

render(<App />, document.getElementById("root"));
