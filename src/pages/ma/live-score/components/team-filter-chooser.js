import * as React from "react";
import styled from "styled-components";

import classnames from "classnames";

function TeamFilterChooser({ options, selected, onSelect }) {
  if (!options?.length) {
    return null;
  }
  return options?.map((option) => (
    <ButtonTeamFilter
      key={option.id}
      className={classnames({ "filter-selected": selected === option.id })}
      onClick={() => onSelect?.(option)}
    >
      {option.label}
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
