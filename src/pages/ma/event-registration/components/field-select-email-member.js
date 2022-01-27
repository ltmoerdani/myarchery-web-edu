import * as React from "react";
import styled from "styled-components";
import { OrderEventService } from "services";

import { AsyncPaginate } from "react-select-async-paginate";
import { FieldErrorMessage } from "./field-error-message";

import classnames from "classnames";

const FETCHING_LIMIT = 5;

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

    if (result.success) {
      return {
        options: result.data.map(() => ({ label: "member.email", value: "member.id" })),
        hasMore: result.data.length >= FETCHING_LIMIT,
        additional: { page: 1 },
      };
    }

    return {
      options: [],
      hasMore: false,
      additional: { page: 1 },
    };
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
      <AsyncPaginate
        styles={computeCustomStylesWithValidation(errors)}
        name={name}
        loadOptions={loadOptions}
        placeholder={placeholder}
        value={value}
        onChange={(option) => {
          onChange?.(option);
        }}
        noOptionsMessage={({ inputValue }) => {
          return !inputValue ? "Cari berdasarkan nama email" : "Pengguna tidak ditemukan";
        }}
        isSearchable
        debounceTimeout={500}
        additional={{ page: 1 }}
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

  .field-input-text {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-weight: 400;
    line-height: 1.5;
    color: #6a7187;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;

    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &::placeholder {
      color: var(--ma-gray-400);
      opacity: 0.6;
    }

    &:focus {
      border-color: #2684ff;
      box-shadow: 0 0 0 1px #2684ff;
    }

    &:disabled,
    &[readonly] {
      background-color: var(--ma-gray-50);
      border-color: var(--ma-gray-50);
      color: var(--ma-gray-400);
      opacity: 1;
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
    opacity: 0.6,
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
