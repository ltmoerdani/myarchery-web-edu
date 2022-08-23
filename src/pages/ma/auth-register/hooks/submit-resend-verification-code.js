import { useFetcher } from "hooks/fetcher-alt";
import { ArcherService } from "services";

function useSubmitResendVerificationCode({ email }) {
  const fetcher = useFetcher();

  const submit = (options) => {
    const postFunction = () => {
      const payload = { email };
      return ArcherService.resendVerificationRegistration(payload);
    };
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submit };
}

export { useSubmitResendVerificationCode };
