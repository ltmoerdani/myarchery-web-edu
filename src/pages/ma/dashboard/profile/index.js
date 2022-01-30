import React, { useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbDashboard } from "../components/breadcrumb";
import styled from "styled-components";
import IconCamera from "components/ma/icons/mono/camera";
import { DateInput, TextInput, NumberInput } from "components";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { ArcherService } from "services";
import { useHistory } from "react-router-dom";

import { Container, Row, Col, Label, Input, Button } from "reactstrap";

async function imageToBase64(imageFileRaw) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFileRaw);
    reader.onload = () => {
      const baseURL = reader.result;
      resolve(baseURL);
    };
  });
}

function PageProfileHome() {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const history = useHistory();

  const [profileData, setProfileData] = useState({});
  const [dataUpdate, setUpdateData] = useState({});
  const [toggle, setToggle] = useState(userProfile?.gender);
  // const [base64String, setBase64String] = useState("")

  const handleChooseImage = async (field, ev) => {
    if (!ev.target.files?.[0]) {
      return;
    }
    const imageRawData = ev.target.files[0];
    const stringAv = await imageToBase64(imageRawData);
    const imagePreviewUrl = URL.createObjectURL(imageRawData);
    setProfileData({
      [field]: { preview: imagePreviewUrl, raw: imageRawData, base64: stringAv },
    });
  };

  const updateAvatar = async () => {
    const { message, data, errors } = await ArcherService.updateAvatar(
      {
        avatar: profileData?.avatar?.base64,
      },
      { user_id: userProfile?.id }
    );
    if (!data) {
      console.log(message);
      console.log(errors);
    }
  };

  const hanleSubmitData = async () => {
    const { message, errors, data } = await ArcherService.updateProfile(
      {
        name: dataUpdate?.name ? dataUpdate?.name : userProfile?.name,
        date_of_birth: dataUpdate?.date_of_birth
          ? dataUpdate?.date_of_birth
          : userProfile?.dateOfBirth,
        gender: dataUpdate?.gender ? dataUpdate?.gender : userProfile?.gender,
        phone_number: dataUpdate?.phone_number
          ? dataUpdate?.phone_number
          : userProfile?.phoneNumber,
        club: dataUpdate?.club ? dataUpdate?.club : null,
      },
      { user_id: userProfile?.id }
    );
    if (!data) {
      console.log(message);
      console.log(errors);
    }
    history.push("/dashboard");
  };

  console.log(profileData);
  // console.log(dataUpdate)
  // console.log(userProfile)

  const handleInputName = (e) => {
    const payload = { ...dataUpdate };
    payload[e.key] = e.value;
    setUpdateData(payload);
  };
  const handleInputDate = (e) => {
    const payload = { ...dataUpdate };
    payload[e.key] = e.value;
    setUpdateData(payload);
  };
  const handlePhoneNumber = (e) => {
    const payload = { ...dataUpdate };
    payload[e.key] = e.value;
    setUpdateData(payload);
  };
  // const handleClub = (e) => {
  //     const payload = {...dataUpdate}
  //     payload[e.key] = e.value
  //     setUpdateData(payload)
  // }

  const handleRadio = (e) => {
    setUpdateData({ ...dataUpdate, gender: e.target.value });
  };

  const toggleChange = (e) => {
    setToggle(e.target.value ? e.target.value : userProfile?.gender);
  };

  console.log(userProfile);
  console.log(toggle)

  const breadcrumpCurrentPageLabel = "Profil";
  return (
    <ProfileWrapper>
      <React.Fragment>
        <MetaTags>
          <title>Profil Archer | MyArchery.id</title>
        </MetaTags>
        <Container fluid>
          <BreadcrumbDashboard to="/dashboard">{breadcrumpCurrentPageLabel}</BreadcrumbDashboard>

          <div className="card-club-form">
            <div>
              <Row>
                <Col md={3}>
                  <h3 className="ps-4">Data Pribadi</h3>
                  <ClubImagesWrapper>
                    <div className="mt-4" style={{ height: "200px" }}>
                      <div className="club-image-bottom">
                        <label
                          htmlFor="field-image-logoImage"
                          className="club-logo picker-input-control"
                        >
                          <input
                            className="picker-file-input"
                            id="field-image-logoImage"
                            name="avatar"
                            type="file"
                            accept="image/jpg,image/jpeg,image/png"
                            onChange={(ev) => handleChooseImage("avatar", ev)}
                          />
                          {profileData?.avatar?.preview ? (
                            <img className="club-logo-image" src={profileData?.avatar?.preview} />
                          ) : (
                            <div className="picker-empty-placeholder">
                              <div className="picker-empty-placeholder-icon">
                                <IconCamera size="40" />
                              </div>
                              <div>Foto Profil</div>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </ClubImagesWrapper>
                </Col>
                <Col md={9}>
                  <TextInput
                    label="Nama Lengkap"
                    value={dataUpdate?.name}
                    defaultValue={userProfile?.name}
                    name="name"
                    onChange={(e) => handleInputName(e)}
                  />
                  <div className="d-flex mt-4">
                    <div className="w-50">
                      <DateInput
                        value={
                          userProfile?.dateOfBirth
                            ? userProfile?.dateOfBirth
                            : dataUpdate?.date_of_birth
                        }
                        name="date_of_birth"
                        onChange={(e) => handleInputDate(e)}
                        label="Tanggal Lahir"
                      />
                    </div>
                    <div className="w-50 ms-4">
                      <div>
                        <Label>Gender</Label>
                      </div>
                      <div
                        className={`form-check form-radio-primary`}
                        style={{ display: "inline-block", marginRight: 10 }}
                      >
                        <Input
                          type="radio"
                          name="gender"
                          value="male"
                          onChange={(e) => {
                            handleRadio(e);
                            toggleChange(e);
                          }}
                          checked={toggle == "male" ? true : false}
                          className="form-check-Input"
                        />
                        <Label className="form-check-label" htmlFor="male">
                          Pria
                        </Label>
                      </div>
                      <div
                        className={`form-check form-radio-primary`}
                        style={{ display: "inline-block", marginRight: 10 }}
                      >
                        <Input
                          type="radio"
                          name="gender"
                          value="female"
                          className="form-check-Input"
                          checked={toggle == "female" ? true : false}
                          onChange={(e) => {
                            handleRadio(e);
                            toggleChange(e);
                          }}
                        />
                        <Label className="form-check-label" htmlFor="female">
                          Wanita
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <NumberInput
                      name="phone_number"
                      defaultValue={userProfile?.phoneNumber}
                      value={dataUpdate?.phone_number}
                      onChange={(e) => handlePhoneNumber(e)}
                      label="No. Handphone"
                    />
                  </div>
                  {/* <div className='mt-4'>
                                <TextInput name="club" onChange={(e) => handleClub(e)} label="Nama Klub (Opsional)" />
                            </div> */}
                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        updateAvatar();
                        hanleSubmitData();
                      }}
                      className="btn float-end"
                      style={{ backgroundColor: "#0D47A1", color: "#FFF" }}
                    >
                      Ajukan
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      </React.Fragment>
    </ProfileWrapper>
  );
}

const ProfileWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";

  .card-club-form {
    position: relative;

    padding: 2rem;
    border-radius: 4px;
    border: 0px solid rgb(246, 246, 246);
    box-shadow: rgb(18 38 63 / 3%) 0px 0.75rem 1.5rem;
    background-color: #ffffff;
    background-clip: border-box;

    .club-form-action {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.5rem;

      .button-submit-create {
        padding-left: 2rem;
        padding-right: 2rem;
      }
    }
  }
`;

const ClubImagesWrapper = styled.div`
  .picker-input-control {
    position: relative;
    margin: 0;

    .picker-file-input {
      visibility: hidden;
      position: absolute;
      top: 0;
      left: -2000px;
    }

    .picker-empty-placeholder {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--ma-gray-400);

      &-icon {
        margin-bottom: 0.75rem;
        color: #ffffff;
      }
    }
  }

  .club-image-top {
    position: relative;
    width: 100%;
    padding-bottom: 42%;
    background-color: var(--ma-gray-200);
    overflow: hidden;

    &.preview {
      background-color: var(--ma-blue);
    }

    .club-banner-image {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .club-image-bottom {
    position: relative;
    width: 100%;
    min-height: 90px;
  }

  .club-logo {
    position: absolute;
    left: 0;
    top: -10%;

    width: 180px;
    height: 180px;
    border-radius: 50%;
    overflow: hidden;
    border: solid 5px #efefef;
    background-color: var(--ma-gray-200);

    &-image {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
`;

export default PageProfileHome;
