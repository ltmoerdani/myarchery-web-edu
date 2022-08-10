import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { useFetcher } from "./fetcher-alt";
import { ArcherService } from "services";

function useUserProfile({ forceFetchOnMount = false } = {}) {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const dispatch = useDispatch();
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!forceFetchOnMount && userProfile) {
      return;
    }
    refresh();
  }, []);

  const refresh = React.useCallback(() => {
    const getFunction = () => ArcherService.profile();
    fetcher.runAsync(getFunction, {
      transform: _transform,
      onSuccess: (data) => {
        dispatch(AuthStore.profile(data));
        fetcher.reset();
      },
    });
  }, []);

  return { userProfile, refresh };
}

function _transform(data) {
  if (!data) {
    return data;
  }
  return {
    ...data,
    avatar: _getAvatarURLWithTimestamp(data),
  };
}

function _getAvatarURLWithTimestamp(profile) {
  if (!profile?.avatar) {
    return profile?.avatar;
  }

  const segments = profile.avatar.split("#");
  const params = "?lastfetched=" + new Date().getTime();

  return segments[0] + params + "#" + segments[1];
}

export { useUserProfile };
