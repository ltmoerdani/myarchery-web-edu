import React from "react";
import { ArcherService } from "services";
import { stringUtil } from "utils";
import styled from "styled-components";
import { Button, ButtonBlue } from "components/ma";
import IconDeleteTrash from "components/ma/icons/color/delete-trash";
import IconAlertCircle from "components/ma/icons/color/alert-circle";
import {
  PopupWarning,
  TableCellText,
  TableListParticipant,
  HeaderTitleText,
} from "./single-list-participant";
import IconCheckVerify from "components/ma/icons/color/check-verify";
import Select from "react-select";
import { DateInput, TextInput } from "components";
import { useCountry } from "../../hooks/country";
import {
  checkVerification,
  useQuotaVerification,
} from "../../hooks/check-verification";
import { Modal, ModalBody } from "reactstrap";
import TriangleWarningIcon from "components/ma/icons/color/triangle-warning";

const ModalDelete = ({ setShowModal, showModal, handleDeleteUser }) => {
  return (
    <StyledBSModal
      size="xl"
      isOpen={showModal}
      onClosed={() => setShowModal(false)}
      centered
    >
      <StyledBSModalBody>
        <WarningBox>
          <TriangleWarningIcon />
          <WarningModalTitle>
            Apakah Anda yakin akan menghapus peserta?
          </WarningModalTitle>
        </WarningBox>
        <ModalButtonWrapper>
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
            onClick={() => setShowModal(false)}
          >
            Tidak, kembali
          </Button>
          <ButtonBlue onClick={handleDeleteUser}>Iya, hapus</ButtonBlue>
        </ModalButtonWrapper>
      </StyledBSModalBody>
    </StyledBSModal>
  );
};

const ModalButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
`;

const StyledBSModal = styled(Modal)`
  .modal-content {
    border-radius: 1.25rem;
    width: 400px;
  }
`;

const StyledBSModalBody = styled(ModalBody)`
  font-family: "Inter", sans-serif;
  margin: auto auto;
`;

const WarningBox = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 24px;
`;

const WarningModalTitle = styled.span`
  font-weight: 400;
  font-size: 16px;
`;

const MultipleTableLayout = ({
  userData = [],
  category,
  eventDetailData,
  formOrder,
  isForEmailRegistered,
  userProfile,
}) => {
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
  const defaultCountry = {
    id: 102,
    name: "Indonesia",
    label: "Indonesia",
    value: "Indonesia",
  };
  const {
    setDataParticipants,
    setMultiParticipants,
    setEmailNotRegisteredList,
    setEmailRegisteredList,
    setAsParticipant,
  } = formOrder;
  const { dataParticipant, multiParticipants } = formOrder.data;
  const [showPopup, setShowPopup] = React.useState(null);
  const [showModalDelete, setShowModalDelete] = React.useState(false);
  const [idDelete, setIdDelete] = React.useState(null);
  const [userVerification, setUserVerification] = React.useState([]);
  const [countryInput, setCountryInput] = React.useState("Indonesia");
  const [selectCountry, setSelectCountry] = React.useState([]);
  const [provinceInput, setProvinceInput] = React.useState("");
  const [selectProvince, setSelectProvince] = React.useState([]);
  const [cityInput, setCityInput] = React.useState("");
  const [, setSelectCity] = React.useState([]);
  const [countryList, provinceList, cityList] = useCountry(
    countryInput,
    selectCountry,
    provinceInput,
    selectProvince,
    cityInput
  );
  const handleChangeName = (obj, id) => {
    const changeMultiUserData = multiParticipants.map((user) => {
      if (user?.id?.toString() === id.toString()) {
        return {
          ...user,
          name: obj.value,
        };
      } else {
        return { ...user };
      }
    });
    setMultiParticipants(changeMultiUserData);
  };
  const handleChangeGender = (obj, id) => {
    const changeMultiUserData = multiParticipants.map((user) => {
      if (user?.id?.toString() === id.toString()) {
        return {
          ...user,
          gender: obj.value,
          genderSelect: { value: obj.value, label: obj.value },
        };
      } else {
        return { ...user };
      }
    });
    setMultiParticipants(changeMultiUserData);
  };
  const handleChangeDateBirth = (obj, id) => {
    const changeMultiUserData = multiParticipants.map((user) => {
      if (user?.id?.toString() === id.toString()) {
        return {
          ...user,
          dateOfBirth: obj.value,
        };
      } else {
        return { ...user };
      }
    });
    setMultiParticipants(changeMultiUserData);
  };

  const handleChangeCountry = (val, id) => {
    const changeMultiUserData = multiParticipants?.map((participant) => {
      if (participant?.id?.toString() === id.toString()) {
        return {
          ...participant,
          country: {
            id: val.id,
            name: val.name,
            value: val.name,
            label: val.name,
          },
        };
      } else {
        return { ...participant };
      }
    });
    setMultiParticipants(changeMultiUserData);

    if (selectCountry?.length) {
      const checkUserHasBeenSelectCountry = selectCountry?.filter(
        (e) => e.idUser?.toString() === id.toString()
      );
      if (checkUserHasBeenSelectCountry?.length) {
        const countryData = selectCountry?.map((e) => {
          if (e.idUser?.toString() === id.toString()) {
            return { idUser: id, ...val };
          } else {
            return { ...e };
          }
        });
        setSelectCountry(countryData);
      } else {
        setSelectCountry([...selectCountry, { idUser: id, ...val }]);
      }
    } else {
      setSelectCountry([{ idUser: id, ...val }]);
    }
  };

  const handleInputChangeCountry = (val) => {
    setCountryInput(val);
  };

  const handleChangeProvince = (val, id) => {
    const changeMultiUserData = multiParticipants?.map((participant) => {
      if (participant?.id?.toString() === id.toString()) {
        return {
          ...participant,
          province: {
            id: val.id,
            name: val.name,
            value: val.name,
            label: val.name,
          },
        };
      } else {
        return { ...participant };
      }
    });
    setMultiParticipants(changeMultiUserData);

    if (selectProvince?.length) {
      const checkUserHasBeenSelectProvince = selectProvince.filter(
        (e) => e.idUser?.toString() === id.toString()
      );
      if (checkUserHasBeenSelectProvince?.length) {
        const provinceData = selectProvince?.map((e) => {
          if (e.idUser?.toString() === id.toString()) {
            return { idUser: id, ...val };
          } else {
            return { ...e };
          }
        });
        setSelectProvince(provinceData);
      } else {
        setSelectProvince([...selectProvince, { idUser: id, ...val }]);
      }
    } else {
      setSelectProvince([{ idUser: id, ...val }]);
    }
  };

  const handleInputChangeProvince = (val) => {
    setProvinceInput(val);
  };

  const handleChangeCity = (val, id) => {
    const changeMultiUserData = multiParticipants?.map((participant) => {
      if (participant?.id?.toString() === id.toString()) {
        return {
          ...participant,
          city: {
            id: val.id,
            name: val.name,
            value: val.name,
            label: val.name,
          },
        };
      } else {
        return { ...participant };
      }
    });

    setMultiParticipants(changeMultiUserData);
    setSelectCity(val);
  };

  const handleInputChangeCity = (val) => {
    setCityInput(val);
  };
  const handleDeleteUser = () => {
    const deleteLocalUser = userData?.filter((e) => e.id !== idDelete?.id);
    const deleteFromDataState = dataParticipant?.filter(
      (e) => e.id !== idDelete?.id
    );
    const deleteFromMultiData = multiParticipants?.filter(
      (e) => e.value !== idDelete?.email
    );
    if (isForEmailRegistered) {
      setEmailRegisteredList(deleteLocalUser);
    } else {
      setEmailNotRegisteredList(deleteLocalUser);
    }
    if (userProfile?.email === idDelete?.email) {
      setAsParticipant(false);
    }
    setDataParticipants(deleteFromDataState);
    setMultiParticipants(deleteFromMultiData);
    setShowModalDelete(false);
  };

  const customStylesSelect = {
    option: (base) => ({
      ...base,
      height: 5,
      minHeight: 35,
    }),
  };

  React.useEffect(() => {
    const checkRegisterVerification = checkVerification(
      userData,
      category,
      eventDetailData
    );
    setUserVerification(checkRegisterVerification);
  }, [userData, category, eventDetailData]);
  React.useEffect(() => {
    if (!selectCountry?.length) {
      const defaultForCountry = userData?.map((e) => {
        return { idUser: e.id, ...defaultCountry };
      });
      setSelectCountry(defaultForCountry);
    }
  }, [selectCountry?.length, userData]);
  return (
    <div>
      <TableListParticipant className="list-table-participant">
        <thead>
          <tr>
            {headTable.map((e, idx) => (
              <th key={stringUtil.createRandom()}>
                {idx === 4 ? (isForEmailRegistered ? "Usia" : e) : e}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {userData?.length &&
            userData?.map((e, i) => {
              return (
                <tr key={e.email}>
                  <td>{i + 1}</td>
                  <td>
                    <TableCellText>{e.email}</TableCellText>
                  </td>
                  <td>
                    <div>
                      {isForEmailRegistered ? (
                        <TableCellText className="name-field">
                          <>{e.name}</>
                        </TableCellText>
                      ) : (
                        <TableCellText>
                          <TextInput
                            placeholder={"Nama"}
                            name="fullname-field"
                            value={e.name ?? ""}
                            onChange={(obj) => handleChangeName(obj, e.id)}
                          />
                        </TableCellText>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      {!isForEmailRegistered ? (
                        <div style={{ width: "100px" }}>
                          <Select
                            options={genderList}
                            placeholder={"gender"}
                            value={e.genderSelect ?? ""}
                            onChange={(obj) => handleChangeGender(obj, e.id)}
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
                      {!isForEmailRegistered ? (
                        <div style={{ width: "200px" }}>
                          <DateInput
                            placeholder={"DD/MM/YY"}
                            value={e.dateOfBirth ?? ""}
                            onChange={(obj) => handleChangeDateBirth(obj, e.id)}
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
                            (new Date() - new Date(e.dateOfBirth).getTime()) /
                              3.15576e10
                          )}{" "}
                          Tahun
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      {!isForEmailRegistered ? (
                        <div style={{ width: "200px" }}>
                          <Select
                            maxMenuHeight={170}
                            options={countryList}
                            value={e.country}
                            onChange={(val) => handleChangeCountry(val, e.id)}
                            onInputChange={(e) =>
                              handleInputChangeCountry(e, i)
                            }
                            placeholder={"Kewarganegaraan"}
                            styles={customStylesSelect}
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
                      {!isForEmailRegistered ? (
                        <div style={{ width: "200px" }}>
                          <Select
                            options={provinceList[i]?.provinceList ?? []}
                            onChange={(val) => handleChangeProvince(val, e.id)}
                            onInputChange={(val) =>
                              handleInputChangeProvince(val, i)
                            }
                            placeholder={"provinsi"}
                            styles={customStylesSelect}
                          />
                        </div>
                      ) : e.province?.name?.length ? (
                        <div
                          style={{
                            width: "80px",
                            paddingLeft: 2,
                            textTransform: "capitalize",
                          }}
                        >
                          {e.province?.name ?? "-"}
                        </div>
                      ) : (
                        <div style={{ width: "134px" }}>
                          <Select
                            options={provinceList[i]?.provinceList ?? []}
                            onChange={(val) => handleChangeProvince(val, e.id)}
                            onInputChange={(val) =>
                              handleInputChangeProvince(val, i)
                            }
                            placeholder={"provinsi"}
                            styles={customStylesSelect}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      {!isForEmailRegistered ? (
                        <div style={{ width: "200px" }}>
                          <Select
                            options={cityList[i]?.cityList ?? []}
                            placeholder={"kota"}
                            value={
                              cityList[i]?.cityList?.length ? e.city ?? "" : ""
                            }
                            onInputChange={(val) =>
                              handleInputChangeCity(val, e.id)
                            }
                            onChange={(val) => handleChangeCity(val, e.id)}
                            styles={customStylesSelect}
                          />
                        </div>
                      ) : e.city?.name?.length ? (
                        <>{e.city?.name ?? "-"}</>
                      ) : (
                        <div style={{ width: "200px" }}>
                          <Select
                            options={cityList[i]?.cityList ?? []}
                            placeholder={"kota"}
                            onInputChange={(val) =>
                              handleInputChangeCity(val, e.id)
                            }
                            onChange={(val) => handleChangeCity(val, e.id)}
                            styles={customStylesSelect}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      {userVerification.length && (
                        <VerifyWrapper>
                          <VerifyBox>
                            {userVerification[i]?.ageIsValid &&
                            userVerification[i]?.genderIsValid &&
                            userVerification[i]?.quoteIsValid ? (
                              <IconCheckVerify />
                            ) : (
                              <div
                                className="btn-verify"
                                onClick={() => {
                                  if (showPopup?.show) {
                                    setShowPopup({ id: i, show: false });
                                  } else {
                                    setShowPopup({ id: i, show: true });
                                  }
                                }}
                              >
                                <IconAlertCircle />
                              </div>
                            )}
                          </VerifyBox>
                          <VerifyBox>
                            <div
                              className="btn-verify"
                              aria-hidden="true"
                              onClick={() => {
                                setShowModalDelete(true);
                                setIdDelete({ id: e.id, email: e.email });
                              }}
                            >
                              <IconDeleteTrash />
                            </div>
                          </VerifyBox>
                          {showPopup?.id === i ? (
                            <PopupWarning
                              showPopup={
                                showPopup && showPopup?.id === i
                                  ? showPopup?.show
                                  : null
                              }
                            >
                              {!userVerification[showPopup?.id]?.genderIsValid
                                ? "Gender harus diinput"
                                : !userVerification[showPopup?.id]?.ageIsValid
                                ? "Umur tidak sesuai"
                                : !userVerification[showPopup?.id]?.quoteIsValid
                                ? "Kuota tidak tersedia"
                                : ""}
                            </PopupWarning>
                          ) : null}
                        </VerifyWrapper>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
        {showModalDelete ? (
          <ModalDelete
            setShowModal={setShowModalDelete}
            handleDeleteUser={() => handleDeleteUser()}
            showModal={showModalDelete}
          />
        ) : null}
      </TableListParticipant>
    </div>
  );
};

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

const MultiListParticipant = ({
  formOrder,
  wizardView,
  eventDetailData,
  userProfile,
}) => {
  const {
    multiParticipants,
    category,
    emailRegisteredList,
    emailNotRegisteredList,
    dataParticipant,
  } = formOrder.data;
  const {
    setDataParticipants,
    setEmailRegisteredList,
    setEmailNotRegisteredList,
  } = formOrder;
  const { goToPreviousStep, goToNextStep } = wizardView;
  const [user, setUser] = React.useState({});
  const [verifyAllValidUser, setVerifyAllValidUser] = React.useState([]);
  const [quotaMale, quotaFemale] = useQuotaVerification(
    category,
    dataParticipant
  );
  React.useEffect(() => {
    const checkValidData = checkVerification(
      dataParticipant,
      category,
      eventDetailData
    );
    const checkDataFormCategory = checkValidData?.map((e) => {
      if (e.genderIsValid && e.quoteIsValid && e.ageIsValid) {
        return true;
      } else {
        return false;
      }
    });
    const checkDetailData = dataParticipant?.map((e) => {
      if (e.name && e.gender && e.email && e.date_of_birth && e.country_id) {
        return true;
      } else {
        return false;
      }
    });
    const validData = checkDataFormCategory.every(Boolean);
    const validDetailData = checkDetailData.every(Boolean);
    setVerifyAllValidUser(validData && validDetailData);
  }, [dataParticipant, category]);
  React.useEffect(() => {
    if (multiParticipants?.length) {
      const checkEmail = async () => {
        const data = await checkEmailIsRegistered(multiParticipants);
        setUser(data);
      };
      checkEmail();
    }
  }, [multiParticipants]);

  React.useEffect(() => {
    if (user) {
      const dataRegister = user?.emailRegister;
      const dataNotRegister = user?.emailNotRegister;
      const emailRegister = dataRegister?.filter(
        (e) =>
          multiParticipants &&
          multiParticipants?.find((el) => el.email === e.email)
      );
      const emailNotRegister = multiParticipants.filter((e) =>
        dataNotRegister?.find((el) => el.email === e.email)
      );
      const emailNotRegisterWithCountry = emailNotRegister.map((e) => {
        if (e.country?.id) {
          return {
            ...e,
          };
        } else {
          return {
            ...e,
            country: {
              id: 102,
              name: "Indonesia",
              label: "Indonesia",
              value: "Indonesia",
            },
          };
        }
      });
      if (emailRegister?.length || emailNotRegisterWithCountry?.length) {
        const mergeDataUser = [
          ...emailRegister,
          ...emailNotRegisterWithCountry,
        ];
        //convert data sesuai dengan payload
        const dataUserRegister = mergeDataUser?.map((participant) => {
          const categoryUser = checkCategory(participant.gender, category);
          return {
            id: participant.id,
            email: participant.email,
            event_category_id: categoryUser && categoryUser[0]?.id,
            name: participant.name,
            gender: participant.gender,
            date_of_birth: participant.dateOfBirth,
            country_id: participant.country?.id ?? 0,
            province_id: participant.province?.id ?? 0,
            city_id: participant.city?.id ?? 0,
          };
        });
        setDataParticipants(dataUserRegister);
      }
      setEmailRegisteredList(emailRegister);
      setEmailNotRegisteredList(emailNotRegisterWithCountry);
    }
  }, [user, multiParticipants, category]);
  return (
    <TableContentWrapper>
      {emailRegisteredList?.length || emailNotRegisteredList?.length ? (
        <>
          {emailRegisteredList?.length ? (
            <>
              <HeaderTitleText>
                <span>Email Sudah Terdaftar</span>
                <QuoteTextHeader>
                  {emailRegisteredList?.length + " Peserta"}
                </QuoteTextHeader>
              </HeaderTitleText>
              <MultipleTableLayout
                category={category}
                eventDetailData={eventDetailData}
                userData={emailRegisteredList}
                formOrder={formOrder}
                isForEmailRegistered
                userProfile={userProfile}
              />
            </>
          ) : null}
          {emailNotRegisteredList?.length ? (
            <>
              <HeaderTitleText>
                <span>Email Belum Terdaftar</span>
                <QuoteTextHeader>
                  {emailNotRegisteredList?.length + " Peserta"}
                </QuoteTextHeader>
              </HeaderTitleText>
              <MultipleTableLayout
                category={category}
                eventDetailData={eventDetailData}
                userData={emailNotRegisteredList}
                formOrder={formOrder}
              />
            </>
          ) : null}
        </>
      ) : (
        <EmptyBox>Tidak ada data</EmptyBox>
      )}
      {quotaFemale === 0 || quotaMale === 0 ? (
        <div>
          <WarningText>
            {quotaMale === 0 && quotaFemale === 0
              ? "Kuota Gender Pria dan Wanita Sudah Penuh"
              : quotaMale === 0
              ? "Kuota Gender Pria Sudah Penuh"
              : quotaFemale === 0
              ? "Kuota Gender Wanita Sudah Penuh"
              : ""}
          </WarningText>
        </div>
      ) : null}
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
        <ButtonBlue
          disabled={
            !verifyAllValidUser ||
            (!emailRegisteredList?.length && !emailNotRegisteredList?.length) ||
            quotaMale === 0 ||
            quotaFemale === 0
          }
          onClick={() => {
            goToNextStep();
          }}
        >
          Selanjutnya
        </ButtonBlue>
      </ButtonSectionWrapper>
    </TableContentWrapper>
  );
};

const WarningText = styled.span`
  color: red;
  font-size: 12px;
  font-weight: 400;
`;

const EmptyBox = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
`;

const QuoteTextHeader = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: #757575;
`;

const TableContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ButtonSectionWrapper = styled.div`
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

const checkEmailIsRegistered = async (dataUser = []) => {
  const emailRegister = [];
  const emailNotRegister = [];
  if (dataUser.length) {
    const listEmailUser = dataUser.map((el) => {
      return el.email;
    });
    const result = await ArcherService.checkEmailRegistered({
      emails: listEmailUser,
    });

    for (let index in result?.data) {
      if (result?.data[index]?.data !== null) {
        emailRegister.push(result?.data[index]?.data);
      } else {
        emailNotRegister.push({
          id: dataUser[index]?.id,
          email: result?.data[index]?.message.split(" ")[1],
        });
      }
    }
  }
  return { emailRegister, emailNotRegister };
};

export default MultiListParticipant;
