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
  }
};

export default checkVerification;
