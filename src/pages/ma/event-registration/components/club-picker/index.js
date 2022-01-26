import * as React from "react";
import styled from "styled-components";
import { PickerControl } from "./picker-control";

import IconChevronDown from "components/ma/icons/mono/chevron-down";

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

function PickerButton({ children, onClick }) {
  return (
    <StyledPickerButton onClick={onClick}>
      <StyledPickerButtonBody>{children}</StyledPickerButtonBody>
      <StyledPickerIndicator>
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
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:hover {
    border-color: var(--ma-gray-400);
  }

  &:active,
  &:focus {
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
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
`;

const PlaceholderText = styled.span`
  color: var(--ma-txt-black);
  opacity: 0.4;
`;

export { ClubPicker };
