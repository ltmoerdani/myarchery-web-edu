import React from "react";
import Select from "react-select";
import styled from "styled-components";
import { useCategorySelect } from "../hooks/categories";

const CategorySelect = ({
  formOrder,
  filterClassCategoryGroup,
  dataClass,
  handleChangeSelect,
  selectClassRef,
  selectTypeRef,
  eventCategories,
}) => {
  console.log("dataClass:", dataClass);
  const {
    category,
    selectCategoriesType,
    selectCategoryTab,
    selectClassCategories,
  } = formOrder.data;
  const [competitionCategoryTypeMenu, teamCategoriesType] = useCategorySelect(
    eventCategories,
    selectCategoryTab
  );
  const optionMenu = [
    { id: "categoryField", label: "Kategori", name: "category" },
    { id: "teamField", label: "Jenis Regu", name: "team" },
    {
      id: "classCategoryField",
      label: "Kelas dan Jarak",
      name: "classCategory",
    },
    {
      id: "quoteCategoryField",
      label: "Kuota Tersedia",
      name: "quoteCategory",
    },
  ];

  const tabDefaultValue = React.useMemo(() => {
    let result;
    if (selectCategoryTab) {
      result =
        competitionCategoryTypeMenu &&
        competitionCategoryTypeMenu?.filter(
          (e) => e.value === selectCategoryTab
        );
    }
    return result;
  }, [selectCategoryTab, competitionCategoryTypeMenu]);
  const tpyeDefaultValue = React.useMemo(() => {
    let result;
    if (selectCategoriesType && teamCategoriesType) {
      result = teamCategoriesType?.filter(
        (e) => e.value === selectCategoriesType
      );
    }
    return result;
  }, [selectCategoriesType, teamCategoriesType]);
  const classDefaultValue = React.useMemo(() => {
    let result;
    if (category?.value) {
      result = filterClassCategoryGroup.filter(
        (e) => e.value === category?.value
      );
    }
    return result || [];
  }, [category?.value]);

  console.log("optionMenu:", optionMenu);

  return (
    <OptionSectionWrapper>
      {optionMenu.map((option, idx) => {
        const isQuotaAvailable =
          Number(dataClass?.femaleParticipant) <
            Number(dataClass?.femaleQuota) ||
          Number(dataClass?.maleParticipant) < Number(dataClass?.maleQuota) ||
          Number(dataClass?.mixParticipant) < Number(dataClass?.mixQuota);
        const shouldOptionDisabled =
          dataClass?.femaleCanRegister === 0 ||
          dataClass?.maleCanRegister === 0 ||
          dataClass?.mixCanRegister === 0 ||
          !isQuotaAvailable ||
          ((dataClass?.femaleIsOpen === false ||
            dataClass?.maleIsOpen === false) &&
            dataClass?.mixIsOpen === false);
        return (
          <OptionBoxWrapper key={option.id}>
            <OptionBoxTitle>{option.label}</OptionBoxTitle>
            {idx !== optionMenu.length - 1 ? (
              <>
                {idx === 2 ? (
                  <Select
                    ref={selectClassRef}
                    isDisabled={!selectCategoriesType || !selectCategoryTab}
                    onChange={(param) => handleChangeSelect(param, idx)}
                    placeholder={"Pilih Kelas dan Jarak..."}
                    options={filterClassCategoryGroup ?? []}
                    defaultValue={classDefaultValue ?? ""}
                    noOptionsMessage={() => "Tidak ada kelas tersedia"}
                  />
                ) : (
                  <Select
                    ref={idx === 1 ? selectTypeRef : undefined}
                    isDisabled={!selectCategoryTab && idx !== 0 ? true : false}
                    onChange={(param) => handleChangeSelect(param, idx)}
                    placeholder={
                      idx === 0 ? "Pilih Kategori..." : "Pilih Jenis Regu..."
                    }
                    value={
                      idx === 0 ? tabDefaultValue ?? "" : tpyeDefaultValue ?? ""
                    }
                    options={
                      idx === 0
                        ? competitionCategoryTypeMenu
                        : idx === 1
                        ? teamCategoriesType
                        : []
                    }
                  />
                )}
              </>
            ) : (
              <QuotaLabel>
                {(dataClass?.femaleIsOpen === false ||
                  dataClass?.maleIsOpen === false) &&
                dataClass?.mixIsOpen === false ? (
                  <QuotaLabelMuted>Belum dibuka</QuotaLabelMuted>
                ) : isQuotaAvailable ? (
                  <QuotaLabel>
                    {selectCategoriesType !== "mix" ? (
                      <>
                        {(dataClass?.maleParticipant !== null &&
                          dataClass?.maleQuota !== null) ||
                        (dataClass?.maleParticipant !== undefined &&
                          dataClass?.maleQuota !== undefined) ? (
                          <QuotaLabelText
                            className={
                              shouldOptionDisabled ? "label-muted" : undefined
                            }
                          >
                            Putra{" "}
                            {!dataClass.maleQuota
                              ? 0
                              : dataClass.maleQuota == dataClass.maleParticipant
                              ? 0
                              : dataClass.maleQuota - dataClass.maleParticipant}
                            &#47;
                            {dataClass?.maleQuota}
                          </QuotaLabelText>
                        ) : null}
                        {(dataClass?.femaleParticipant !== null &&
                          dataClass?.femaleQuota !== null) ||
                        (dataClass?.femaleParticipant !== undefined &&
                          dataClass?.femaleQuota !== undefined) ? (
                          <QuotaLabelText
                            className={
                              shouldOptionDisabled ? "label-muted" : undefined
                            }
                          >
                            Putri{" "}
                            {!dataClass.maleQuota
                              ? 0
                              : dataClass.femaleQuota ==
                                dataClass.femaleParticipant
                              ? 0
                              : dataClass.femaleQuota -
                                dataClass.femaleParticipant}
                            &#47;
                            {dataClass?.femaleQuota}
                          </QuotaLabelText>
                        ) : null}
                      </>
                    ) : (
                      <QuotaLabelText
                        className={
                          shouldOptionDisabled ? "label-muted" : undefined
                        }
                      >
                        {!dataClass.mixQuota
                          ? 0
                          : dataClass.mixQuota == dataClass.mixParticipant
                          ? 0
                          : dataClass.mixQuota - dataClass.mixParticipant}
                        &#47;
                        {dataClass?.mixQuota}
                        {/* {dataClass?.mixParticipant}&#47;
                        {dataClass?.mixQuota} */}
                      </QuotaLabelText>
                    )}
                  </QuotaLabel>
                ) : (
                  <>
                    {selectClassCategories && selectCategoriesType ? (
                      <QuotaLabelMuted>Habis</QuotaLabelMuted>
                    ) : (
                      <QuotaLabelMuted>
                        Tidak ada kategori dipilih
                      </QuotaLabelMuted>
                    )}
                  </>
                )}
              </QuotaLabel>
            )}
          </OptionBoxWrapper>
        );
      })}
    </OptionSectionWrapper>
  );
};

/* ================================= */
// style
const OptionSectionWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const OptionBoxWrapper = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const OptionBoxTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  color: #1c1c1c;
`;

const QuotaLabel = styled.span`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 2.375rem;
`;

const QuotaLabelText = styled.span`
  margin: 0;
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 2rem;
  background-color: #aeddc2;

  &.label-muted {
    background-color: var(--ma-gray-50);
    color: var(--ma-gray-400);
  }
`;

const QuotaLabelMuted = styled.span`
  margin: 0;
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 2rem;
  background-color: var(--ma-gray-50);
  color: var(--ma-gray-400);
`;

/* ================================ */
// Utils

export default CategorySelect;
