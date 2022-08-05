import * as React from "react";

import { SelectCity } from "./select-city";
import { FieldInputTextWrapper } from "./styles/fields";

import classnames from "classnames";

function FieldSelectCity({
  label = "Kota (Sesuai KTP/KK)",
  name,
  required,
  provinceId,
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
      <SelectCity
        placeholder={provinceId ? "Pilih kota" : "Pilih provinsi terlebih dahulu"}
        provinceId={provinceId}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </FieldInputTextWrapper>
  );
}

export { FieldSelectCity };
