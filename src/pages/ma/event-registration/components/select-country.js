import * as React from "react";
import { GeneralService } from "services";

import { AsyncPaginate } from "react-select-async-paginate";
import { customSelectStyles } from "./select-option";

const FETCHING_LIMIT = 30;

function SelectCountry({ name, placeholder, value, onChange, errors, disabled }) {
  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    const result = await GeneralService.getCountries({
      limit: FETCHING_LIMIT,
      page: page,
      name: searchQuery,
    });
    const options = result.data.map((country) => ({
      label: country.name,
      value: parseInt(country.id),
    }));

    return {
      options: options,
      hasMore: result.data.length >= FETCHING_LIMIT,
      additional: { page: page + 1 },
    };
  };

  return (
    <AsyncPaginate
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

export { SelectCountry };
