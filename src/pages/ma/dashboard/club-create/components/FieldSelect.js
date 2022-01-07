import * as React from "react";
import styled from "styled-components";
import Select from "react-select";
import { FieldErrorMessage } from "./FieldErrorMessage";

function FieldSelect({
  children,
  label,
  name,
  placeholder,
  required,
  options,
  value,
  onChange,
  disabled,
  errors,
}) {
  return (
    <FieldSelectWrapper>
      <label className="field-label">
        {children || label}
        {required && <span className="field-required">*</span>}
      </label>
      <Select
        styles={customSelectStyles}
        name={name}
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={onChange}
        isDisabled={disabled}
      />
      <FieldErrorMessage errors={errors} />
    </FieldSelectWrapper>
  );
}

const FieldSelectWrapper = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;

  .field-label {
    display: inline-block;
    color: var(--ma-gray-600);
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;

    .field-required {
      color: var(--ma-red);
    }
  }
`;

const customSelectStyles = {
  valueContainer: (provided) => ({
    ...provided,
    padding: "8px 12px",
  }),
  input: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 14,
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 14,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 14,
    opacity: 0.6,
  }),
};

export default FieldSelect;
