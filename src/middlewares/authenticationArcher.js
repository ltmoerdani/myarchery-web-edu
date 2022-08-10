import * as React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { getAuthenticationStore } from "store/slice/authentication";
import { useSelector } from "react-redux";
import { useUserProfile } from "hooks/user-profile";
import { ErrorBoundary } from "components/ma/error-boundary";

const AuthenticationArcherMiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => {
  useUserProfile({ forceFetchOnMount: true });
  const { isLoggedIn } = useSelector(getAuthenticationStore);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthProtected && !isLoggedIn) {
          if (rest.path === "/") {
            return (
              <Redirect
                to={{
                  pathname: "/home",
                  state: { from: props.location },
                }}
              />
            );
          }

          return <Redirect to={"/archer/login?path=" + props.location.pathname} />;
        }

        return (
          <Layout>
            <ErrorBoundary>
              <Component {...props} />
            </ErrorBoundary>
          </Layout>
        );
      }}
    />
  );
};

AuthenticationArcherMiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default AuthenticationArcherMiddleware;
