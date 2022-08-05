import * as React from "react";
import { useFetcher } from "./fetcher-alt";
import { useSelector, useDispatch } from "react-redux";
import * as LocationStore from "store/slice/location";
import { GeneralService } from "services";

function useLocation() {
  const { provinces, cities } = useSelector(LocationStore.getLocationStore);
  const dispatch = useDispatch();
  const fetcherProvince = useFetcher();
  const fetcherCity = useFetcher();

  React.useEffect(() => {
    if (provinces?.length) {
      return;
    }
    const getFunction = () => {
      return GeneralService.getProvinces({ limit: 50, page: 1 });
    };
    fetcherProvince.runAsync(getFunction, {
      transform: (data) => data.map((province) => ({ ...province, id: parseInt(province.id) })),
      onSuccess: (data) => {
        dispatch(LocationStore.setProvinces(data));
      },
    });
  }, [provinces]);

  React.useEffect(() => {
    if (cities?.length) {
      return;
    }
    const getFunction = () => {
      return GeneralService.getCities({ limit: 1000, page: 1 });
    };
    fetcherCity.runAsync(getFunction, {
      transform: (data) => {
        return data.map((city) => ({
          ...city,
          id: parseInt(city.id),
          provinceId: parseInt(city.provinceId),
        }));
      },
      onSuccess: (data) => {
        dispatch(LocationStore.setCities(data));
      },
    });
  }, [cities]);

  const getProvinceById = React.useCallback(
    (provinceId) => {
      if (!provinces?.length) {
        return null;
      }
      return provinces.find((province) => province.id === parseInt(provinceId)) || null;
    },
    [provinces]
  );

  const getCityById = React.useCallback(
    (cityId) => {
      if (!cities?.length) {
        return null;
      }
      return cities.find((city) => city.id === parseInt(cityId)) || null;
    },
    [cities]
  );

  return { provinces, cities, getProvinceById, getCityById };
}

export { useLocation };
