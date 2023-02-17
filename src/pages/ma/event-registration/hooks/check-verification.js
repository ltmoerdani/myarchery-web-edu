const checkVerification = (data = [], category, eventDetail) => {
  const result = [];
  if (data?.length === 1) {
    const dataVerification = {};
    for (const user of data) {
      //check setiap list user yang akan ter-regristrasi
      const matchGender = category?.data?.filter(
        (value) => value.genderCategory === user.gender
      );
      if (matchGender.length) {
        dataVerification.userEmail = user.email;
        dataVerification.genderIsValid =
          matchGender && matchGender[0]?.genderCategory === user.gender;
        // dikurangi 1 dengan maksud setiap user akan mengambil 1 slot
        dataVerification.quoteIsValid =
          matchGender &&
          Number(matchGender[0]?.quote) -
            Number(matchGender[0]?.totalParticipant) -
            1 !==
            0;
      }
      const categoryByMatchGender = matchGender;
      const [filterEventCatgeories] = eventDetail?.eventCategories.filter(
        (value) => value.categoryDetailsId === categoryByMatchGender[0]?.id
      );
      if (filterEventCatgeories) {
        if (filterEventCatgeories?.ageRules.isAge === 0) {
          const userBirthTime = new Date(user?.date_of_birth).getTime();
          const minDateOfBirth = new Date(
            filterEventCatgeories?.ageRules?.minDateOfBirth
          ).getTime();
          const maxDateOfBirth = new Date(
            filterEventCatgeories?.ageRules?.maxDateOfBirth
          ).getTime();
          if (
            filterEventCatgeories?.ageRules?.maxDateOfBirth !== 0 &&
            filterEventCatgeories?.ageRules?.minDateOfBirth !== 0
          ) {
            dataVerification.ageIsValid =
              userBirthTime <= maxDateOfBirth &&
              userBirthTime >= minDateOfBirth;
          } else if (
            filterEventCatgeories?.ageRules?.maxDateOfBirth === 0 &&
            filterEventCatgeories?.ageRules?.minDateOfBirth !== 0
          ) {
            dataVerification.ageIsValid = userBirthTime >= minDateOfBirth;
          } else if (
            filterEventCatgeories?.ageRules?.maxDateOfBirth !== 0 &&
            filterEventCatgeories?.ageRules?.minDateOfBirth === 0
          ) {
            dataVerification.ageIsValid = userBirthTime <= maxDateOfBirth;
          } else if (
            filterEventCatgeories?.ageRules?.maxDateOfBirth === 0 &&
            filterEventCatgeories?.ageRules?.minDateOfBirth === 0
          ) {
            dataVerification.ageIsValid = true;
          }
        } else {
          const today = new Date();
          const userDateBirth = new Date(user.date_of_birth);
          const age = Math.floor(
            (today - userDateBirth.getTime()) / 3.15576e10
          );
          if (
            filterEventCatgeories?.ageRules?.maxAge === 0 &&
            filterEventCatgeories?.ageRules?.minAge === 0
          ) {
            dataVerification.ageIsValid = true;
          } else if (
            filterEventCatgeories?.ageRules?.maxAge !== 0 &&
            filterEventCatgeories?.ageRules?.minAge === 0
          ) {
            dataVerification.ageIsValid =
              age <= filterEventCatgeories?.ageRules?.maxAge;
          } else if (
            filterEventCatgeories?.ageRules?.maxAge === 0 &&
            filterEventCatgeories?.ageRules?.minAge !== 0
          ) {
            dataVerification.ageIsValid =
              age >= filterEventCatgeories?.ageRules?.minAge;
          } else if (
            filterEventCatgeories?.ageRules?.maxAge !== 0 &&
            filterEventCatgeories?.ageRules?.minAge !== 0
          ) {
            dataVerification.ageIsValid =
              age >= filterEventCatgeories?.ageRules?.minAge &&
              age <= filterEventCatgeories?.ageRules?.maxAge;
          }
        }
      }
      result.push(dataVerification);
    }
    return result;
  } else {
    const verify = data?.map((e) => {
      if (category?.data?.length === 1) {
        const userBirthTime = new Date(e.dateOfBirth).getTime();

        const minDateOfBirth = new Date(
          category?.ageConfig?.minDateOfBirth
        ).getTime();

        const maxDateOfBirth = new Date(
          category?.ageConfig?.maxDateOfBirth
        ).getTime();

        const today = new Date();
        const userDateBirth = new Date(e.dateOfBirth);
        const mixCategory = category?.data[0];
        const age = Math.floor((today - userDateBirth.getTime()) / 3.15576e10);
        const ageIsValid =
          mixCategory?.ageConfig?.isAge === 0
            ? mixCategory?.ageConfig?.maxDateOfBirth !== 0 &&
              mixCategory?.ageConfig?.minDateOfBirth !== 0
              ? userBirthTime <= maxDateOfBirth &&
                userBirthTime >= minDateOfBirth
              : mixCategory?.ageConfig?.maxDateOfBirth === 0 &&
                mixCategory?.ageConfig?.minDateOfBirth !== 0
              ? userBirthTime >= minDateOfBirth
              : mixCategory?.ageConfig?.maxDateOfBirth !== 0 &&
                mixCategory?.ageConfig?.minDateOfBirth === 0
              ? userBirthTime <= maxDateOfBirth
              : true
            : mixCategory?.ageConfig?.maxAge !== 0 &&
              mixCategory?.ageConfig?.minAge === 0
            ? age <= mixCategory?.ageConfig?.maxAge
            : mixCategory?.ageConfig?.maxAge === 0 &&
              mixCategory?.ageConfig?.minAge !== 0
            ? age >= mixCategory?.ageConfig?.minAge
            : mixCategory?.ageConfig?.maxAge !== 0 &&
              mixCategory?.ageConfig?.minAge !== 0
            ? age >= mixCategory?.ageConfig?.minAge &&
              age <= mixCategory?.ageConfig?.maxAge
            : true;
        return {
          userEmail: e.email,
          genderIsValid: mixCategory && mixCategory.genderCategory === "mix",
          quoteIsValid:
            mixCategory &&
            Number(mixCategory[0]?.quote) -
              Number(mixCategory[0]?.totalParticipant) -
              1 !==
              0,
          ageIsValid: ageIsValid,
        };
      }
      const matchGender = category?.data?.filter(
        (value) => value.genderCategory === e.gender
      );

      const [filterEventCatgeories] = eventDetail?.eventCategories.filter(
        (value) => value.categoryDetailsId === matchGender[0]?.id
      );

      const userBirthTime = new Date(e.dateOfBirth).getTime();

      const minDateOfBirth = new Date(
        filterEventCatgeories?.ageRules?.minDateOfBirth
      ).getTime();

      const maxDateOfBirth = new Date(
        filterEventCatgeories?.ageRules?.maxDateOfBirth
      ).getTime();

      const today = new Date();
      const userDateBirth = new Date(e.dateOfBirth);
      const age = Math.floor((today - userDateBirth.getTime()) / 3.15576e10);
      const ageIsValid =
        filterEventCatgeories?.ageRules.isAge === 0
          ? filterEventCatgeories?.ageRules?.maxDateOfBirth !== 0 &&
            filterEventCatgeories?.ageRules?.minDateOfBirth !== 0
            ? userBirthTime <= maxDateOfBirth && userBirthTime >= minDateOfBirth
            : filterEventCatgeories?.ageRules?.maxDateOfBirth === 0 &&
              filterEventCatgeories?.ageRules?.minDateOfBirth !== 0
            ? userBirthTime >= minDateOfBirth
            : filterEventCatgeories?.ageRules?.maxDateOfBirth !== 0 &&
              filterEventCatgeories?.ageRules?.minDateOfBirth === 0
            ? userBirthTime <= maxDateOfBirth
            : true
          : filterEventCatgeories?.ageRules?.maxAge !== 0 &&
            filterEventCatgeories?.ageRules?.minAge === 0
          ? age <= filterEventCatgeories?.ageRules?.maxAge
          : filterEventCatgeories?.ageRules?.maxAge === 0 &&
            filterEventCatgeories?.ageRules?.minAge !== 0
          ? age >= filterEventCatgeories?.ageRules?.minAge
          : filterEventCatgeories?.ageRules?.maxAge !== 0 &&
            filterEventCatgeories?.ageRules?.minAge !== 0
          ? age >= filterEventCatgeories?.ageRules?.minAge &&
            age <= filterEventCatgeories?.ageRules?.maxAge
          : true;
      return {
        userEmail: e.email,
        genderIsValid:
          matchGender && matchGender[0]?.genderCategory === e.gender,
        quoteIsValid:
          matchGender &&
          Number(matchGender[0]?.quote) -
            Number(matchGender[0]?.totalParticipant) -
            1 !==
            0,
        ageIsValid: ageIsValid,
      };
    });
    return verify;
  }
};

export default checkVerification;
