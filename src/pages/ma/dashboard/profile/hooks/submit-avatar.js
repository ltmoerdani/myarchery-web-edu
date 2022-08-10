import { useFetcher } from "hooks/fetcher-alt";
import { useUserProfile } from "hooks/user-profile";
import { ArcherService } from "services";

function useSubmitAvatar() {
  const { userProfile, refresh } = useUserProfile();
  const fetcher = useFetcher();

  const submit = (imgBase64, options = {}) => {
    const putFunction = () => {
      const payload = { avatar: imgBase64 };
      const qs = { user_id: userProfile?.id };
      return ArcherService.updateAvatar(payload, qs);
    };
    const customOptions = {
      ...options,
      onSuccess: () => {
        refresh();
        options.onSuccess?.();
      },
    };
    fetcher.runAsync(putFunction, customOptions);
  };

  return { ...fetcher, submit };
}

export { useSubmitAvatar };
