import * as React from "react";
import styled from "styled-components";
import { ButtonBlue } from "components/ma";

function FieldImagePicker({ children, label, name, placeholder, onChange }) {
  const fieldID = name ? `field-picker-${name}` : undefined;

  return (
    <ImagePickerWrapper>
      {(children || label) && <div className="field-label">{children || label}</div>}
      <div className="picker-container">
        <label htmlFor={fieldID} className="picker-input-control">
          <div>{placeholder || "Unggah gambar 1080x1080px,png/jpg, maks. 2mb"}</div>
          <ButtonBlue as="span">Unggah</ButtonBlue>
          <input
            className="picker-file-input"
            id={fieldID}
            type="file"
            accept="image/jpg,image/jpeg,image/png"
            onChange={onChange}
          />
        </label>
      </div>
    </ImagePickerWrapper>
  );
}

const ImagePickerWrapper = styled.div`
  margin-bottom: 1.5rem;

  .field-label {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
  }

  .picker-container {
    border: dashed 3px #e2e2e2;
    background-color: #f6f6f6;

    .picker-input-control {
      margin: 0;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .picker-file-input {
      display: none;
    }
  }
`;

export default FieldImagePicker;
