import React from "react";
import { InputGroup, Label } from "reactstrap";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import stringUtil from "utils/stringUtil";
import moment from "moment";
import _ from "lodash";

const DateInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange = null,
  error,
  disabled,
  readOnly,
  options = {},
  placeholder,
}) => {
  const handleChange = (e) => {
    if (onChange)
      onChange({
        key: name,
        value: e.length > 0 ? moment(new Date(e)).format("Y-MM-DD") : "",
      });
  };

  return (
    <div className="date-input">
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputGroup>
        <Flatpickr
          className={`form-control d-block ${
            _.get(error, name) ? "is-invalid" : ""
          }`}
          placeholder={placeholder ?? "Tanggal/Bulan/Tahun"}
          options={{
            altInput: true,
            altFormat: "d/m/Y",
            dateFormat: "Y-m-d",
            ...options,
          }}
          value={value}
          onChange={(e) => handleChange(e)}
          disabled={disabled}
          readOnly={readOnly}
        />
        <div className="input-group-append">
          <span className="input-group-text">
            <i className="mdi mdi-calendar-outline" />
          </span>
        </div>
      </InputGroup>
      {_.get(error, name)?.map((message) => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default DateInput;
