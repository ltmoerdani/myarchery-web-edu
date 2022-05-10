import * as React from "react";
import styled from "styled-components";

import { PickerControl } from "./picker-control";
import { FieldErrorMessage } from "../field-error-message";

import IconChevronDown from "components/ma/icons/mono/chevron-down";

import classnames from "classnames";

function ClubPicker({ placeholder = "Pilih klub", value, errors, disabled, ...props }) {
  const [isPickerOpen, setPickerOpen] = React.useState(false);
  return (
    <div>
      <PickerButton
        onClick={() => !disabled && setPickerOpen(true)}
        className={classnames({ "field-invalid": errors?.length })}
        disabled={disabled}
      >
        {value?.detail?.name || <PlaceholderText>{placeholder}</PlaceholderText>}
      </PickerButton>
      <FieldErrorMessage errors={errors} />

      {isPickerOpen && (
        <PickerControl
          value={value}
          {...props}
          toggle={() => setPickerOpen((open) => !open)}
          onClosed={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

function PickerButton({ children, onClick, className, disabled }) {
  return (
    <StyledPickerButton
      className={classnames(className, { "field-disabled": disabled })}
      onClick={onClick}
    >
      <StyledPickerButtonBody className={classnames({ "field-disabled": disabled })}>
        {children}
      </StyledPickerButtonBody>
      <StyledPickerIndicator className={classnames({ "field-disabled": disabled })}>
        <IconChevronDown size="20" />
      </StyledPickerIndicator>
    </StyledPickerButton>
  );
}

const StyledPickerButton = styled.div`
  overflow: hidden;
  border-radius: 0.25rem;
  border: 1px solid #ced4da;
  display: flex;
  color: var(--ma-gray-400);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:hover {
    border-color: var(--ma-gray-400);
  }

  &:active,
  &:focus {
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;

    &.field-disabled {
      border-color: var(--ma-gray-50);
      box-shadow: none;
    }
  }

  &.field-invalid {
    border-color: var(--ma-red);
  }

  &.field-disabled {
    border-color: var(--ma-gray-50);
  }
`;

const StyledPickerIndicator = styled.button`
  flex: 0 0 auto;
  display: inline-block;
  padding: 0.5rem 0.75rem;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  border: none;
  background-color: #ffffff;
  background-clip: padding-box;
  color: var(--ma-blue);

  &.field-disabled {
    background-color: var(--ma-gray-50);
    color: var(--ma-gray-400);
    cursor: default;
  }
`;

const StyledPickerButtonBody = styled.button`
  flex: 1 1 0%;
  display: inline-block;
  padding: 0.5rem 0.75rem;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  border: none;
  background-color: #ffffff;
  background-clip: padding-box;

  color: var(--ma-txt-black);
  font-weight: 400;
  line-height: 1.5;
  text-align: left;

  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &.field-disabled {
    background-color: var(--ma-gray-50);
    cursor: default;
  }
`;

const PlaceholderText = styled.span`
  color: var(--ma-txt-black);
  opacity: 0.4;
`;

export { ClubPicker };
