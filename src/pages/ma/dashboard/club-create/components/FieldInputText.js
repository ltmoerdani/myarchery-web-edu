import * as React from "react";
import styled from "styled-components";

function FieldInputText({ children, label, required, name, placeholder, value, onChange }) {
  const fieldID = name ? `field-input-${name}` : undefined;

  const handleChange = (ev) => {
    onChange?.(ev.target.value);
  };

  return (
    <FieldInputTextWrapper>
      {(children || label) && (
        <label className="field-label" htmlFor={fieldID}>
          {children || label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <input
        className="field-input-text"
        id={fieldID}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </FieldInputTextWrapper>
  );
}

const FieldInputTextWrapper = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;

  .field-label {
    display: inline-block;
    color: var(--ma-gray-600);
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;

    .field-required {
      color: var(--ma-red);
    }
  }

  .field-input-text {
    display: block;
    width: 100%;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: #6a7187;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;

    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &::placeholder {
      color: #6a7187;
      opacity: 0.6;
    }

    &:focus {
      border-color: #2684ff;
      box-shadow: 0 0 0 1px #2684ff;
    }

    &:disabled,
    &[readonly] {
      background-color: #eff2f7;
      opacity: 1;
    }
  }
`;

export default FieldInputText;
