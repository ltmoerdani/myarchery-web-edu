import * as React from "react";
import styled from "styled-components";
import IconSearch from "components/ma/icons/Search";

const EventEmptyCardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  min-height: 240px;
  border-radius: 8px;
  border: dashed 2px var(--ma-gray-400);

  background-color: #ffffff;
  transition: all 0.4s;

  .action-icon {
    color: var(--ma-gray-400);
    transition: all 0.4s;
  }

  &:hover {
    border: dashed 2px var(--ma-gray-500);

    .action-icon {
      color: var(--ma-gray-500);
    }
  }
`;

function EventEmptyCard() {
  return (
    <EventEmptyCardWrapper>
      <span className="action-icon">
        <IconSearch size="56" />
      </span>
    </EventEmptyCardWrapper>
  );
}

export default EventEmptyCard;
