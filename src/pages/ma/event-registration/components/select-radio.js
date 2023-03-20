import * as React from "react";
import styled from "styled-components";

import IconDot from "components/ma/icons/mono/dot";

import classnames from "classnames";
import { stringUtil } from "utils";

function SelectRadio({
  options = null,
  name = _makeDefaultName(),
  defaultValue,
  value,
  onChange,
  disabled,
}) {
  return (
    <ToggleWrapper>
      {!options?.length ? (
        <span>Opsi tidak tersedia</span>
      ) : (
        options.map((option, index) => {
          const id = name + "-" + (option.value || index);
          return (
            <span key={option.value}>
              <InputToggleItem
                type="radio"
                name={name}
                id={id}
                value={option.value}
                checked={option.value === _checkValue({ value, defaultValue })}
                onChange={(ev) => onChange?.(ev.target.value)}
                disabled={disabled}
              />
              <ToggleButton
                htmlFor={id}
                className={classnames({ "option-disabled": disabled })}
              >
                <span>
                  <IconDot size="0.625em" />
                </span>
                <span>{option.label}</span>
              </ToggleButton>
            </span>
          );
        })
      )}
    </ToggleWrapper>
  );
}

/* ================================= */
// styles

const ToggleWrapper = styled.div`
  display: flex;

  > * + * {
    margin-left: 0.5rem;
  }
`;

const InputToggleItem = styled.input`
  position: absolute;
  top: -1000px;
  left: -1000px;
  visibility: hidden;
  margin: 0;
`;

const ToggleButton = styled.label`
  cursor: pointer;
  margin: 0;
  padding: 0.5rem 0.875rem;
  border-radius: 0.15rem;
  background-color: var(--ma-gray-200);
  font-weight: 400;
  display: flex;
  align-items: center;

  > * + * {
    margin-left: 0.5rem;
  }

  > *:nth-child(1) {
    color: transparent;
    background-color: transparent;
    transition: color 0.25s;
    display: flex;
    padding: 4px;
    border: 2px solid var(--ma-gray-400);
    border-radius: 50%;
  }

  input:checked + & {
    background-color: var(--ma-primary-blue-50);
    color: var(--ma-blue);

    > *:nth-child(1) {
      background-color: #0d47a1;
      border: 2px solid #0d47a1;
      color: white;
    }
  }

  input + &.option-disabled {
    cursor: default;
    background-color: var(--ma-gray-50);
    color: var(--ma-gray-500);
  }

  input:checked + &.option-disabled > *:nth-child(1) {
    color: var(--ma-field-focused);
    opacity: 0.5;
  }

  /* TODO: focus state */
`;

/* ================================= */
// utils

const _makeDefaultName = () => "option-" + stringUtil.createRandom();

function _checkValue({ value, defaultValue }) {
  const valueIsEmpty = _checkValueIsEmpty(value);
  const defaultValueIsEmpty = _checkValueIsEmpty(defaultValue);

  if (valueIsEmpty && defaultValueIsEmpty) {
    return "";
  }
  if (valueIsEmpty && !defaultValueIsEmpty) {
    return defaultValue;
  }
  return value;
}

function _checkValueIsEmpty(value) {
  return value === null || typeof value === "undefined";
}

export { SelectRadio };
