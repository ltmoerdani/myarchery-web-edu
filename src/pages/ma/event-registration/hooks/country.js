const { ArcherService } = require("services");

const listAllProvince = async (countryUser, keywordProvince) => {
  if (countryUser?.name === "Indonesia") {
    const data = [];
    try {
      let newObj = {};
      // const country = await ArcherService.getListCountry({ limit: 2000, name: 'indonesia' });
      const result = await ArcherService.getListProvinceIndonesian({
        limit: 1000,
      });
      for (const province of result?.data) {
        newObj = province;
        newObj.label = province.name;
        newObj.value = province.name;
        data.push(newObj);
      }
      return data;
    } catch (error) {
      return error?.message;
    }
  } else {
    const data = [];
    try {
      let newObj = {};
      if (!keywordProvince) {
        keywordProvince = "";
      }
      const qs = { limit: 200, page: 1 };
      if (keywordProvince) {
        qs.name = keywordProvince;
      }
      if (countryUser) {
        qs.country_id = countryUser?.id;
      }
      const result = await ArcherService.getListProvince(qs);
      const filterData = result?.data?.filter(
        (e) => countryUser?.id === e.countryId
      );
      if (filterData.length) {
        for (const province of filterData) {
          newObj = province;
          newObj.label = province.name;
          newObj.value = province.name;
          data.push(newObj);
        }
      }
      return data;
    } catch (error) {
      return error?.message;
    }
  }
};

const listAllCity = async (countryUser, provinceUser) => {
  if (countryUser?.name === "Indonesia") {
    const data = [];
    try {
      let newObj = {};
      const result = await ArcherService.getListCityIndonesian({
        limit: 200,
        province_id: provinceUser?.id,
      });
      for (const country of result?.data) {
        newObj = country;
        newObj.label = country.name;
        newObj.value = country.name;
        data.push(newObj);
      }
      return data;
    } catch (error) {
      return error?.message;
    }
  } else {
    const data = [];
    try {
      let newObj = {};
      const qs = { limit: 200, page: 1 };
      if (countryUser) {
        qs.country_id = countryUser?.id;
      }
      if (provinceUser) {
        qs.province_id = provinceUser?.id;
      }

      const result = await ArcherService.getListCity(qs);
      // const filterData = result?.data?.filter((e) =>
      //   e.name.toLowerCase().includes(keywordCity.toLowerCase())
      // );
      for (const country of result?.data) {
        newObj = country;
        newObj.label = country.name;
        newObj.value = country.name;
        data.push(newObj);
      }
      return data;
    } catch (error) {
      return error?.message;
    }
  }
};
const listAllCountry = async () => {
  const data = [];
  try {
    let newObj = {};
    const result = await ArcherService.getListCountry({ limit: 2000 });
    for (const country of result?.data) {
      newObj = country;
      newObj.label = country.name;
      newObj.value = country.name;
      data.push(newObj);
    }
    return data;
  } catch (error) {
    return error?.message;
  }
};

export { listAllCountry, listAllProvince, listAllCity };
