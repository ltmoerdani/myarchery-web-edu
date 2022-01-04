import * as React from "react";
import styled from "styled-components";

function FieldTextArea({ children, label, name, placeholder, value, onChange }) {
  const fieldID = name ? `field-input-${name}` : undefined;

  const handleTextChange = (ev) => {
    onChange?.(ev.target.value);
  };

  return (
    <FieldTextAreaWrapper>
      {(children || label) && (
        <label className="field-label" htmlFor={fieldID}>
          {children || label}
        </label>
      )}
      <textarea
        className="field-textarea"
        id={fieldID}
        rows="3"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleTextChange}
      />
    </FieldTextAreaWrapper>
  );
}

const FieldTextAreaWrapper = styled.div`
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

  .field-textarea {
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

export default FieldTextArea;
