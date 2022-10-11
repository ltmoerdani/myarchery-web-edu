import * as React from "react";
import styled from "styled-components";

import { SelectProvince } from "./select-province";

import classnames from "classnames";

function FieldSelectProvince({ name, value, onChange, disabled, errors, warnings, readOnly }) {
  const fieldID = name ? `field-input-${name}` : undefined;

  return (
    <FieldWrapper>
      <label className="field-label" htmlFor={fieldID}>
        Provinsi
        <span className="field-required">*</span>
      </label>

      <SelectProvince
        placeholder="Pilih lokasi provinsi"
        className={classnames({
          "error-invalid": errors?.length,
          "warning-validation": warnings?.length,
        })}
        id={fieldID}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
      />
    </FieldWrapper>
  );
}

const FieldWrapper = styled.div`
  .field-label {
    display: inline-block;
    margin: 0.25rem 0;
    color: var(--ma-gray-600);
    font-weight: 600;

    .field-required {
      color: var(--ma-red);
    }
  }
`;

export { FieldSelectProvince };
