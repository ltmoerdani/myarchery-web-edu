import * as React from "react";
import { GeneralService } from "services";

import { AsyncPaginate } from "react-select-async-paginate";
import { customSelectStyles } from "./select-option";

const FETCHING_LIMIT = 30;

function SelectCity({ name, placeholder, provinceId, value, onChange, errors, disabled }) {
  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    const result = await GeneralService.getCities({
      limit: FETCHING_LIMIT,
      page: page,
      name: searchQuery,
      province_id: provinceId,
    });
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

export { SelectCity };
