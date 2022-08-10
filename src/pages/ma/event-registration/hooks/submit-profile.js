import { useFetcher } from "hooks/fetcher-alt";
import { useUserProfile } from "hooks/user-profile";
import { ArcherService } from "services";

function useSubmitProfile() {
  const { userProfile, refresh } = useUserProfile();
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
        refresh();
        options.onSuccess?.();
      },
    };
    fetcher.runAsync(putFunction, customOptions);
  };

  return { ...fetcher, submit };
}

function _makePayload(userProfile, value) {
  const payload = {
    name: userProfile.name,
    place_of_birth: userProfile.placeOfBirth,
    date_of_birth: userProfile.dateOfBirth,
    gender: userProfile.gender,
    phone_number: userProfile.phoneNumber,
    ...value,
  };
  return payload;
}

export { useSubmitProfile };
