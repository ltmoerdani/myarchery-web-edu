import React from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"
import { getArcherStore } from "store/slice/archer"
import { useSelector } from "react-redux"

const AuthenticationArcherMiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => {
  let { isLoggedIn } = useSelector(getArcherStore)
  // isLoggedIn = true;
  // isAuthProtected = false
  
  return (
    <Route
      {...rest}
      render={props => {
        if (isAuthProtected && !isLoggedIn) {
          return (
            <Redirect
              to={{
                pathname: "/archer/login",
                state: { from: props.location },
              }}
            />
          )
        }

        return (
          <Layout>
            <Component {...props} />
          </Layout>
        )
      }}
    />
  )
}

AuthenticationArcherMiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
}

export default AuthenticationArcherMiddleware