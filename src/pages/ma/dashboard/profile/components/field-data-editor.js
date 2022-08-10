import * as React from "react";
import styled from "styled-components";
import { useErrorHandler } from "react-error-boundary";

import { Modal as BSModal, ModalBody } from "reactstrap";
import DatePicker from "react-datepicker";
import { ButtonBlue, Button, LoadingScreen, AlertServerError } from "components/ma";
import { ErrorBoundary } from "components/ma/error-boundary";
import { SelectRadio } from "pages/ma/event-registration/components/select-radio";

import { isSameDay, subYears } from "date-fns";
import { datetime } from "utils";

function FieldDataEditor({
  children,
  label,
  required,
  name,
  placeholder,
  title,
  disabled,
  value = "",
  editor,
  field,
  onSubmit,
  isSubmiting,
  submitErrors,
  onConfirmSubmitErrors,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;
  const displayValue = _getDisplayValue(field, value);

  return (
    <ErrorBoundary>
      <FieldInputTextWrapper title={title}>
        {(children || label) && (
          <FieldLabel htmlFor={fieldID} className="field-label">
            {children || label}
            {required && <span className="field-required">*</span>}
          </FieldLabel>
        )}
        <InputWithButton>
          <Input
            disabled
            readOnly
            id={fieldID}
            className="field-input-text"
            name={name}
            placeholder={placeholder}
            value={displayValue}
          />
          {!disabled && (
            <DataEditor
              settings={editor}
              field={{ ...field, id: fieldID, name, placeholder, value }}
              onSubmit={onSubmit}
              isSubmiting={isSubmiting}
              submitErrors={submitErrors}
              onConfirmSubmitErrors={onConfirmSubmitErrors}
            />
          )}
        </InputWithButton>
      </FieldInputTextWrapper>
    </ErrorBoundary>
  );
}

function DataEditor({
  settings,
  field,
  onSubmit,
  isSubmiting,
  submitErrors,
  onConfirmSubmitErrors,
}) {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <EditButton onClick={() => setOpen((open) => !open)}>Ubah</EditButton>
      {isOpen && (
        <EditorModal
          settings={settings}
          field={field}
          toggle={() => setOpen((open) => !open)}
          onClose={() => setOpen(false)}
          onSubmit={onSubmit}
          isSubmiting={isSubmiting}
          submitErrors={submitErrors}
          onConfirmSubmitErrors={onConfirmSubmitErrors}
        />
      )}
    </React.Fragment>
  );
}

function EditorModal({
  settings,
  field,
  onClose,
  toggle,
  onSubmit,
  isSubmiting,
  submitErrors,
  onConfirmSubmitErrors,
}) {
  const reservedInitialValue = React.useRef(_getReservedValue(field));
  const [inputValue, setInputValue] = React.useState(
    _getInitialValue(field, reservedInitialValue.current)
  );
  const isDirty = _checkDirty(field, reservedInitialValue.current, inputValue);
  const editorValue = _makeValueByType(field, inputValue);

  const handleError = useErrorHandler();

  const renderInputByType = (type) => {
    const inputProps = {
      id: field.id,
      name: field.name,
      placeholder: field.placeholder,
      value: inputValue,
      onChange: setInputValue,
    };

    if (type === "radio") {
      return <SelectRadio {...inputProps} options={field.options} />;
    }

    if (type === "date") {
      return <InputDate {...inputProps} />;
    }

    return <InputText {...inputProps} />;
  };

  return (
    <React.Fragment>
      <Modal isOpen centered scrollable={false} toggle={toggle}>
        <ModalBody>
          <ModalContentLayout>
            <HeaderTitle>{settings.title}</HeaderTitle>

            <div>{settings.body}</div>

            <div>
              <FieldInputTextWrapper>{renderInputByType(field.type)}</FieldInputTextWrapper>
              {field.description && <SubtleFieldNote>{field.description}</SubtleFieldNote>}
            </div>

            <ButtonListVertical>
              {isDirty && inputValue ? (
                <ButtonBlue
                  block
                  onClick={() => {
                    try {
                      onSubmit({ close: onClose, value: editorValue });
                    } catch (err) {
                      handleError(err);
                    }
                  }}
                >
                  Simpan
                </ButtonBlue>
              ) : (
                <ButtonBlue block disabled title="Belum ada perubahan data">
                  Simpan
                </ButtonBlue>
              )}

              <Button block onClick={onClose}>
                Batal
              </Button>
            </ButtonListVertical>
          </ModalContentLayout>
        </ModalBody>
      </Modal>

      <LoadingScreen loading={isSubmiting} />
      <AlertServerError
        isError={Boolean(submitErrors)}
        errors={submitErrors}
        onConfirm={onConfirmSubmitErrors}
      />
    </React.Fragment>
  );
}

function InputText({ id, name, placeholder, value, onChange }) {
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus?.();
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Input
      ref={inputRef}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onFocus={(ev) => ev.target.select()}
      onChange={(ev) => onChange(ev.target.value)}
    />
  );
}

function InputDate({ id, name, placeholder, value, onChange }) {
  return (
    <StyledDatePicker
      id={id}
      name={name}
      placeholderText={placeholder}
      selected={value}
      onChange={onChange}
      locale={datetime.locale}
      dateFormat="dd/MM/yyyy"
      showPopperArrow={false}
      showMonthDropdown
      showYearDropdown
      yearDropdownItemNumber={7}
    />
  );
}

/* ===================================== */
// styles

const FieldInputTextWrapper = styled.div`
  margin-bottom: 0.5rem;
`;

const FieldLabel = styled.label`
  display: block;
  color: var(--ma-gray-600);
  margin-bottom: 0.25rem;

  .field-required {
    color: var(--ma-red);
  }
`;

const InputWithButton = styled.div`
  display: flex;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
  }
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--ma-gray-500);
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;

  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &::placeholder {
    color: var(--ma-gray-400);
    opacity: 0.6;
  }

  &:focus {
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
  }

  &:disabled,
  &[readonly] {
    background-color: var(--ma-gray-50);
    border-color: var(--ma-gray-50);
    color: var(--ma-gray-500);
    opacity: 1;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  background-color: #fff;
  background-clip: padding-box;

  color: var(--ma-gray-500);
  font-weight: 400;
  line-height: 1.5;

  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &::placeholder {
    color: var(--ma-gray-400);
    opacity: 0.6;
  }

  &:focus {
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
  }
`;

const EditButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: none;
  background-color: unset;
  color: var(--ma-blue);
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const Modal = styled(BSModal)`
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
`;

const ModalContentLayout = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const HeaderTitle = styled.h2`
  text-align: center;
  font-weight: 600;
`;

const SubtleFieldNote = styled.div`
  color: var(--ma-gray-400);
  font-size: 0.9em;
`;

const ButtonListVertical = styled.div`
  > * + * {
    margin-top: 0.5rem;
  }
`;

/* ===================================== */
// utils

function _getDisplayValue(field, value) {
  if (field?.type === "radio") {
    return field.options.find((option) => option.value === value)?.label;
  }
  if (field?.type === "date") {
    return value ? datetime.formatFullDateLabel(value) : "";
  }
  return value || "";
}

function _getReservedValue(field) {
  if (field?.type === "date") {
    return field.value ? datetime.parseServerDatetime(field.value) : "";
  }
  return field.value || "";
}

function _getInitialValue(field, reservedInitialValue) {
  if (field.type === "date") {
    return reservedInitialValue || subYears(new Date(), 10);
  }
  return reservedInitialValue;
}

function _checkDirty(field, reservedInitialValue, input) {
  if (field?.type === "date") {
    return !isSameDay(reservedInitialValue, input);
  }
  return input !== reservedInitialValue;
}

function _makeValueByType(field, inputValue) {
  const value = field.type === "date" ? datetime.formatServerDate(inputValue) : inputValue;
  return {
    [field.name]: value,
  };
}

export { FieldDataEditor };
