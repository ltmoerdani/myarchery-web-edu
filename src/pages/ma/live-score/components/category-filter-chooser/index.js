import * as React from "react";
import styled from "styled-components";

import classnames from "classnames";

function CategoryFilterChooser({
  title = "Kategori",
  options = [],
  selected,
  onChange,
  noOptionMessage,
}) {
  const { id } = selected || {};
  const [optionSelected, setOptionSelected] = React.useState(selected || {});

  React.useEffect(() => {
    if (!id) {
      return;
    }
    setOptionSelected(selected);
  }, [id]);

  return (
    <StyledWrapper>
      <ChooserHeader>{title}</ChooserHeader>
      <div>
        {!options?.length ? (
          <div>
            <ChooserOption>{noOptionMessage || "Belum ada kategori"}</ChooserOption>
          </div>
        ) : (
          options.map((option) => (
            <div key={option.id}>
              <ChooserOption
                className={classnames({ "option-selected": option.id === optionSelected.id })}
                disabled={option.id === optionSelected.id}
                onClick={() => {
                  setOptionSelected(option);
                  onChange?.(option);
                }}
              >
                {option.label}
              </ChooserOption>
            </div>
          ))
        )}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  padding: 0.5rem 0;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const ChooserHeader = styled.div`
  padding: 0.5rem 1.125rem;
  color: var(--ma-blue);
  text-transform: capitalize;
  font-weight: 600;
`;

const ChooserOption = styled.button`
  display: block;
  width: 100%;
  padding: 0.5rem 1.125rem;
  border: none;
  background-color: transparent;
  color: var(--ma-gray-400);
  text-align: left;
  text-transform: capitalize;
  font-size: 0.875em;

  transition: padding 0.3s, color 0.3s;

  &:hover {
    padding-left: 1.25rem;
    color: var(--ma-blue);
  }

  &.option-selected:disabled {
    padding-left: 2.125rem;
    color: var(--ma-blue);
  }
`;

export { CategoryFilterChooser };