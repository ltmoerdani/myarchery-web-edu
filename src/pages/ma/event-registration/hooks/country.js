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
  const fetchProvince = (country = [], keyword) => {
    const provinceData = [];
    country?.map((value) => {
      if (value.name === "Indonesia" || value.id === 102) {
        ArcherService.getListProvinceIndonesian({
          limit: 200,
        }).then((res) => {
          const { data } = res;
          const newProvince = data?.map((province) => {
            return {
              ...province,
              value: province?.name,
              label: province?.name,
            };
          });
          const provinceAddToList = provinceList?.filter(
            (e) => e.idUser === value.idUser
          );
          if (!provinceAddToList?.length) {
            provinceData.push(...provinceList, {
              idUser: value.idUser,
              provinceList: newProvince,
            });

            setProvinceList(provinceData);
          }
        });
      } else {
        ArcherService.getListProvince({
          limit: 500,
          page: 1,
          name: keyword ?? "",
          country_id: value?.id ?? null,
        }).then((res) => {
          const { data } = res;
          const newProvince = data?.map((province) => {
            return {
              ...province,
              value: province?.name,
              label: province?.name,
            };
          });
          const provinceAddToList = provinceList?.filter(
            (e) => e.idUser === value.idUser
          );
          if (!provinceAddToList?.length) {
            provinceData.push(...provinceList, {
              idUser: value.idUser,
              provinceList: newProvince,
            });
            setProvinceList(provinceData);
          } else {
            const dataChangeProvince = provinceList?.map((el) => {
              if (el.idUser?.toString() === value?.idUser?.toString()) {
                return { idUser: el.idUser, provinceList: newProvince };
              } else {
                return { ...el };
              }
            });
            setProvinceList(dataChangeProvince);
          }
        });
      }
    });
  };
  const fetchCity = async (country, province) => {
    const cityData = [];
    province?.map((value, index) => {
      if (country[index]?.name === "Indonesia" || country[index]?.id === 102) {
        ArcherService.getListCityIndonesian({
          limit: 200,
          province_id: value?.id,
        }).then((res) => {
          const { data } = res;
          const newCities = data?.map((city) => {
            return {
              ...city,
              value: city?.name,
              label: city?.name,
            };
          });
          const cityAddToList = cityList?.filter(
            (e) => e.idUser === value?.idUser
          );
          if (!cityAddToList?.length) {
            cityData.push(...cityList, {
              idUser: value.idUser,
              cityList: newCities,
            });
            setCityyList(cityData);
          } else {
            const dataChangeCity = cityList?.map((el) => {
              if (
                el.idUser?.toString() === cityAddToList[0]?.idUser?.toString()
              ) {
                return {
                  idUser: el.idUser,
                  cityList: data?.map((city) => {
                    return {
                      ...city,
                      value: city?.name,
                      label: city?.name,
                    };
                  }),
                };
              } else {
                return { ...el };
              }
            });
            setCityyList(dataChangeCity);
          }
        });
      } else {
        ArcherService.getListCity({
          limit: 500,
          page: 1,
          country_id: country[index]?.id ?? null,
          province_id: value?.id ?? null,
        }).then((res) => {
          const { data } = res;
          const newCities = data?.map((city) => {
            return {
              ...city,
              value: city?.name,
              label: city?.name,
            };
          });
          const cityAddToList = cityList?.filter(
            (e) => e.idUser === value.idUser
          );
          if (!cityAddToList?.length) {
            cityData.push(...provinceList, {
              idUser: value.idUser,
              cityList: newCities,
            });
            setCityyList(cityData);
          } else {
            const cityListData = cityList?.map((city) => {
              if (value.idUser?.toString() === city.idUser?.toString()) {
                return {
                  idUser: city.idUser,
                  cityList: data?.map((el) => {
                    return {
                      ...el,
                      value: el?.name,
                      label: el?.name,
                    };
                  }),
                };
              } else {
                return { ...city };
              }
            });
            setCityyList(cityListData);
          }
        });
      }
    });
  };

  React.useEffect(() => {
    fetchCountry(countryInput);
    if (selectCountry?.length) {
      fetchProvince(selectCountry, provinceInput);
    }
    if (selectProvince?.length) {
      fetchCity(selectCountry, selectProvince, cityInput);
    }
  }, [countryInput, selectCountry, selectProvince, provinceInput]);
  return [countryList, provinceList, cityList];
};

export { listAllCountry, listAllProvince, listAllCity, useCountry };
