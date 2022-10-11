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
              <ToggleButton htmlFor={id} className={classnames({ "option-disabled": disabled })}>
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
  display: inline-block;

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

  > * + * {
    margin-left: 0.5rem;
  }

  > *:nth-child(1) {
    color: var(--ma-gray-400);
    transition: color 0.25s;
  }

  &:hover > *:nth-child(1) {
    color: var(--ma-field-focused);
  }

  input:checked + & {
    background-color: var(--ma-primary-blue-50);
    color: var(--ma-blue);

    > *:nth-child(1) {
      color: var(--ma-field-focused);
    }
  }

  input + &.option-disabled {
    cursor: default;
    background-color: var(--ma-gray-50);
    color: var(--ma-gray-500);
  }

  input + &.option-disabled:hover > *:nth-child(1) {
    color: var(--ma-gray-400);
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
