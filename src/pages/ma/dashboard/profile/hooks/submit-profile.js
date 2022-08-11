import { useFetcher } from "hooks/fetcher-alt";
import { useUserProfile } from "hooks/user-profile";
import { ArcherService } from "services";

function useSubmitProfile() {
  const { userProfile } = useUserProfile();
  const fetcher = useFetcher();

  const submit = (value, options) => {
    const putFunction = async () => {
      const queryStrings = { user_id: userProfile?.id };
      const payload = _makePayload(userProfile, value);
      return ArcherService.updateProfile(payload, queryStrings);
    };
    const customOptions = {
      ...options,
      onSuccess: () => {
        fetcher.reset();
        options.onSuccess?.();
      },
    };
    fetcher.runAsync(putFunction, customOptions);
  };

  return { ...fetcher, submit };
}

function _makePayload(userProfile, value) {
  const payload = {
    name: userProfile.name || undefined,
    place_of_birth: userProfile.placeOfBirth || undefined,
    date_of_birth: userProfile.dateOfBirth || undefined,
    gender: userProfile.gender || undefined,
    phone_number: userProfile.phoneNumber || undefined,
    ...value,
  };
  return payload;
}

export { useSubmitProfile };
