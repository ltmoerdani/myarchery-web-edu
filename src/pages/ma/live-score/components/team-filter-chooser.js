import * as React from "react";
import styled from "styled-components";

import classnames from "classnames";

function TeamFilterChooser({ options, selected, onSelect }) {
  return options?.map((filter, index) => (
    <ButtonTeamFilter
      key={filter.id}
      className={classnames({ "filter-selected": selected.id === filter.id })}
      onClick={() => onSelect(index)}
    >
      {filter.label}
    </ButtonTeamFilter>
  ));
}

const ButtonTeamFilter = styled.button`
  &,
  &:focus,
  &:active {
    padding: 0.75rem 1rem;
    border: solid 1px var(--ma-primary-blue-50);
    border-radius: 0.5rem;
    background-color: var(--ma-primary-blue-50);
    color: var(--ma-blue);
    font-size: 0.875em;

    @media (min-width: 721px) {
      padding: 0.5rem 0.75rem;
    }
  }

  white-space: nowrap;
  transition: border-color 0.1s, background-color 0.1s;

  &.filter-selected {
    border: solid 1px var(--ma-secondary);
    background-color: var(--ma-secondary);
  }
`;

export { TeamFilterChooser };
