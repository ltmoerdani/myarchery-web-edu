import * as React from "react";

import Select from "react-select";

function SelectOption({
  placeholder,
  options,
  value,
  isMulti,
  isClearable,
  onChange,
  onFocus,
  noOptionsMessage,
  disabled,
  errors,
}) {
  return (
    <Select
      placeholder={placeholder || "Placeholder"}
      noOptionsMessage={() => noOptionsMessage}
      styles={computeCustomStylesWithValidation(errors)}
      options={options}
      value={value}
      isMulti={isMulti}
      isClearable={isClearable}
      onChange={onChange}
      onFocus={onFocus}
      isDisabled={disabled}
    />
  );
}

/* ================================== */
// styles

const customSelectStyles = {
  valueContainer: (provided) => ({
    ...provided,
    padding: "0.5rem 0.75rem",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--ma-gray-400)",
  }),
  input: (provided) => ({
    ...provided,
    color: "#6a7187",
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "var(--ma-blue)",
  }),
};

/* ================================== */
// utils

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

function getOptionFromValue(options, value, defaultFallbackValue) {
  if (!value) {
    return defaultFallbackValue || null;
  }
  return options.find((option) => option.value === value);
}

export { SelectOption, getOptionFromValue, customSelectStyles };
