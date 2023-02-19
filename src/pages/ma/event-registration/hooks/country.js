import React from "react";

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

const useCountry = (
  countryInput,
  selectCountry,
  provinceInput,
  selectProvince,
  cityInput
) => {
  const [countryList, setCountryList] = React.useState([]);
  const [provinceList, setProvinceList] = React.useState([]);
  const [cityList, setCityyList] = React.useState([]);
  const fetchCountry = async (keyword) => {
    const result = await ArcherService.getListCountry({
      limit: 200,
      name: keyword ?? "",
      page: 1,
    });
    const newCountry = result?.data?.map((country) => {
      return { ...country, value: country?.name, label: country?.name };
    });
    setCountryList(newCountry);
  };
  const fetchProvince = async (country, keyword) => {
    if (country?.name === "Indonesia" || country?.id === 102) {
      const provinces = await ArcherService.getListProvinceIndonesian({
        limit: 200,
      });
      const newProvince = provinces?.data?.map((province) => {
        return { ...province, value: province?.name, label: province?.name };
      });
      setProvinceList(newProvince);
    } else {
      const provinces = await ArcherService.getListProvince({
        limit: 500,
        page: 1,
        name: keyword ?? "",
        country_id: country?.id ?? null,
      });
      const newProvince = provinces?.data?.map((province) => {
        return { ...province, value: province?.name, label: province?.name };
      });
      setProvinceList(newProvince);
    }
  };
  const fetchCity = async (country, province) => {
    if (country?.name === "Indonesia" || country?.id === 102) {
      const cities = await ArcherService.getListCityIndonesian({
        limit: 200,
        province_id: province?.id,
      });
      const newCity = cities?.data?.map((city) => {
        return { ...city, value: city?.name, label: city?.name };
      });
      setCityyList(newCity);
    } else {
      const cities = await ArcherService.getListCity({
        limit: 500,
        page: 1,
        country_id: country?.id ?? null,
        province_id: province?.id ?? null,
      });
      const newCity = cities?.data?.map((city) => {
        return { ...city, value: city?.name, label: city?.name };
      });
      setCityyList(newCity);
    }
  };

  React.useEffect(() => {
    fetchCountry(countryInput);
    if (selectCountry) {
      fetchProvince(selectCountry, provinceInput);
    }
    if (selectProvince) {
      fetchCity(selectCountry, selectProvince, cityInput);
    }
  }, [countryInput, selectCountry, selectProvince, provinceInput]);
  return [countryList, provinceList, cityList];
};

export { listAllCountry, listAllProvince, listAllCity, useCountry };
