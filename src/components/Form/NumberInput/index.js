import _ from "lodash";
import React from "react";
import { Input, InputGroup, Label } from "reactstrap";
import stringUtil from "utils/stringUtil";

const NumberInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange,
  accessoryRight,
  error,
  readOnly,
  disabled,
  defaultValue,
}) => {
  const handleChange = e => {
    if (onChange)
      onChange({
        key: name,
        value: e.target.value,
      });
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputGroup>
        <Input
          type="number"
          className={`form-control ${_.get(error, name) ? "is-invalid" : ""}`}
          id={id}
          onChange={handleChange}
          value={value}
          placeholder={label}
          readOnly={readOnly}
          disabled={disabled}
          defaultValue={defaultValue}
        />
        {accessoryRight}
      </InputGroup>
      {_.get(error, name)?.map(message => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default NumberInput;
