import * as React from "react";

import Select from "react-select";

function FieldSelect({ name, placeholder, options, value, onChange }) {
  return (
    <Select
      styles={customSelectStyles}
      name={name}
      placeholder={placeholder}
      options={options}
      value={value}
      onChange={(option) => onChange?.(option)}
    />
  );
}

const customSelectStyles = {
  valueContainer: (provided) => ({
    ...provided,
    padding: "8px 12px",
  }),
  input: (provided) => ({
    ...provided,
    color: "#6a7187",
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#6a7187",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--ma-gray-400)",
  }),
};

export { FieldSelect };
