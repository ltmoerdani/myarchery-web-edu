import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { getAuthenticationStore } from "store/slice/authentication";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import * as AuthenticationStore from "store/slice/authentication";
import { ArcherService } from "services";

const AuthenticationArcherMiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => {
  let { isLoggedIn } = useSelector(getAuthenticationStore);
  // isLoggedIn = true;
  // isAuthProtected = false

  const dispatch = useDispatch();

  useEffect(async () => {
    const { data, success } = await ArcherService.profile();
    if (success) {
      dispatch(AuthenticationStore.profile(data));
    }
  }, []);
  
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthProtected && !isLoggedIn) {
          return (
            <Redirect
              to={{
                pathname: "/archer/login",
                state: { from: props.location },
              }}
            />
          );
        }

        return (
          <Layout>
            <Component {...props} />
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
