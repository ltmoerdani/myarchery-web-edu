import { useFetcher } from "hooks/fetcher-alt";
import { ArcherService } from "services";

function useSubmitVerificationCode({ email, code }) {
  const fetcher = useFetcher();

  const submit = (options) => {
    const postFunction = () => {
      const payload = { email, code };
      return ArcherService.verificationRegistration(payload);
    };
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submit };
}

export { useSubmitVerificationCode };
