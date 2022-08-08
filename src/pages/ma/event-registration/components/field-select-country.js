import * as React from "react";

import { SelectCountry } from "./select-country";
import { FieldErrorMessage } from "./field-error-message";
import { FieldInputTextWrapper } from "./styles/fields";

import classnames from "classnames";

function FieldSelectCountry({
  label = "Negara",
  placeholder,
  name,
  required,
  value,
  onChange,
  disabled,
  errors,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;
  return (
    <FieldInputTextWrapper>
      {label && (
        <label
          className={classnames("field-label", { "field-disabled": disabled })}
          htmlFor={fieldID}
        >
          {label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <SelectCountry
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        errors={errors}
      />
      <FieldErrorMessage errors={errors} />
    </FieldInputTextWrapper>
  );
}

export { FieldSelectCountry };
