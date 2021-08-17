import React from "react";
import CurrencyFormat from "react-currency-format";
import { Col, Label } from "reactstrap";
import stringUtil from "utils/stringUtil";

const CurrencyInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange,
  horizontal = false,
  error,
}) => {
  const handleChange = e => {
    if (onChange)
      onChange({
        key: name,
        value: e.floatValue,
      });
  };
  if (horizontal) {
    return (
      <div className="row">
        <Label htmlFor="horizontal-Input" className="col-sm-6 col-form-label">
          {label}
        </Label>
        <Col sm={6}>
          <CurrencyFormat
            value={value}
            displayType={"input"}
            thousandSeparator={"."}
            prefix={"Rp "}
            onValueChange={e => handleChange(e)}
            decimalSeparator={","}
            className="form-control"
            id={id}
          />
        </Col>
        {error?.[name]?.map(message => (
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
      <CurrencyFormat
        value={value}
        displayType={"input"}
        thousandSeparator={"."}
        prefix={"Rp "}
        onChange={() => handleChange()}
        decimalSeparator={","}
        className="form-control"
        id={id}
      />
      {error?.[name]?.map(message => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default CurrencyInput;
