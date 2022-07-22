import * as React from "react";
import styled from "styled-components";

import DatePicker from "react-datepicker";

import id from "date-fns/locale/id";
import classnames from "classnames";

function FieldInputDate({
  children,
  label,
  required,
  name,
  placeholder = "DD/MM/YYYY",
  value,
  onChange,
  disabled,
  errors,
  warnings,
  minDate,
  maxDate,
  block,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;

  return (
    <FieldInputDateWrapper>
      {(children || label) && (
        <label className="field-label" htmlFor={fieldID}>
          {children || label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <DatePicker
        className={classnames("field-input-date", {
          "input-block": block,
          "error-invalid": errors?.length,
          "warning-validation": warnings?.length,
        })}
        id={fieldID}
        name={name}
        selected={value}
        onChange={(date) => onChange?.(date)}
        placeholderText={placeholder}
        locale={id}
        dateFormat="dd/MM/yyyy"
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        showPopperArrow={false}
      />
    </FieldInputDateWrapper>
  );
}

const FieldInputDateWrapper = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;

  .field-label {
    display: inline-block;
    color: var(--ma-gray-600);
    margin-bottom: 0.25rem;

    .field-required {
      color: var(--ma-red);
    }
  }

  .field-input-date {
    display: block;
    width: 6.375rem;
    padding: 8px 12px;
    font-weight: 400;
    line-height: 1.5;
    color: #6a7187;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;

    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &.input-block {
      width: 100%;
    }

    &::placeholder {
      color: #6a7187;
      opacity: 0.6;
    }

    &:focus {
      border-color: #2684ff;
      box-shadow: 0 0 0 1px #2684ff;
    }

    &:disabled {
      background-color: #eff2f7;
      opacity: 1;
    }

    &.error-invalid {
      border-color: var(--ma-red);
    }

    &.warning-validation {
      border-color: var(--ma-yellow);
    }
  }
`;

export { FieldInputDate };
