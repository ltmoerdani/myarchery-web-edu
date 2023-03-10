import * as React from "react";

import { SelectCity } from "./select-city";
import { FieldErrorMessage } from "./field-error-message";
import { FieldInputTextWrapper } from "./styles/fields";

import classnames from "classnames";
import { SelectCountry } from "./select-country";
import { SelectProvince } from "./select-province";

function FieldSelectKontingen({
  label = "Pilih Kontingen yang Anda Wakilkan",
  name,
  required,
  provinceId,
  value,
  onChange,
  disabled,
  errors,
  countryId,
  parentClassificationId,
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
      {parentClassificationId === 4 ? (
        <SelectCity
          placeholder={"Pilih Kota/Kabupaten"}
          provinceId={provinceId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          errors={errors}
          countryId={countryId}
        />
      ) : parentClassificationId === 2 ? (
        <SelectCountry
          placeholder={"Pilih Negara"}
          value={value}
          onChange={onChange}
          errors={errors}
        />
      ) : parentClassificationId === 3 ? (
        <SelectProvince
          placeholder={"Pilih Provinsi"}
          value={value}
          onChange={onChange}
          errors={errors}
          countryId={countryId}
        />
      ) : null}
      <FieldErrorMessage errors={errors} />
    </FieldInputTextWrapper>
  );
}

export { FieldSelectKontingen };
