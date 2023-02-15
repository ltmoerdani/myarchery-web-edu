import React from "react";
import { ArcherService } from "services";
import styled from "styled-components";
import { FieldInputText } from "./field-input-text";
import { SelectRadio } from "./select-radio";
import CreatableSelect from "react-select/async-creatable";
const DetailsParticipant = ({ formOrder, userProfile, eventDetailData }) => {
  const {
    setNumberOfTeam,
    setGenderTeam,
    setListParticipants,
    setSelectCategoriesUser,
    setMultiParticipants,
  } = formOrder;
  const {
    selectCategoriesType,
    selectClassCategories,
    genderOfTeam,
    asParticipant,
    numberOfTeam,
    listParticipants,
    isCollective,
    category,
    club,
    city_id,
    multiParticipants,
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

  const [userRegisteredIndividu, setUserRegisteredIndividu] =
    React.useState(null);
  const [checkInputEmail, setCheckInputEmail] = React.useState("");
  const [multiEmail, setMultiEmail] = React.useState([]);

  const checkIndivualParticipant = async (
    category = [],
    selectCategoriesType,
    genderOfTeam,
    eventDetailData,
    club,
    city_id
  ) => {
    if (club || city_id) {
      if (selectCategoriesType !== "individual") {
        const payload = {};
        payload.event_id = eventDetailData?.id;
        if (eventDetailData?.withContingent === 1) {
          payload.club_or_city_id = city_id?.value ?? 0;
        } else {
          payload.club_or_city_id = club?.detail?.id ?? 0;
        }
        if (selectCategoriesType === "team") {
          const filterCategory =
            category &&
            category?.data?.filter(
              (value) => value.genderCategory === genderOfTeam
            );
          setSelectCategoriesUser(filterCategory[0]);
          payload.category_id = filterCategory && filterCategory[0]?.id;
        } else if (selectCategoriesType === "mix") {
          const filterCategory =
            category &&
            category?.data?.filter((value) => value.genderCategory === "mix");
          setSelectCategoriesUser(filterCategory[0]);
          payload.category_id = filterCategory && filterCategory[0]?.id;
        }
        const result = await ArcherService.getIndividualParticipant(payload);
        setUserRegisteredIndividu(result?.data);
      }
    }
  };
  const numberUserAvailable = React.useMemo(() => {
    let memberNum = 0;
    if (numberOfTeam >= 1) {
      memberNum = numberOfTeam * 3;
      if (memberNum >= userRegisteredIndividu?.length) {
        return userRegisteredIndividu;
      } else {
        const takeMemberByNumberTeam =
          userRegisteredIndividu && userRegisteredIndividu?.slice(0, memberNum);
        return takeMemberByNumberTeam;
      }
    }
  }, [numberOfTeam]);
  React.useEffect(() => {
    if (selectCategoriesType !== "individual" && selectClassCategories) {
      checkIndivualParticipant(
        category,
        selectCategoriesType,
        genderOfTeam,
        eventDetailData,
        club,
        city_id
      );
      if (numberOfTeam > 0) {
        setListParticipants(userRegisteredIndividu);
      }
    }
    return () => {};
  }, [
    category,
    selectCategoriesType,
    genderOfTeam,
    eventDetailData,
    club,
    city_id,
    numberOfTeam,
  ]);
  const handleKeyDown = (e) => {
    if (!checkInputEmail) return;
    switch (e.code) {
      case "Enter":
      case "Tab":
      case "Space":
        setMultiEmail((prev) => [
          ...prev,
          { value: checkInputEmail, label: checkInputEmail },
        ]);
        setCheckInputEmail("");
        e.preventDefault();
    }
  };
  React.useEffect(() => {
    if (multiEmail?.length) {
      setMultiParticipants(multiEmail);
    }
  }, [multiEmail]);

  return (
    <div>
      {isCollective ? (
        <CreatableSelect
          cacheOptions
          defaultOptions
          isMulti
          isClearable
          components={{ DropdownIndicator: null }}
          menuIsOpen={false}
          onChange={(val) => setMultiEmail(val)}
          onInputChange={(val) => setCheckInputEmail(val)}
          value={multiParticipants ?? multiEmail}
          inputValue={checkInputEmail}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <>
          {selectCategoriesType !== "team" && selectCategoriesType !== "mix" ? (
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
                      disabled={
                        !selectClassCategories || selectCategoriesType === "mix"
                      }
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
                {(numberOfTeam >= 1 && numberUserAvailable?.length < 3) ||
                numberOfTeam * 3 > numberUserAvailable?.length ? (
                  <ValidationError>
                    {selectCategoriesType === "team" &&
                    numberOfTeam * 3 > numberUserAvailable?.length
                      ? "Jumlah kuota melebihi jumlah peserta yang terdaftar"
                      : selectCategoriesType === "mix" &&
                        numberOfTeam * 2 > numberUserAvailable?.length
                      ? "Jumlah peserta terdaftar tidak mencukupi, beregu harus terdiri dari 3 peserta"
                      : null}
                  </ValidationError>
                ) : null}
              </SplitFieldItem>
            </SplitFields>
          )}
        </>
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
    flex: 0 0 20.75rem;
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

const ValidationError = styled.span`
  color: #e11900;
  font-weight: 400;
  font-size: 12px;
`;

export default DetailsParticipant;
