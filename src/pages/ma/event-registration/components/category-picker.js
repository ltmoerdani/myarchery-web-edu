import * as React from "react";
import styled from "styled-components";

import { Modal, ModalBody } from "reactstrap";
import { ButtonBlue } from "components/ma";

function EventCategoryPicker({ placeholder = "Pilih kategori lomba", value, ...props }) {
  const [isPickerOpen, setPickerOpen] = React.useState(false);
  return (
    <div>
      <PickerButton onClick={() => setPickerOpen(true)}>
        {value?.categoryLabel || <CategoryPlaceholder>{placeholder}</CategoryPlaceholder>}
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
    <StyledBSModal size="lg" isOpen toggle={toggle} onClosed={onClosed}>
      {groupedCategories && filters?.length ? (
        <StyledBSModalBody>
          <div>
            <h5>Kategori Lomba</h5>
            <p>Silakan pilih salah satu kategori</p>
          </div>

          <TeamFilterList>
            {filters.map((filter) => (
              <li key={filter.value}>
                <TeamFilterBadge htmlFor={`filter-item-${filter.value}`}>
                  <input
                    type="radio"
                    id={`filter-item-${filter.value}`}
                    name={`filter-item`}
                    value={filter?.value || ""}
                    checked={selectedFilter === filter.value}
                    onChange={() => setSelectedFilter(filter.value)}
                  />
                  {filter.label}
                </TeamFilterBadge>
              </li>
            ))}
          </TeamFilterList>

          <CategoryGrid>
            {groupedCategories[selectedFilter].map((category) => (
              <li key={category.id}>
                <CategoryItem>
                  <input
                    type="radio"
                    name="categoryId"
                    value={category.id || ""}
                    checked={value?.id === category.id}
                    onChange={() => handleSelectCategory(category)}
                  />
                  {category.categoryLabel}
                </CategoryItem>
              </li>
            ))}
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

const TeamFilterBadge = styled.label`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  border: solid 1px var(--ma-blue);
  color: var(--ma-blue);
`;

const CategoryGrid = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
`;

const CategoryItem = styled.label`
  padding: 1rem;
  border: solid 1px var(--ma-gray-100);
  border-radius: 0.25rem;
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
