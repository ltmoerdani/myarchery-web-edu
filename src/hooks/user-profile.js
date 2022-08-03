import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { useFetcher } from "./fetcher-alt";
import { ArcherService } from "services";

function useUserProfile() {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const dispatch = useDispatch();
  const fetcher = useFetcher();

  const refresh = React.useCallback(() => {
    const getFunction = () => ArcherService.profile();
    fetcher.runAsync(getFunction, {
      onSuccess: (data) => {
        dispatch(AuthStore.profile(data));
        fetcher.reset();
      },
    });
  }, []);

  return { userProfile, refresh };
}

export { useUserProfile };
