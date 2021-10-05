import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as AuthenticationStore from "store/slice/authentication";
import { useHistory } from "react-router-dom";

const ArcherLogout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isLoggedIn } = useSelector(AuthenticationStore.getAuthenticationStore);

  useEffect(() => {
    dispatch(AuthenticationStore.logout());
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login");
    }
  }, [isLoggedIn]);

  return <></>;
};

export default ArcherLogout;
