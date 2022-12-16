import { useFetcher } from "hooks/fetcher-alt";
import { useUserProfile } from "hooks/user-profile";
import { ArcherService } from "services";

import { filesUtil } from "utils";

const { imageToBase64 } = filesUtil;

function useSubmitVerification(formData) {
  const { userProfile } = useUserProfile();
  const fetcher = useFetcher();

  const submit = (options) => {
    const postFunction = async () => {
      const queryStrings = { user_id: userProfile?.id };
      const payload = await _makePayload(formData, userProfile);
      return ArcherService.updateVerifikasi(payload, queryStrings);
    };
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submit };
}

async function _makePayload(formData, userProfile) {
  const commonPayload = {
    is_wna: formData.isWna,
    name: userProfile?.name || "Dika Sakitkepala", // nama kok wajib, tapi kalau gak dikirim hilang namanya
  };

  if (!formData.isWna) {
    return {
      ...commonPayload,
      province_id: formData.province?.value,
      city_id: formData.city?.value,
      nik: formData.nik,
      ktp_kk: await imageToBase64(formData.imageKTP?.raw),
      address: formData.address,
    };
  }

  return {
    ...commonPayload,
    country_id: formData.wnaCountry?.value,
    city_of_country_id: formData.wnaCity?.value,
    passport_number: formData.wnaPassportNumber,
    passport_img: await imageToBase64(formData.imagePassport?.raw),
    address: formData.wnaAddress,
  };
}

export { useSubmitVerification };
