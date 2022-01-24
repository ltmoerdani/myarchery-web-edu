import * as React from "react";
import styled from "styled-components";
import { PickerControl } from "./picker-control";

function ClubPicker({ placeholder = "Pilih klub", value, ...props }) {
  const [isPickerOpen, setPickerOpen] = React.useState(false);
  return (
    <div>
      <PickerButton onClick={() => setPickerOpen(true)}>
        {value?.detail.name || <PlaceholderText>{placeholder}</PlaceholderText>}
      </PickerButton>

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

const PickerButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: #ffffff;
  background-clip: padding-box;
  border-radius: 0.25rem;
  border: 1px solid #ced4da;

  color: var(--ma-txt-black);
  font-weight: 400;
  line-height: 1.5;
  text-align: left;

  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
`;

const PlaceholderText = styled.span`
  color: var(--ma-txt-black);
  opacity: 0.4;
`;

export { ClubPicker };
