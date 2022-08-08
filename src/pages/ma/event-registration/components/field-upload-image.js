import * as React from "react";
import * as ReactDOM from "react-dom";
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
                  <PreviewImage title={value.raw?.name} imageUrl={value.preview || value.url} />
                </Show>

                <Show when={!hasPreview}>
                  <span>Tidak ada gambar terunggah</span>
                </Show>
              </ButtonList>
            </UploadAreaContent>
          </UploadArea>
        </Show>

        <Show when={!disabled}>
          <UploadArea className={classnames({ "field-error": _checkHasError(errors) })}>
            <UploadAreaContent>
              <span>{value.raw?.name || placeholder}</span>

              <ButtonList>
                <Show when={hasPreview}>
                  <PreviewImage title={value.raw?.name} imageUrl={value.preview || value.url} />
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

function PreviewImage(props) {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <Button onClick={() => setOpen(true)}>Lihat</Button>
      <LightBox isOpen={isOpen} onClose={() => setOpen(false)} {...props} />
    </React.Fragment>
  );
}

function LightBox({ isOpen, imageUrl, title, onClose }) {
  const portalRef = React.useRef(null);

  React.useEffect(() => {
    const portalTargetDOM = document.createElement("div");
    portalRef.current = portalTargetDOM;

    portalTargetDOM.setAttribute("class", "preview-light-box");
    document.body.appendChild(portalTargetDOM);

    return function () {
      portalTargetDOM.remove();
    };
  }, []);

  if (!portalRef.current || !isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <LightBoxWrapper onClick={onClose}>
      <LightBoxImage src={imageUrl} alt={title} />
    </LightBoxWrapper>,
    portalRef.current
  );
}

/* ====================================== */
// styles

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

  &.field-error {
    border-color: pink;
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

const LightBoxWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  z-index: 1010;
`;

const LightBoxImage = styled.img`
  position: absolute;
  height: 50%;
  width: auto;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

function _checkHasError(errors) {
  return Boolean(errors?.length);
}

export { FieldUploadImage };
