import React from "react";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import { AuthenticationMiddleware, AuthenticationArcherMiddleware } from "./middlewares";
import {
  workingRoutes,
  eventRouters,
  landingpageRouters,
  archerRouters,
  routerDasboardArcher,
} from "./routes";
import { AuthLayout, DashboardEventUmum, LandingPageLayout, LayoutArcher } from "./layouts";

import "./assets/scss/theme.scss";

const App = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          {workingRoutes.map((route, idx) => (
            <AuthenticationArcherMiddleware
              path={route.path}
              layout={AuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              exact
            />
          ))}
          {eventRouters.map((route, idx) => (
            <AuthenticationMiddleware
              path={route.path}
              layout={DashboardEventUmum}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              exact
            />
          ))}
          {landingpageRouters.map((route, idx) => (
            <AuthenticationArcherMiddleware
              path={route.path}
              layout={LandingPageLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              exact
            />
          ))}
          {archerRouters.map((route, idx) => (
            <AuthenticationArcherMiddleware
              path={route.path}
              layout={AuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              exact
            />
          ))}
          {routerDasboardArcher.map((route, idx) => (
            <AuthenticationArcherMiddleware
              path={route.path}
              layout={LayoutArcher}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              exact
            />
          ))}
          <Redirect to="/working/not-found" />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
