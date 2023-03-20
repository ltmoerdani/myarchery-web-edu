import * as React from "react";
import { ArcherService } from "services";

import { AsyncPaginate } from "react-select-async-paginate";
import { customSelectStyles } from "./select-option";

const FETCHING_LIMIT = 30;

function SelectProvince({
  name,
  placeholder,
  provinceId,
  value,
  onChange,
  errors,
  disabled,
  countryId,
}) {
  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    let result = [];
    if (countryId === 102) {
      result = await ArcherService.getListProvinceIndonesian({
        limit: FETCHING_LIMIT,
        page: page,
        name: searchQuery,
      });
    } else {
      result = await ArcherService.getListProvince({
        limit: FETCHING_LIMIT,
        page: page,
        name: searchQuery,
        country_id: countryId,
      });
    }
    const options = result.data.map((city) => ({
      label: city.name,
      value: parseInt(city.id),
    }));

    return {
      options: options,
      hasMore: result.data.length >= FETCHING_LIMIT,
      additional: { page: page + 1 },
    };
  };

  return (
    <AsyncPaginate
      key={provinceId}
      styles={computeCustomStylesWithValidation(errors)}
      name={name}
      loadOptions={loadOptions}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      isSearchable
      debounceTimeout={200}
      additional={{ page: 1 }}
      isDisabled={disabled}
    />
  );
}

const computeCustomStylesWithValidation = (errors) => {
  if (errors?.length) {
    return {
      ...customSelectStyles,
      control: (provided) => ({
        ...provided,
        border: "solid 1px var(--ma-red)",
      }),
    };
  }
  return customSelectStyles;
};

export { SelectProvince };
