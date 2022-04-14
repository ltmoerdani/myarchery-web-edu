import * as React from "react";
import styled from "styled-components";
import { useMedia } from "hooks/media";

import { Modal, ModalBody } from "reactstrap";

import IconChevronDown from "components/ma/icons/mono/chevron-down";

import classnames from "classnames";

function CategoryFilterChooser({ breakpoint = "min-width: 961px", ...props }) {
  const isAbove960 = useMedia([`(${breakpoint})`], [true]);

  if (isAbove960) {
    return <ChooserAsSidebar {...props} />;
  }
  return <ChooserMobile {...props} />;
}

function ChooserAsSidebar({
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
            <ChooserNoOption>{noOptionMessage || "Belum ada kategori"}</ChooserNoOption>
          </div>
        ) : (
          options.map((option, index) => (
            <div key={option.id || option.label || index}>
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

const ChooserNoOption = styled.span`
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

function ChooserMobile({ title = "Kategori", options = [], selected, onChange, noOptionMessage }) {
  const { id } = selected || {};
  const [optionSelected, setOptionSelected] = React.useState(selected || {});
  const [isOptionsOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!id) {
      return;
    }
    setOptionSelected(selected);
  }, [id]);

  return (
    <div>
      <ChooserMobileButton onClick={() => setIsOpen(true)}>
        <span>{optionSelected?.label || title}</span>
        <span>
          <IconChevronDown size="16" />
        </span>
      </ChooserMobileButton>

      {isOptionsOpen && (
        <Modal
          isOpen
          size="sm"
          centered
          onClosed={() => setIsOpen(false)}
          toggle={() => setIsOpen((open) => !open)}
        >
          <ModalBody>
            <ChooserHeader>{title}</ChooserHeader>
            <div>
              {!options?.length ? (
                <div>
                  <ChooserOption>{noOptionMessage || "Belum ada kategori"}</ChooserOption>
                </div>
              ) : (
                options.map((option, index) => (
                  <div key={option.id || option.label || index}>
                    <ChooserOption
                      className={classnames({ "option-selected": option.id === optionSelected.id })}
                      disabled={option.id === optionSelected.id}
                      onClick={() => {
                        setOptionSelected(option);
                        onChange?.(option);
                        setIsOpen(false);
                      }}
                    >
                      {option.label}
                    </ChooserOption>
                  </div>
                ))
              )}
            </div>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}

const ChooserMobileButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  overflow: hidden;
  border: none;
  border-radius: 0.5rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0.5px rgba(0, 0, 0, 0.05);

  &:hover {
    box-shadow: 0 2px 4px 0.5px rgba(0, 0, 0, 0.15);
  }

  color: var(--ma-blue);
  font-weight: 600;
  text-transform: capitalize;
  text-align: left;
`;

export { CategoryFilterChooser };
