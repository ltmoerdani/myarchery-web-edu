import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";

function useUserProfile() {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  return userProfile;
}

export { useUserProfile };
