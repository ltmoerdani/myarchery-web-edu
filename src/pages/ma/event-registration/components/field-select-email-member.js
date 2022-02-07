import * as React from "react";
import styled from "styled-components";
import { OrderEventService } from "services";

import AsyncSelect from "react-select/async";
import { FieldErrorMessage } from "./field-error-message";

import classnames from "classnames";

function FieldSelectEmailMember({
  children,
  label,
  required,
  name,
  placeholder,
  formData,
  value,
  onChange,
  disabled,
  errors,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;

  const loadOptions = async (searchQuery) => {
    const result = await OrderEventService.getMemberEmails({
      category_id: formData.category.id,
      club_id: formData.club?.detail.id,
      email: searchQuery,
    });

    return result.success ? result.data : [];
  };

  return (
    <FieldSelectEmailMemberWrapper>
      {(children || label) && (
        <label
          className={classnames("field-label", { "field-disabled": disabled })}
          htmlFor={fieldID}
        >
          {children || label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <AsyncSelect
        styles={computeCustomStylesWithValidation(errors)}
        name={name}
        placeholder={placeholder}
        loadOptions={loadOptions}
        getOptionLabel={(option) => option.email}
        noOptionsMessage={({ inputValue }) => {
          return !inputValue ? "Cari email" : "Pengguna tidak ditemukan";
        }}
        value={value}
        getOptionValue={(option) => option?.id}
        isClearable
        onChange={(option) => onChange?.(option)}
      />
      <FieldErrorMessage errors={errors} />
    </FieldSelectEmailMemberWrapper>
  );
}

const FieldSelectEmailMemberWrapper = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;

  .field-label {
    display: inline-block;
    color: var(--ma-gray-600);
    margin-bottom: 0.25rem;

    .field-required {
      color: var(--ma-red);
    }

    &.field-disabled {
      color: var(--ma-gray-400);
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

export { FieldSelectEmailMember };
