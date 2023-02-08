import React from "react";
import styled from "styled-components";
import { FieldInputText } from "./field-input-text";
import { SelectRadio } from "./select-radio";
const DetailsParticipant = ({ formOrder, userProfile }) => {
  const { setNumberOfTeam, setGenderTeam, setListParticipants } = formOrder;
  const {
    selectCategoriesType,
    selectClassCategories,
    genderOfTeam,
    asParticipant,
    numberOfTeam,
    listParticipants,
  } = formOrder.data;
  const handleChangeEmail = (val) => {
    const data = {
      email: val,
      name: "",
      gender: "",
      dateBirth: "",
      nationality: "",
      province: "",
      city: "",
    };
    setListParticipants([data]);
  };

  return (
    <div>
      {selectCategoriesType !== "team" ? (
        <SplitFields>
          <SplitFieldItem>
            <FieldInputText
              placeholder="Email"
              type={"email"}
              disabled={asParticipant ? true : false}
              value={
                asParticipant === true
                  ? userProfile?.email
                  : listParticipants && listParticipants[0]?.email
              }
              onChange={handleChangeEmail}
            >
              Email
            </FieldInputText>
          </SplitFieldItem>
        </SplitFields>
      ) : (
        <SplitFields>
          <SplitFieldItem className="details-participant-wrapper">
            <SelectRadioSectionWrapper>
              <SelectRadioSectionBox className="details-participant">
                <SelectRadioTitle>
                  Pendaftar ikut sebagai peserta?
                </SelectRadioTitle>
                <SelectRadio
                  disabled={!selectClassCategories}
                  options={[
                    { value: "male", label: "Beregu Putra" },
                    { value: "female", label: "Beregu Putri" },
                  ]}
                  defaultValue={genderOfTeam}
                  value={genderOfTeam}
                  onChange={setGenderTeam}
                />
              </SelectRadioSectionBox>
            </SelectRadioSectionWrapper>
          </SplitFieldItem>
          <SplitFieldItem>
            <FieldInputText
              placeholder="Masukan jumlah tim"
              value={numberOfTeam}
              defaultValue={numberOfTeam}
              onChange={setNumberOfTeam}
              disabled={!selectClassCategories}
              type={"number"}
            >
              Jumlah tim yang didaftarkan
            </FieldInputText>
          </SplitFieldItem>
        </SplitFields>
      )}
    </div>
  );
};

const SplitFields = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.375rem;
`;

const SplitFieldItem = styled.div`
  flex: 1 1 13.75rem;

  &.details-participant-wrapper {
    flex: 0 0 27.75rem;
  }
`;

const SelectRadioSectionWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  gap: 1.25rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
`;

const SelectRadioSectionBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  @media (max-width: 992px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
  &.details-participant {
    align-items: start;
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const SelectRadioTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1c1c1c;
`;

export default DetailsParticipant;
