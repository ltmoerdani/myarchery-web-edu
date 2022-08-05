import * as React from "react";

import { SelectRadio } from "./select-radio";
import { FieldInputTextWrapper } from "./styles/fields";

import classnames from "classnames";

function FieldSelectNationality({
  label = "Kewarganegaraan",
  required,
  name,
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
      <SelectRadio
        name={name}
        options={[
          { value: 0, label: "Warga Negara Indonesia" },
          { value: 1, label: "Warga Negara Asing" },
        ]}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </FieldInputTextWrapper>
  );
}

export { FieldSelectNationality };
