import * as React from "react";

import { SelectCountry } from "./select-country";
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
      />
    </FieldInputTextWrapper>
  );
}

export { FieldSelectCountry };
