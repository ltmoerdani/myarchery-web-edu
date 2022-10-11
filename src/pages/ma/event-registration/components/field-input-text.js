import * as React from "react";
import styled from "styled-components";

import { FieldErrorMessage } from "./field-error-message";

import classnames from "classnames";

function FieldInputText({
  children,
  label,
  required,
  name,
  placeholder,
  value = "",
  onChange,
  disabled,
  errors,
  isFocus,
  onFocus,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;
  const inputRef = React.useRef(null);

  const handleChange = (ev) => {
    onChange?.(ev.target.value);
  };

  React.useEffect(() => {
    if (!isFocus) {
      return;
    }
    inputRef.current?.focus();
  }, [isFocus]);

  return (
    <FieldInputTextWrapper>
      {(children || label) && (
        <label
          className={classnames("field-label", { "field-disabled": disabled })}
          htmlFor={fieldID}
        >
          {children || label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        className={classnames("field-input-text", { "field-invalid": errors?.length })}
        id={fieldID}
        name={name}
        placeholder={placeholder}
        value={value || ""}
        onChange={handleChange}
        disabled={disabled}
        onFocus={onFocus}
      />
      <FieldErrorMessage errors={errors} />
    </FieldInputTextWrapper>
  );
}

const FieldInputTextWrapper = styled.div`
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
    }

    &:focus {
      border-color: #2684ff;
      box-shadow: 0 0 0 1px #2684ff;
    }

    &:disabled,
    &[readonly] {
      background-color: var(--ma-gray-50);
      border-color: var(--ma-gray-50);
      color: var(--ma-gray-500);
      opacity: 1;
    }

    &.field-invalid {
      border-color: var(--ma-red);
    }
  }
`;

export { FieldInputText };
