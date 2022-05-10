import React, { useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbDashboard } from "../components/breadcrumb";
import styled from "styled-components";
import IconCamera from "components/ma/icons/mono/camera";
import { DateInput, TextInput, NumberInput, TextareaInput } from "components";
import { useSelector, useDispatch } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { ArcherService } from "services";
import { useHistory, Link } from "react-router-dom";

import { LoadingScreen } from "components/ma";

import icon_white from "assets/images/myachery/icon-white.svg";
import icon_green from "assets/images/myachery/success-icon.svg";
import toastr from "toastr";
// import icon from "assets/images/myachery/icon.svg";

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
  const dispatch = useDispatch();
  const history = useHistory();

  const [profileData, setProfileData] = useState({});
  const [dataUpdate, setUpdateData] = useState({});
  const [toggle, setToggle] = useState(userProfile?.gender);
  const [imgAvatar, setImgAvatar] = useState(userProfile?.avatar);
  const [avatarFetching, dispatchAvatarFetching] = React.useReducer(
    (state, action) => ({
      ...state,
      ...action,
    }),
    { status: "idle" }
  );

  const handleChooseImage = async (field, ev) => {
    if (!ev.target.files?.[0]) {
      return;
    }
    const imageRawData = ev.target.files[0];
    const stringAv = await imageToBase64(imageRawData);
    const imagePreviewUrl = URL.createObjectURL(imageRawData);
    setImgAvatar(imagePreviewUrl);
    setProfileData({
      [field]: { preview: imagePreviewUrl, raw: imageRawData, base64: stringAv },
    });
  };

  React.useEffect(() => {
    const avatarFile = profileData?.avatar?.base64;
    if (!avatarFile) {
      return;
    }

    const updateAvatar = async () => {
      dispatchAvatarFetching({ status: "loading" });
      const { success: successUpdateAvatar } = await ArcherService.updateAvatar(
        { avatar: avatarFile },
        { user_id: userProfile?.id }
      );

      if (successUpdateAvatar) {
        const { data, success: successRefetchAvatar } = await ArcherService.profile();
        if (successRefetchAvatar) {
          dispatch(AuthStore.profile(data));
          dispatchAvatarFetching({ status: "success" });
        } else {
          dispatchAvatarFetching({ status: "error" });
        }
      } else {
        dispatchAvatarFetching({ status: "error" });
      }
    };

    updateAvatar();
  }, [profileData?.avatar?.base64]);

  const hanleSubmitData = async () => {
    const { message, errors } = await ArcherService.updateProfile(
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
        address: dataUpdate?.address ? dataUpdate?.address : userProfile?.address,
        placeOfBirth: dataUpdate?.placeOfBirth
          ? dataUpdate?.placeOfBirth
          : userProfile?.placeOfBirth,
      },
      { user_id: userProfile?.id }
    );
    if (message === "Success") {
      console.log(message);
      console.log(errors);
      history.push("/dashboard");
    } else {
      const err = Object.keys(errors).map((err) => err);
      if (err[0] == "address") {
        toastr.error("Alamat belum diisi");
      }
      if (err[0] == "placeOfBirth" || err[1] == "placeOfBirth" || err[2] == "placeOfBirth") {
        toastr.error("Tempat lahir belum diisi");
      }
      if (err[0] == "phoneNumber" || err[1] == "phoneNumber" || err[2] == "phoneNumber") {
        toastr.error("No Handphone belum diisi");
      }
    }
  };

  // console.log(profileData);
  // console.log(dataUpdate);
  // console.log(userProfile)

  const handleInputName = (e) => {
    const payload = { ...dataUpdate };
    payload[e.key] = e.value;
    setUpdateData(payload);
  };

  const handleInputPlaceOfBirth = (e) => {
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

  const hanleAddress = (e) => {
    const payload = { ...dataUpdate };
    payload[e.key] = e.value;
    setUpdateData(payload);
  };
  const handleRadio = (e) => {
    setUpdateData({ ...dataUpdate, gender: e.target.value });
  };

  const toggleChange = (e) => {
    setToggle(e.target.value ? e.target.value : userProfile?.gender);
  };

  const statusVerifikasi = () => {
    if (userProfile?.verifyStatus == 4) {
      return (
        <div
          className="d-flex w-75 align-items-center px-2 py-1 rounded-pill"
          style={{ backgroundColor: "#EEE" }}
        >
          <div>
            <img src={icon_white} className="me-2" />
          </div>
          <div>
            <span>{userProfile?.statusVerify}</span>
          </div>
        </div>
      );
    }
    if (userProfile?.verifyStatus == 3) {
      return (
        <div
          className="d-flex w-75 align-items-center px-2 py-1 rounded-pill"
          style={{ backgroundColor: "#EEE" }}
        >
          <div>
            <img src={icon_white} className="me-2" />
          </div>
          <div>
            <span>{userProfile?.statusVerify}</span>
          </div>
        </div>
      );
    }
    if (userProfile?.verifyStatus == 2) {
      return (
        <div
          className="d-flex w-75 align-items-center px-2 py-1 rounded-pill"
          style={{ backgroundColor: "#FFDD98" }}
        >
          <div>
            <img src={icon_white} className="me-2" />
          </div>
          <div>
            <span>{userProfile?.statusVerify}</span>
          </div>
        </div>
      );
    }

    if (userProfile?.verifyStatus == 1) {
      return (
        <Link style={{ color: "#000" }} to="/dashboard/profile/verifikasi">
          <div className="d-flex w-75 align-items-center px-2 py-1 rounded-pill">
            <div>
              <img src={icon_green} className="me-2" />
            </div>
            <div>
              <span>{userProfile?.statusVerify}</span>
            </div>
          </div>
        </Link>
      );
    }
  };

  const breadcrumpCurrentPageLabel = "Profil";

  return (
    <ProfileWrapper>
      <LoadingScreen loading={avatarFetching.status === "loading"} />
      <React.Fragment>
        <MetaTags>
          <title>Profil Archer | MyArchery.id</title>
        </MetaTags>
        <Container fluid>
          <BreadcrumbDashboard to="/dashboard">{breadcrumpCurrentPageLabel}</BreadcrumbDashboard>

          <div className="card-club-form">
            <div className="mt-4">
              <Row>
                <Col md={3}>
                  <h3 className="ps-4">Data Pribadi</h3>

                  <div className="my-2">{statusVerifikasi()}</div>

                  <ClubImagesWrapper>
                    <div className="my-4">
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
                          {profileData?.avatar?.preview || imgAvatar ? (
                            <img
                              key={imgAvatar || undefined}
                              className="club-logo-image"
                              src={imgAvatar}
                            />
                          ) : (
                            <div className="picker-empty-placeholder">
                              <div className="picker-empty-placeholder-icon">
                                <IconCamera size="40" />
                              </div>
                              <div>Unggah Foto</div>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="note-caption">
                      Unggah foto Anda dengan ukuran 4x3, min. besar file 500kb, format PNG/JPEG
                      untuk keperluan berkas cetak (ID card, dsb).
                    </div>
                  </ClubImagesWrapper>
                </Col>

                <Col md={9}>
                  <TextInput
                    disabled={userProfile?.verifyStatus != 1 ? false : true}
                    label="Nama Lengkap"
                    value={dataUpdate?.name}
                    defaultValue={userProfile?.name}
                    name="name"
                    onChange={(e) => handleInputName(e)}
                  />
                  <div className="d-flex mt-4">
                    <div className="w-50">
                      <DateInput
                        disabled={userProfile?.verifyStatus != 1 ? false : true}
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
                          disabled={userProfile?.verifyStatus != 1 ? false : true}
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
                          disabled={userProfile?.verifyStatus != 1 ? false : true}
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
                    <TextInput
                      label="Tempat Lahir"
                      value={dataUpdate?.placeOfBirth}
                      defaultValue={userProfile?.placeOfBirth}
                      name="placeOfBirth"
                      onChange={(e) => handleInputPlaceOfBirth(e)}
                    />
                  </div>

                  <div className="mt-4">
                    <TextareaInput
                      onChange={(e) => hanleAddress(e)}
                      label="Alamat"
                      name="address"
                      defaultValue={userProfile?.address}
                      value={dataUpdate?.address}
                    />
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
                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        hanleSubmitData();
                      }}
                      className="btn float-end"
                      style={{ backgroundColor: "#0D47A1", color: "#FFF" }}
                    >
                      Simpan
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
  }

  .club-logo {
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

  .note-caption {
    padding: 0.75rem;
    max-width: 180px;
    border-radius: 0.5rem;
    background-color: var(--ma-gray-50);
    color: #757575;
  }
`;

export default PageProfileHome;
