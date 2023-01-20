import * as React from "react";

import { SelectCity } from "./select-city";
import { FieldErrorMessage } from "./field-error-message";
import { FieldInputTextWrapper } from "./styles/fields";

import classnames from "classnames";

function FieldSelectKontingen({
  label = "Pilih Kontingen yang Anda Wakilkan",
  name,
  required,
  provinceId,
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
      <SelectCity
        placeholder={"Pilih Kota/Kabupaten"}
        provinceId={provinceId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        errors={errors}
      />
      <FieldErrorMessage errors={errors} />
    </FieldInputTextWrapper>
  );
}

export { FieldSelectKontingen };
