import * as React from "react";
import styled from "styled-components";

import { EventCategoryPicker } from "./category-picker";

function FieldSelectCategory({
  children,
  label,
  required,
  name,
  groupedOptions,
  value,
  onChange,
  errors,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;
  const pickerProps = { groupedOptions, value, onChange, errors };

  return (
    <StyledFieldWrapper>
      {(children || label) && (
        <label className="field-label" htmlFor={fieldID}>
          {children || label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <EventCategoryPicker {...pickerProps} />
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

export { FieldSelectCategory };
