import { DateInput, TextInput } from "components";
import React from "react";
import styled from "styled-components";
import { stringUtil } from "utils";
import Select from "react-select";
import {
  checkVerification,
  useQuotaVerification,
} from "../../hooks/check-verification";
import IconCheckVerify from "components/ma/icons/color/check-verify";
import IconAlertCircle from "components/ma/icons/color/alert-circle";
import IconDeleteTrash from "components/ma/icons/color/delete-trash";
import { Button, ButtonBlue } from "components/ma";
import {
  listAllCity,
  listAllCountry,
  listAllProvince,
} from "../../hooks/country";

export const PopupWarning = ({ children, showPopup }) => {
  return <>{showPopup ? <PopupWrapper>{children}</PopupWrapper> : null}</>;
};

const PopupWrapper = styled.div`
  position: absolute;
  background: white;
  margin-bottom: -70px;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 9px 9px 25px -3px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 9px 9px 25px -3px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 9px 9px 25px -3px rgba(0, 0, 0, 0.3);
`;

const SingleListParticipant = ({
  formOrder,
  wizardView,
  eventDetailData,
  userProfile,
}) => {
  const defaultCountry = {
    id: 102,
    name: "Indonesia",
    label: "Indonesia",
    value: "Indonesia",
  };
  const headTable = [
    "No",
    "Email",
    "Nama",
    "Gender",
    "Tanggal Lahir",
    "Kewarganegaraan",
    "Provinsi",
    "Kota",
    "Memenuhi Syarat",
  ];
  const genderList = [
    {
      value: "male",
      label: "male",
    },
    {
      value: "female",
      label: "female",
    },
  ];
  const { goToStep, goToPreviousStep, goToNextStep } = wizardView;
  const { setDataParticipants, setSelectCategoriesUser } = formOrder;
  const { listParticipants, registrationType, category, asParticipant } =
    formOrder.data;
  const [showPopup, setShowPopup] = React.useState([]);
  const [countryList, setCountryList] = React.useState([]);
  const [provinceList, setProvinceList] = React.useState([]);
  const [cityList, setCityList] = React.useState([]);
  const [fullNameUser, setFullNameUser] = React.useState("");
  const [genderUser, setGenderUser] = React.useState("");
  const [dateBirthUser, setDateBirthUser] = React.useState("");
  const [countryUser, setCountryUser] = React.useState(defaultCountry);
  const [inputProvince, setInputProvince] = React.useState({});
  const [provinceUser, setProvinceUser] = React.useState("");
  const [cityUser, setCityUser] = React.useState("");
  const [categorySelect, setCategorySelect] = React.useState(null);
  const [userVerification, setUserVerification] = React.useState(null);
  const [quotaMale, quotaFemale] = useQuotaVerification(
    category,
    listParticipants
  );
  const allCountry = async () => {
    const data = await listAllCountry();
    setCountryList(data);
    return data;
  };
  const allProvince = async (countryUser, keyword) => {
    const data = await listAllProvince(countryUser, keyword);
    if (data?.length || countryUser?.id) {
      setProvinceList(data);
    }
  };
  const allCity = async (countryUser, province) => {
    const data = await listAllCity(countryUser, province);
    if (data?.length || countryUser?.id) {
      setCityList(data);
    }
  };
  const handleOptionChangeProvince = (value) => {
    setInputProvince(value);
    setShowPopup([]);
  };
  const handleOptionChangeCity = () => {
    setShowPopup([]);
  };
  // const test = groupParticipant(listParticipants);
  const handleChangeName = (val) => {
    setFullNameUser(val.value);
    setShowPopup([]);
  };
  const handleChangeGender = (val) => {
    setGenderUser(val.value);
    const check = checkCategory(val.value, category);
    setCategorySelect(check);
    setShowPopup([]);
  };
  const handleChangeDateBirth = (val) => {
    setDateBirthUser(val.value);
    setShowPopup([]);
  };
  const [notRegisterSingleParticipant] = listParticipants.map((e) => {
    if (
      e.city ||
      e.date_of_birth ||
      e.gender ||
      e.name ||
      e.country ||
      e.province
    ) {
      return true;
    } else {
      return false;
    }
  });
  const handleNextToOrder = async () => {
    const participant = [];
    if (asParticipant === false) {
      const user = listParticipants[0];
      const temp = {};
      temp.email = user.email;
      temp.event_category_id = categorySelect[0]?.id;
      temp.name = user.name?.length ? user.name : fullNameUser;
      temp.gender = user.gender?.length ? user.gender : genderUser;
      temp.date_of_birth = user.date_of_birth?.length
        ? user.date_of_birth
        : dateBirthUser;
      temp.country_id = user?.country?.id
        ? user?.country?.id
        : countryUser?.id ?? 0; //belum fix
      temp.province_id = user?.province?.id ?? provinceUser?.id;
      temp.city_id = user?.city?.id ?? cityUser?.id ?? 0;
      participant.push(temp);
      setDataParticipants(participant);
    } else {
      const temp = {};
      const user = listParticipants[0];
      temp.email = user.email;
      temp.event_category_id = categorySelect[0]?.id;
      temp.name = user.name;
      temp.gender = user.gender;
      temp.date_of_birth = user.date_of_birth;
      temp.country_id = user.country?.id;
      temp.province_id = user.province?.id ?? provinceUser?.id ?? 0;
      temp.city_id = user.city?.id ?? cityUser?.id ?? 0;
      participant.push(temp);
      setDataParticipants(participant);
    }
    goToNextStep();
  };

  React.useEffect(() => {
    if (!asParticipant) {
      const newParticipant = {};
      newParticipant.name = fullNameUser;
      newParticipant.email = listParticipants[0].email;
      newParticipant.gender = genderUser;
      newParticipant.date_of_birth = dateBirthUser;
      newParticipant.country = countryUser?.name;
      newParticipant.province = provinceUser?.name;
      newParticipant.city = cityUser?.name;

      if (
        listParticipants[0]?.email !== userProfile?.email &&
        listParticipants[0]?.gender &&
        listParticipants[0]?.name &&
        listParticipants[0]?.date_of_birth
      ) {
        const filterCategory = category?.data?.filter(
          (e) => e.genderCategory === listParticipants[0]?.gender
        );
        setCategorySelect(filterCategory);
        setSelectCategoriesUser(...filterCategory);
        const checkUserVerification = checkVerification(
          listParticipants,
          category,
          eventDetailData
        );
        setUserVerification(checkUserVerification);
      } else {
        const filterCategory = category?.data?.filter(
          (e) => e.genderCategory === genderUser
        );
        setCategorySelect(filterCategory);
        setSelectCategoriesUser(...filterCategory);
        const newUserVerification = checkVerification(
          [newParticipant],
          category,
          eventDetailData
        );
        setUserVerification(newUserVerification);
      }
    } else {
      const checkUserVerification = checkVerification(
        listParticipants,
        category,
        eventDetailData
      );
      setUserVerification(checkUserVerification);
    }
  }, [
    fullNameUser,
    genderUser,
    dateBirthUser,
    countryUser?.name,
    provinceUser?.name,
    cityUser?.name,
    asParticipant,
  ]);

  React.useEffect(() => {
    if (!listParticipants?.length || !registrationType) {
      goToStep(1);
    }
    if (asParticipant) {
      const filterCategory = category?.data?.filter(
        (e) => e.genderCategory === listParticipants[0]?.gender
      );
      setCategorySelect(filterCategory);
      setSelectCategoriesUser(...filterCategory);
    }
    allCountry();
    if (countryUser) {
      if (inputProvince?.length) {
        allProvince(countryUser, inputProvince);
      }
      if (provinceUser) {
        allCity(countryUser, provinceUser);
      }
    }
    return () => {
      setCountryList([]);
      setProvinceList([]);
      setCityList([]);
    };
  }, [
    listParticipants,
    registrationType,
    countryUser,
    inputProvince,
    countryUser,
    provinceUser,
    asParticipant,
  ]);
  const shouldDisabledButton =
    userVerification?.length &&
    (!userVerification[0]?.ageIsValid ||
      !userVerification[0]?.genderIsValid ||
      !userVerification[0]?.quoteIsValid);
  quotaFemale === 0 || quotaMale === 0;
  return (
    <ContentCard>
      <HeaderTitleText className="margin-single">
        {!notRegisterSingleParticipant
          ? "Email Belum Terdaftar"
          : "Email Sudah Terdaftar"}
      </HeaderTitleText>
      <TableListParticipant className="list-table-participant">
        <thead>
          <tr>
            {headTable.map((e, idx) => (
              <th key={stringUtil.createRandom()}>
                {idx === 4
                  ? listParticipants[0]?.date_of_birth
                    ? "Usia"
                    : e
                  : e}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {listParticipants.length &&
            listParticipants.map((e, i) => (
              <tr key={e.email}>
                <td>{i + 1}</td>
                <td>
                  <TableCellText>{e.email}</TableCellText>
                </td>
                <td>
                  <TableCellText className="name-field">
                    {e.name?.length ? (
                      <>{e.name}</>
                    ) : (
                      <TextInput
                        placeholder={"Nama"}
                        name="fullname-field"
                        value={fullNameUser}
                        onChange={handleChangeName}
                      />
                    )}
                  </TableCellText>
                </td>
                <td>
                  <div>
                    {!e.gender ? (
                      <div style={{ width: "120px" }}>
                        <Select
                          options={genderList}
                          placeholder={"gender"}
                          defaultValue={genderUser}
                          onChange={handleChangeGender}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "60px",
                          paddingLeft: 2,
                          textTransform: "capitalize",
                        }}
                      >
                        {e.gender}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div>
                    {!e.date_of_birth ? (
                      <div style={{ width: "120px" }}>
                        <DateInput
                          placeholder={"DD/MM/YY"}
                          value={dateBirthUser}
                          onChange={handleChangeDateBirth}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "60px",
                          paddingLeft: 2,
                          textTransform: "capitalize",
                        }}
                      >
                        {Math.floor(
                          (new Date() - new Date(e.date_of_birth).getTime()) /
                            3.15576e10
                        )}{" "}
                        Tahun
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div>
                    {!e.country ? (
                      <div style={{ width: "144px" }}>
                        <Select
                          options={countryList}
                          defaultValue={countryUser}
                          onChange={(val) => setCountryUser(val)}
                          placeholder={"kewarganegaraan"}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "80px",
                          paddingLeft: 2,
                          textTransform: "capitalize",
                        }}
                      >
                        {e.country?.name}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div>
                    {!e.province ? (
                      <div style={{ width: "134px" }}>
                        <Select
                          options={provinceList ?? []}
                          onInputChange={handleOptionChangeProvince}
                          value={provinceUser ?? ""}
                          onChange={(val) => setProvinceUser(val)}
                          placeholder={"provinsi"}
                          style={{ height: "50px" }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "80px",
                          paddingLeft: 2,
                          textTransform: "capitalize",
                        }}
                      >
                        {e.province?.name ?? "-"}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ width: "134px" }}>
                    {!e.city ? (
                      <Select
                        options={cityList}
                        placeholder={"kota"}
                        value={cityUser ?? ""}
                        onInputChange={handleOptionChangeCity}
                        onChange={(val) => setCityUser(val)}
                      />
                    ) : (
                      <>{e.city?.name ?? "-"}</>
                    )}
                  </div>
                </td>
                <td>
                  {userVerification && (
                    <VerifyWrapper>
                      <VerifyBox>
                        {userVerification[i]?.ageIsValid &&
                        userVerification[i]?.genderIsValid &&
                        userVerification[i]?.quoteIsValid ? (
                          <IconCheckVerify />
                        ) : (
                          <div
                            onClick={() => {
                              if (i === 0) {
                                setShowPopup((value) => [
                                  { id: i, show: !value[i]?.show },
                                ]);
                              }
                            }}
                          >
                            <IconAlertCircle />
                          </div>
                        )}
                      </VerifyBox>
                      {userVerification?.length !== 1 ? (
                        <VerifyBox>
                          <IconDeleteTrash />
                        </VerifyBox>
                      ) : null}
                      {userVerification[i]?.userEmail === e.email ||
                      showPopup[i]?.id === i ? (
                        <PopupWarning
                          showPopup={
                            showPopup[i]?.id === i ? showPopup[i]?.show : null
                          }
                        >
                          {!userVerification[i]?.ageIsValid
                            ? "umur tidak sesuai"
                            : !userVerification[i]?.genderIsValid
                            ? "gender tidak sesuai"
                            : !userVerification[i]?.quoteIsValid
                            ? "kuota tidak tersedia"
                            : ""}
                        </PopupWarning>
                      ) : null}
                    </VerifyWrapper>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </TableListParticipant>
      <ButtonSectionWrapper>
        <Button
          style={{
            backgroundColor: "transparent",
            border: "1px solid #0D47A1",
            padding: "8px 16px",
            borderRadius: "8px",
            color: "#0D47A1",
            fontWeight: 600,
            fontSize: "14px",
          }}
          onClick={() => goToPreviousStep()}
        >
          Kembali
        </Button>
        <ButtonBlue disabled={shouldDisabledButton} onClick={handleNextToOrder}>
          Selanjutnya
        </ButtonBlue>
      </ButtonSectionWrapper>
    </ContentCard>
  );
};

const ContentCard = styled.div`
  margin-bottom: 1rem;
  padding: 1.5rem;
  padding-bottom: 2.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

export const TableListParticipant = styled.table`
  width: 100%;
  min-height: 50vh;
  border-collapse: separate;
  border-spacing: 0 0.25rem;
  display: block;
  overflow: auto;
  &.list-table-participant {
    &::-webkit-scrollbar {
      height: 5px;
      background: #eff2f7;
    }
    &::-webkit-scrollbar-track {
      border-radius: 20px;
    }
    ::-webkit-scrollbar-thumb {
      background: #c0c0c0;
      border-radius: 20px;
    }
  }

  th,
  td {
    cursor: auto;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  thead > tr > th {
    padding: 0.75rem;
    background-color: var(--ma-primary-blue-50);
  }

  tbody > tr > td {
    padding: 0.8125rem 0.625rem;
    background-color: #ffffff;
    font-size: 0.875em;
    border-bottom: 2px solid #eff2f7;

    .css-1okebmr-indicatorSeparator {
      background-color: white;
    }
  }
`;

export const TableCellText = styled.div`
  width: 156px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &.name-field {
    width: 80px;
  }
`;

const VerifyWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
  position: relative;
`;

const VerifyBox = styled.div`
  width: 1.125rem;
  height: 1.125rem;
  position: relative;
`;

export const HeaderTitleText = styled.div`
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1rem;
  background: #e7edf6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.margin-single {
    margin-bottom: 15px;
  }
`;

const ButtonSectionWrapper = styled.span`
  margin-bottom: 2.875rem;
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
`;

const checkCategory = (gender, category) => {
  if (!gender) return;
  const filterCategory = category?.data?.filter(
    (e) => e.genderCategory === gender
  );
  return filterCategory;
};

export default SingleListParticipant;
