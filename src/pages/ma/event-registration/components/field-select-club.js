import * as React from "react";
import styled from "styled-components";

import { ClubPicker } from "./club-picker";

import classnames from "classnames";

function FieldSelectClub({
  children,
  label,
  required,
  name,
  groupedOptions,
  value,
  onChange,
  errors,
  disabled,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;
  const pickerProps = { groupedOptions, value, onChange, errors, disabled };

  return (
    <StyledFieldWrapper>
      {(children || label) && (
        <label
          className={classnames("field-label", { "field-disabled": disabled })}
          htmlFor={fieldID}
        >
          {children || label || "Nama Klub"}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <ClubPicker {...pickerProps} />
    </StyledFieldWrapper>
  );
}

const StyledFieldWrapper = styled.div`
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
`;

export { FieldSelectClub };
