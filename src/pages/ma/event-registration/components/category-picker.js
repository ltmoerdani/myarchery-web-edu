import * as React from "react";
import styled from "styled-components";
import classnames from "classnames";

import { Modal, ModalBody } from "reactstrap";
import { ButtonBlue } from "components/ma";
import { FieldErrorMessage } from "./field-error-message";

import IconChevronDown from "components/ma/icons/mono/chevron-down";

function EventCategoryPicker({ placeholder = "Pilih kategori lomba", value, errors, ...props }) {
  const [isPickerOpen, setPickerOpen] = React.useState(false);
  return (
    <div>
      <PickerButton
        onClick={() => setPickerOpen(true)}
        className={classnames({ "field-invalid": errors?.length })}
      >
        {value?.categoryLabel || <CategoryPlaceholder>{placeholder}</CategoryPlaceholder>}
      </PickerButton>
      <FieldErrorMessage errors={errors} />

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

function PickerButton({ children, onClick, className }) {
  return (
    <StyledPickerButton className={className} onClick={onClick}>
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

  &.field-invalid {
    border-color: var(--ma-red);
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

const CategoryPlaceholder = styled.span`
  color: var(--ma-txt-black);
  opacity: 0.4;
`;

function PickerControl({
  groupedOptions: groupedCategories = {},
  value,
  onChange,
  toggle,
  onClosed,
}) {
  const filters = React.useMemo(() => makeTeamCategoriesFilters(groupedCategories), []);
  const [selectedFilter, setSelectedFilter] = React.useState(() =>
    getInitialFilter(filters, value?.teamCategoryId)
  );

  const handleSelectCategory = (category) => onChange?.(category);

  return (
    <StyledBSModal size="xl" isOpen toggle={toggle} onClosed={onClosed}>
      {groupedCategories && filters?.length ? (
        <StyledBSModalBody>
          <div>
            <h5>Kategori Lomba</h5>
            <p>Silakan pilih salah satu kategori</p>
          </div>

          <TeamFilterList>
            {filters.map((filter) => (
              <TeamFilterItem key={filter.value}>
                <input
                  type="radio"
                  id={`filter-item-${filter.value}`}
                  className="filter-item-radio"
                  name={`filter-item`}
                  value={filter?.value || ""}
                  checked={selectedFilter === filter.value}
                  onChange={() => setSelectedFilter(filter.value)}
                />
                <TeamFilterBadge htmlFor={`filter-item-${filter.value}`}>
                  {filter.label}
                </TeamFilterBadge>
              </TeamFilterItem>
            ))}
          </TeamFilterList>

          <CategoryGrid>
            {groupedCategories[selectedFilter].map((category) => {
              const isQuotaAvailable = Number(category.totalParticipant) < Number(category.quota);
              const shouldOptionDisabled = !isQuotaAvailable || !category.isOpen;
              return (
                <CategoryItem key={category.id}>
                  <input
                    type="radio"
                    id={`category-item-${category.id}`}
                    className="category-item-radio"
                    name="categoryId"
                    value={category.id || ""}
                    checked={value?.id === category.id}
                    onChange={() => handleSelectCategory(category)}
                    disabled={shouldOptionDisabled}
                  />
                  <CategoryItemLabel
                    htmlFor={`category-item-${category.id}`}
                    className={classnames({ "not-available": shouldOptionDisabled })}
                  >
                    <h5 className="category-name">{category.categoryLabel}</h5>
                    <div>
                      {!category.isOpen ? (
                        <QuotaLabelMuted>Belum dibuka</QuotaLabelMuted>
                      ) : isQuotaAvailable ? (
                        <QuotaLabel>
                          {category.totalParticipant}&#47;{category.quota}
                        </QuotaLabel>
                      ) : (
                        <QuotaLabelMuted>Habis</QuotaLabelMuted>
                      )}
                    </div>
                  </CategoryItemLabel>
                </CategoryItem>
              );
            })}
          </CategoryGrid>

          <div className="float-end">
            <ButtonBlue onClick={onClosed}>Tutup</ButtonBlue>
          </div>
        </StyledBSModalBody>
      ) : (
        <StyledBSModalBody>
          <p>Pilihan kategori tidak tersedia</p>
          <div className="float-end">
            <ButtonBlue onClick={onClosed}>Tutup</ButtonBlue>
          </div>
        </StyledBSModalBody>
      )}
    </StyledBSModal>
  );
}

const StyledBSModal = styled(Modal)`
  .modal-content {
    border-radius: 1.25rem;
  }
`;

const StyledBSModalBody = styled(ModalBody)`
  padding: 1.5rem 1.25rem;
  font-family: "Inter", sans-serif;
`;

const TeamFilterList = styled.ul`
  display: flex;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
`;

const TeamFilterItem = styled.li`
  ${TeamFilterList} > & {
    position: relative;
    overflow: hidden;

    .filter-item-radio {
      position: absolute;
      top: 0;
      left: -2000px;
      visibility: hidden;
    }
  }
`;

const TeamFilterBadge = styled.label`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  border: solid 1px var(--ma-blue);
  color: var(--ma-blue);

  .filter-item-radio:checked + & {
    background-color: var(--ma-blue);
    color: #ffffff;
  }
`;

const CategoryGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  list-style: none;
  padding: 0;
`;

const CategoryItem = styled.li`
  ${CategoryGrid} > & {
    position: relative;
    overflow: hidden;

    .category-item-radio {
      position: absolute;
      top: 0;
      left: -2000px;
      visibility: hidden;
    }
  }
`;

const CategoryItemLabel = styled.label`
  width: 100%;
  height: 100%;
  padding: 1rem;
  border: solid 1px var(--ma-gray-100);
  border-radius: 0.25rem;

  .category-name {
    font-weight: 600;
  }

  &.not-available {
    background-color: var(--ma-gray-80);

    .category-name {
      color: var(--ma-gray-400);
    }
  }

  .category-item-radio:checked + & {
    border-color: var(--ma-blue-primary-50);
    background-color: var(--ma-blue-primary-50);

    .category-name {
      color: var(--ma-blue);
    }
  }
`;

const QuotaLabel = styled.span`
  margin: 0;
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 2rem;
  background-color: #aeddc2;
`;

const QuotaLabelMuted = styled.span`
  margin: 0;
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 2rem;
  background-color: var(--ma-gray-50);
  color: var(--ma-gray-400);
`;

function makeTeamCategoriesFilters(data) {
  if (!data) {
    return [];
  }

  const teamCategories = {
    "individu male": "Individu Putra",
    "individu female": "Individu Putri",
    maleTeam: "Beregu Putra",
    femaleTeam: "Beregu Putri",
    mixTeam: "Beregu Campuran",
  };
  const filterOptions = [];
  for (const groupId in data) {
    filterOptions.push({
      value: groupId,
      label: teamCategories[groupId],
    });
  }
  return filterOptions;
}

function getInitialFilter(filters, teamCategoryId) {
  if (teamCategoryId) {
    const filterBelongsToCategory = (filter) => filter.value === snakeToCamelCase(teamCategoryId);
    const filter = filters.find(filterBelongsToCategory);
    return filter.value;
  }
  return filters[0]?.value;
}

function snakeToCamelCase(string) {
  const segments = string.split("_");
  if (segments.length < 2) {
    return string;
  }

  const transformedSegments = segments.map((segment, index) => {
    if (index > 0) {
      const capitalized = Array.from(segment);
      capitalized[0] = capitalized[0].toUpperCase();
      return capitalized.join("");
    }
    return segment;
  });
  const camelCaseKey = transformedSegments.filter((s) => Boolean(s)).join("");
  return camelCaseKey;
}

export { EventCategoryPicker };
