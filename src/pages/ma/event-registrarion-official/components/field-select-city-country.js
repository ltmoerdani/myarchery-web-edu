import * as React from "react";

import { SelectCityByCountry } from "./select-city-country";
import { FieldErrorMessage } from "./field-error-message";
import { FieldInputTextWrapper } from "./styles/fields";

import classnames from "classnames";

function FieldSelectCityByCountry({
  label = "Kota (Sesuai dengan paspor)",
  name,
  required,
  countryId,
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
      <SelectCityByCountry
        placeholder={countryId ? "Pilih kota" : "Pilih negara terlebih dahulu"}
        countryId={countryId}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <FieldErrorMessage errors={errors} />
    </FieldInputTextWrapper>
  );
}

export { FieldSelectCityByCountry };
