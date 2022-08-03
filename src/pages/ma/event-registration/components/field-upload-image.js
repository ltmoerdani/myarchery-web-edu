import * as React from "react";
import styled from "styled-components";

import { Button, ButtonBlue } from "components/ma";
import { Show } from "./show-when";
import { FieldErrorMessage } from "./field-error-message";
import { FieldInputTextWrapper } from "./styles/fields";

import classnames from "classnames";

function FieldUploadImage({
  label,
  required,
  name,
  placeholder = "Unggah gambar dengan file JPG/PNG",
  value = {},
  onChange,
  disabled,
  errors,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;
  const hasPreview = value.preview || value.url;

  const handleChooseImage = async (ev) => {
    if (!ev.target.files?.[0]) {
      return;
    }
    const imageRawData = ev.target.files[0];
    const imagePreviewUrl = URL.createObjectURL(imageRawData);
    onChange({ preview: imagePreviewUrl, raw: imageRawData });
  };

  return (
    <FieldInputTextWrapper>
      <UploadLabelWrapper className={classnames({ "field-disabled": disabled })} htmlFor={fieldID}>
        <span className="field-label">
          {label}
          {required && <span className="field-required">*</span>}
        </span>

        <Show when={disabled}>
          <UploadArea className={classnames({ "field-disabled": disabled })}>
            <UploadAreaContent>
              <ButtonList>
                <Show when={hasPreview}>
                  <Button>Lihat</Button>
                </Show>

                <Show when={!hasPreview}>
                  <span>Tidak ada gambar terunggah</span>
                </Show>
              </ButtonList>
            </UploadAreaContent>
          </UploadArea>
        </Show>

        <Show when={!disabled}>
          <UploadArea>
            <UploadAreaContent>
              <span>{value.raw?.name || placeholder}</span>

              <ButtonList>
                <Show when={hasPreview}>
                  <Button onClick={() => alert(value.raw?.name || value.preview || value.url)}>
                    Lihat
                  </Button>
                </Show>

                <ButtonBlue as="span">Pilih File</ButtonBlue>
              </ButtonList>
            </UploadAreaContent>
          </UploadArea>
        </Show>
      </UploadLabelWrapper>

      <InputToggleItem
        className={classnames({ "field-invalid": errors?.length })}
        id={fieldID}
        name={name}
        type="file"
        accept="image/jpg,image/jpeg,image/png"
        placeholder={placeholder}
        onChange={handleChooseImage}
        disabled={disabled}
      />

      <FieldErrorMessage errors={errors} />
    </FieldInputTextWrapper>
  );
}

const InputToggleItem = styled.input`
  position: absolute;
  top: -1000px;
  left: -1000px;
  visibility: hidden;
  margin: 0;
`;

const UploadLabelWrapper = styled.label`
  display: block;
  margin: 0;
`;

const UploadArea = styled.span`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  height: 136px;
  padding: 0.5rem 0.875rem;
  border: 2px #e2e2e2 dashed;
  border-radius: 0.15rem;
  background-color: #f6f6f6;

  font-weight: 400;

  &.field-disabled {
    cursor: default;
  }
`;

const UploadAreaContent = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  text-align: center;
`;

const ButtonList = styled.span`
  display: flex;
  gap: 0.5rem;
`;

export { FieldUploadImage };
