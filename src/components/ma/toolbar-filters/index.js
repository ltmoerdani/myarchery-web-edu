import * as React from "react";
import styled from "styled-components";

import { FilterProvider, useFilters } from "./contexts/filters";

import classnames from "classnames";

function ToolbarFilter({ children, categories, isLoading = false, onChange, viewLeft, viewRight }) {
  if (!categories?.length && isLoading) {
    return (
      <React.Fragment>
        <ToolbarEmptyCategory>
          <div>Memuat data...</div>
        </ToolbarEmptyCategory>
        {children}
      </React.Fragment>
    );
  }

  if (!categories?.length) {
    return (
      <React.Fragment>
        <ToolbarEmptyCategory>
          <div>Kategori tidak tersedia</div>
        </ToolbarEmptyCategory>
        {children}
      </React.Fragment>
    );
  }

  return (
    <FilterProvider categories={categories} onChange={onChange}>
      <FilterControl viewLeft={viewLeft} viewRight={viewRight} />
      {children}
    </FilterProvider>
  );
}

function FilterControl({ viewLeft, viewRight }) {
  const { tabId } = useFilters();
  return (
    <div>
      <ToolbarHeader>
        <Tabs />
      </ToolbarHeader>

      <ToolbarBody key={tabId}>
        {viewLeft || <DefaultKnobsView />}

        <div>{viewRight}</div>
      </ToolbarBody>
    </div>
  );
}

function Tabs() {
  const { optionsTab, tabId, setTabId } = useFilters();
  return (
    <TabButtonList>
      {optionsTab?.map((option) => (
        <li key={option.value}>
          <TabButton
            className={classnames({ "tab-active": option.value === tabId })}
            onClick={() => setTabId(option.value)}
          >
            {option.label}
          </TabButton>
        </li>
      ))}
    </TabButtonList>
  );
}

function DefaultKnobsView() {
  return (
    <KnobGroupLayout>
      <KnobsClassCategories />
      <KnobsTeamCategories />
    </KnobGroupLayout>
  );
}

function KnobsClassCategories() {
  const { classCategoryId, getKnobOptionsByType, setClassCategory } = useFilters();
  const optionsClass = getKnobOptionsByType("classCategory");
  return (
    <Knobs
      label="Kelas"
      options={optionsClass}
      activeKnobId={classCategoryId}
      onChange={(knobId) => setClassCategory(knobId)}
    />
  );
}

function KnobsTeamCategories({ shouldHideOption }) {
  const { classCategoryId, teamCategoryId, getKnobOptionsByType, setTeamCategory } = useFilters();
  const optionsTeam = getKnobOptionsByType("teamCategory");

  const handleHideOption = React.useCallback(
    (option) => {
      const hasNoParentClassCategory = !option.relatedClasses.some(
        (parentClassCategory) => parentClassCategory === classCategoryId
      );
      return hasNoParentClassCategory || shouldHideOption?.(option);
    },
    [shouldHideOption, classCategoryId]
  );

  return (
    <Knobs
      label="Jenis Regu"
      options={optionsTeam}
      activeKnobId={teamCategoryId}
      onChange={(knobId) => setTeamCategory(knobId)}
      shouldHideOption={handleHideOption}
    />
  );
}

function Knobs({
  label = "Label",
  labelIsHidden = false,
  options,
  activeKnobId,
  onChange,
  shouldDisableOption,
  shouldHideOption,
  knobButtonStyle,
}) {
  const getActiveClassName = (value) => {
    const isActive = value === activeKnobId;
    return classnames({ "filter-item-active": isActive });
  };
  return (
    <KnobWrapper>
      {!labelIsHidden && <KnobLabel>{label}:</KnobLabel>}
      <KnobList>
        {options?.length > 0 ? (
          options
            .filter((option) => {
              return typeof shouldHideOption === "function" ? !shouldHideOption(option) : true;
            })
            .map((option, index) => (
              <li key={index}>
                <ButtonKnobItem
                  className={getActiveClassName(option.value)}
                  style={knobButtonStyle}
                  onClick={() => onChange?.(option.value)}
                  disabled={
                    typeof shouldDisableOption === "function"
                      ? shouldDisableOption(option)
                      : undefined
                  }
                >
                  {option.label}
                </ButtonKnobItem>
              </li>
            ))
        ) : (
          <li>Pilihan filter tidak tersedia</li>
        )}
      </KnobList>
    </KnobWrapper>
  );
}

/* ====================================== */
// styles

const ToolbarEmptyCategory = styled.div`
  margin-bottom: 0.25rem;
  background-color: #ffffff;
  padding: 1.5rem;
  color: var(--ma-gray-400);
  font-weight: 600;
  text-align: center;
`;

const ToolbarHeader = styled.div`
  margin-bottom: 0.25rem;
  background-color: #ffffff;
`;

const TabButtonList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;

  > * {
    flex-grow: 1;
  }
`;

const TabButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: none;
  background-color: #ffffff;
  color: var(--ma-blue);
  font-weight: 500;

  position: relative;

  &::after {
    content: " ";
    display: block;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 5px;

    transform: scaleX(0);
    transition: all 0.2s;
  }

  &:hover {
    &::after {
      background-color: var(--ma-yellow);
      transform: scaleX(1);
    }
  }

  &.tab-active {
    &::after {
      background-color: var(--ma-yellow);
      transform: scaleX(1);
    }
  }
`;

const KnobWrapper = styled.div`
  display: flex;
  align-items: center;
  min-height: 2rem;

  > *:nth-child(1) {
    flex-shrink: 0;
    min-width: 6.25rem;
  }

  > *:nth-child(2) {
    flex-grow: 1;
  }
`;

const KnobLabel = styled.div`
  color: var(--ma-txt-black);
  font-weight: 600;
`;

const KnobList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

const ButtonKnobItem = styled.button`
  transition: all 0.15s;

  &,
  &:active,
  &:focus,
  &:focus-visible {
    padding: 0.25rem 0.5rem;
    border: solid 1px var(--ma-blue-400);
    border-radius: 0.5rem;
    background-color: transparent;

    color: var(--ma-blue-400);
    font-weight: 600;

    &.filter-item-active {
      background-color: var(--ma-primary-blue-50);
      border-color: var(--ma-blue);
      box-shadow: 0 0 0 1px var(--ma-blue);
      color: var(--ma-blue);
    }
  }

  &:hover {
    background-color: var(--ma-primary-blue-50);
  }

  &:disabled {
    background-color: var(--ma-gray-200);
    border: solid 1px var(--ma-gray-200);
    color: var(--ma-gray-400);
  }
`;

const ToolbarBody = styled.div`
  background-color: #ffffff;

  display: flex;

  > *:nth-child(1) {
    flex-grow: 1;
    padding: 1.5rem;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
    margin-top: auto;
    padding: 1.5rem;
  }
`;

const KnobGroupLayout = styled.div`
  > * + * {
    margin-top: 0.625rem;
  }
`;

export {
  ToolbarFilter,
  DefaultKnobsView,
  KnobGroupLayout,
  KnobsClassCategories,
  KnobsTeamCategories,
  Knobs,
  useFilters,
  FilterProvider,
};
