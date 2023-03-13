import React from "react";
import { ArcherService } from "services";
import styled from "styled-components";
import { FieldInputText } from "./field-input-text";
import { SelectRadio } from "./select-radio";
import CreatableSelect from "react-select/async-creatable";
import { stringUtil } from "utils";
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
    classificationEvent,
    provinceData,
    countryData,
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
  const [multiEmail, setMultiEmail] = React.useState(multiParticipants ?? []);
  const [errorEmail, setErrorEmail] = React.useState("");

  const checkIndivualParticipant = async (
    category = [],
    selectCategoriesType,
    genderOfTeam,
    eventDetailData,
    club,
    city_id,
    classificationEvent,
    provinceData,
    countryData
  ) => {
    if (club || city_id) {
      const payload = {
        classificationChildren:
          eventDetailData?.parentClassification > 5
            ? classificationEvent?.value || null
            : null,
        classificationCountryId:
          eventDetailData?.classificationCountryId ||
          countryData?.value ||
          null,
        classificationProvinceId:
          parseInt(
            eventDetailData?.classificationProvinceId || provinceData?.value
          ) || null,
        classificationCityId:
          eventDetailData?.parentClassification === 4
            ? city_id?.value ?? null
            : null,
        classification_club_id:
          eventDetailData?.parentClassification === 1
            ? club?.detail?.id ?? null
            : null,
      };
      payload.event_id = eventDetailData?.id;
      if (eventDetailData?.parentClassification === 4) {
        payload.club_or_city_id = city_id?.value ?? 0;
      } else if (eventDetailData?.parentClassification === 1) {
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
        city_id,
        classificationEvent,
        provinceData,
        countryData
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
    classificationEvent,
    provinceData,
    countryData,
  ]);
  const handleKeyDown = (e) => {
    if (!checkInputEmail) return;
    switch (e.code) {
      case "Enter":
      case "Tab":
      case "Space": {
        const patternEmail = /\S+@\S+\.\S+/;
        if (patternEmail.test(checkInputEmail)) {
          if (multiEmail?.length) {
            const checkEmailHasBeenAdd = multiEmail.filter(
              (e) => e.value === checkInputEmail
            );
            if (!checkEmailHasBeenAdd?.length) {
              setMultiEmail((prev) => [
                ...prev,
                {
                  id: stringUtil.createRandom(),
                  value: checkInputEmail,
                  label: checkInputEmail,
                  email: checkInputEmail,
                },
              ]);
            }
          } else {
            setMultiEmail([
              {
                id: stringUtil.createRandom(),
                value: checkInputEmail,
                label: checkInputEmail,
                email: checkInputEmail,
              },
            ]);
          }
          setCheckInputEmail("");
          setErrorEmail("");
        } else {
          setErrorEmail("Email tidak valid");
        }
        e.preventDefault();
      }
    }
  };
  React.useEffect(() => {
    if (multiEmail?.length) {
      if (multiEmail?.length === 20 && asParticipant) {
        const dataMulti = multiEmail;
        dataMulti.pop();
        setMultiEmail(dataMulti);
        setMultiParticipants([...dataMulti]);
      } else {
        setMultiParticipants([...multiEmail]);
      }
    } else {
      setMultiParticipants([]);
      setErrorEmail("");
    }
  }, [multiEmail, asParticipant, isCollective]);
  return (
    <div>
      {isCollective ? (
        <>
          {asParticipant ? (
            <>
              <FieldInputText
                placeholder="Email"
                type={"email"}
                disabled={true}
                value={userProfile?.email}
                onChange={handleChangeEmail}
              >
                <TextAddOthersHeader>Email Saya</TextAddOthersHeader>
              </FieldInputText>
              <div style={{ padding: "6px 0" }} />
            </>
          ) : null}
          <TextAddOthersHeader>
            <span>Masukkan email peserta yang didaftarkan</span>
            <span
              style={{ fontSize: "12px", color: "#757575", fontWeight: 400 }}
            >
              {multiEmail
                ? asParticipant
                  ? multiEmail?.length + 1 ?? 0
                  : multiEmail?.length
                : 0}{" "}
              Peserta
            </span>
          </TextAddOthersHeader>
          <CreatableSelect
            cacheOptions
            defaultOptions
            isMulti
            isClearable
            inputMode={["email"]}
            isSearchable={
              asParticipant
                ? !(multiEmail?.length + 1 >= 20)
                : !(multiEmail?.length >= 20)
            }
            components={{ DropdownIndicator: null }}
            menuIsOpen={false}
            onChange={(val) => setMultiEmail(val)}
            onInputChange={(val) => setCheckInputEmail(val)}
            value={
              multiEmail?.length === 20 && asParticipant
                ? multiEmail?.pop()
                : multiEmail
            }
            defaultValue={multiEmail}
            inputValue={checkInputEmail}
            onKeyDown={handleKeyDown}
          />
          {errorEmail.length ? <ErrorEmail>{errorEmail}</ErrorEmail> : null}
          <DescAddOthers>
            Anda dapat memasukkan email peserta yang belum memiliki akun
            MyArchery. Siapkan data pribadi peserta untuk diinput pada tahap
            selanjutnya.
          </DescAddOthers>
        </>
      ) : (
        <>
          {selectCategoriesType !== "team" && selectCategoriesType !== "mix" ? (
            <SplitFields>
              <SplitFieldItem>
                <FieldInputText
                  placeholder="Email"
                  type={"email"}
                  disabled={asParticipant ? true : false}
                  multiUser={!isCollective}
                  value={
                    asParticipant === true
                      ? userProfile?.email
                      : listParticipants && listParticipants[0]?.email
                  }
                  onChange={handleChangeEmail}
                >
                  <TextAddOthersHeader>
                    <span>
                      {asParticipant
                        ? "Email Saya"
                        : "Masukkan email peserta yang didaftarkan"}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#757575",
                        fontWeight: 400,
                      }}
                    >
                      {listParticipants && listParticipants[0]?.email
                        ? listParticipants?.length
                        : 0}{" "}
                      Peserta
                    </span>
                  </TextAddOthersHeader>
                </FieldInputText>
                {!asParticipant ? (
                  <DescAddOthers>
                    Anda dapat memasukkan email peserta yang belum memiliki akun
                    MyArchery. Siapkan data pribadi peserta untuk diinput pada
                    tahap selanjutnya.
                  </DescAddOthers>
                ) : null}
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
                      defaultValue={
                        selectCategoriesType !== "mix" ? genderOfTeam : ""
                      }
                      value={selectCategoriesType !== "mix" ? genderOfTeam : ""}
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

const ErrorEmail = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 10px;
`;

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

const TextAddOthersHeader = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #1c1c1c;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const DescAddOthers = styled.div`
  font-weight: 400;
  font-size: 12px;
  color: #757575;
  margin-top: 4px;
`;

export default DetailsParticipant;
