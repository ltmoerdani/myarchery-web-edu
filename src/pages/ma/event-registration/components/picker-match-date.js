import * as React from "react";
import { FieldInputDate } from "./field-input-date";
import { datetime } from "utils";

function PickerMatchDate({ category, value, onChange }) {
  const dateConstraint = React.useMemo(() => {
    if (!category?.rangeDate?.length) {
      return {};
    }

    const startDate = category.rangeDate[0];
    const endDate = category.rangeDate[category.rangeDate.length - 1];
    return {
      min: datetime.parseServerDatetime(startDate),
      max: datetime.parseServerDatetime(endDate),
    };
  }, [category]);

  if (!category?.rangeDate?.length) {
    return null;
  }

  return (
    <FieldInputDate
      label="Pilih Tanggal Bertanding"
      minDate={dateConstraint.min}
      maxDate={dateConstraint.max}
      value={value}
      onChange={onChange}
    />
  );
}

export { PickerMatchDate };
