import * as React from "react";
import styled from "styled-components";

import Select from "react-select";

function SelectCategories({ options, value, onChange }) {
  return (
    <SelectWrapper>
      <Select options={options} value={value} onChange={onChange} />
    </SelectWrapper>
  );
}

const SelectWrapper = styled.div`
  width: 20rem;
`;

export { SelectCategories };
