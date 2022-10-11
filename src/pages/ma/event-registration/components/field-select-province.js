import * as React from "react";
import { useLocation } from "hooks/location";

import { SelectOption } from "./select-option";
import { FieldErrorMessage } from "./field-error-message";
import { FieldInputTextWrapper } from "./styles/fields";

import classnames from "classnames";

function FieldSelectProvince({
  label = "Provinsi/Wilayah (Sesuai KTP/KK)",
  name,
  required,
  value,
  onChange,
  disabled,
  errors,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;
  const { provinces } = useLocation();
  const options = provinces?.map((province) => ({ value: province.id, label: province.name }));
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
      <SelectOption
        placeholder="Pilih provinsi/wilayah sesuai KTP/KK"
        options={options}
        value={value}
        onChange={onChange}
        disabled={disabled}
        errors={errors}
      />
      <FieldErrorMessage errors={errors} />
    </FieldInputTextWrapper>
  );
}

export { FieldSelectProvince };
