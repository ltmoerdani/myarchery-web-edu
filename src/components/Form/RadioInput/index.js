import _ from "lodash";
import React from "react";
import { Input, Label } from "reactstrap";

const RadioInput = ({
  name,
  label = "Checkbox Input",
  options = [
    {
      id: 1,
      label: "Default",
    },
  ],
  onChange = null,
  inline = false,
  valueOnly = false,
  error,
  disabled,
  readOnly,
}) => {
  const handleChange = (e, option) => {
    if (onChange)
      onChange({
        key: name,
        value: valueOnly ? option?.id : option,
      });
  };

  if (inline) {
    return (
      <div>
        {label && <Label>{label}</Label>}
        <div>
          {options?.map(option => {
            return (
              <div
                className={`form-check form-radio-primary ${
                  _.get(error, name) ? "is-invalid" : ""
                }`}
                key={option.id}
                style={{ display: "inline-block", marginRight: 10 }}
              >
                <Input
                  type="radio"
                  className="form-check-Input"
                  id={option.id}
                  onChange={e => handleChange(e, option)}
                  name={name}
                  disabled={disabled}
                  readOnly={readOnly}
                  value={option.id}
                />
                <Label className="form-check-label" htmlFor={option.id}>
                  {option.label}
                </Label>
              </div>
            );
          })}
        </div>
        {_.get(error, name)?.map(message => (
          <div className="invalid-feedback" key={message}>
            {message}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div>
      <Label>{label}</Label>
      {options.map(option => {
        return (
          <div className="form-check form-radio-primary" key={option.id}>
            <Input
              type="radio"
              className="form-check-Input"
              id={option?.id}
              onChange={e => handleChange(e)}
              name={name}
              disabled={disabled}
              readOnly={readOnly}
            />
            <Label className="form-check-label" htmlFor={option.id}>
              {option.label}
            </Label>
          </div>
        );
      })}
      {_.get(error, name)?.map(message => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default RadioInput;
