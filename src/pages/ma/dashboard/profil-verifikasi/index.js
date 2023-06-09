import React, { useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbDashboard } from "../components/breadcrumb";
import styled from "styled-components";
import { DateInput, TextInput, TextareaInput } from "components";
import { useSelector, useDispatch } from "react-redux";
import toastr from "toastr";
import * as AuthStore from "store/slice/authentication";
import { ArcherService, ArcheryClubService } from "services";
import { useHistory } from "react-router-dom";
import { FieldSelect } from "./components";
import SweetAlert from "react-bootstrap-sweetalert";
import "./components/sass/styles.scss";
import logoBuatAkun from "assets/images/myachery/tungu-verifiakasi.svg";
import logoWarning from "assets/images/myachery/warning.png";
import logoSuccess from "assets/images/myachery/success.png";

import { Container, Row, Col, Label, Input, Button } from "reactstrap";
import { AlertSubmitError, AlertConfirmAction, ButtonBlue, LoadingScreen } from "components/ma";
import VerifikasiResume from "./components/VerifikasiResume";

import IconCamera from "components/ma/icons/mono/camera";

import { filesUtil, errorsUtil } from "utils";

function PageProfileVerifikasiHome() {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const history = useHistory();

  const [updateFormData, setUpdateFormData] = useState({});
  const [gender, setGender] = useState(userProfile?.gender);
  const [displayImage, setDisplayImage] = useState({ raw: null });
  const [isOpenKTP, setIsOpenKTP] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [provinceOptions, setProvinceOptions] = React.useState([]);
  const [cityOptions, setCityOptions] = React.useState([]);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [formSubmit, dispatchFormSubmit] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    { status: "idle", errors: null }
  );
  const [isPromptCancelOpen, setPromptCancelOpen] = React.useState(false);
  const [isPromptSendOpen, setPromptSendOpen] = React.useState(false);

  const breadcrumpCurrentPageLabel = "Ajukan Data";
  const isUpdateFormClean = !Object.keys(updateFormData).length;

  const hanleSubmitData = async () => {
    if (!updateFormData?.ktp) {
      toastr.error("Foto KTP/KK belum diisi");
      return;
    }

    if (displayImage?.raw?.size > 2000000) {
      toastr.error("Ukuran KTP/KK tidak boleh lebih dari 2MB");
      return;
    }

    const payload = {
      nik: updateFormData?.nik || detailData?.nik,
      ktpKk: updateFormData?.ktp || null,
      provinceId: updateFormData?.addressProvince?.value || userProfile?.addressProvince?.id,
      cityId: updateFormData?.addressCity?.value || userProfile?.addressCity?.id,
      address: updateFormData?.address || userProfile?.address,
      name: updateFormData?.name || userProfile?.name,
    };

    dispatchFormSubmit({ status: "loading", errors: null });
    const queryStrings = { user_id: userProfile?.id };
    const result = await ArcherService.updateVerifikasi(payload, queryStrings);

    if (result.success) {
      dispatchFormSubmit({ status: "success" });
    } else {
      const errorsData = errorsUtil.interpretServerErrors(result);
      dispatchFormSubmit({ status: "error", errors: errorsData });
    }
  };

  const hanleSubmitDataUpdate = async () => {
    if (displayImage?.raw?.size > 2000000) {
      toastr.error("Ukuran KTP/KK tidak boleh lebih dari 2MB");
      return;
    }

    if (updateFormData?.addressProvince?.value && !updateFormData?.addressCity?.value) {
      toastr.error("Isi kota yang sesuai dengan provinsinya");
      return;
    }

    const payload = {
      nik: updateFormData?.nik || detailData?.nik,
      ktpKk: updateFormData?.ktp || "",
      provinceId: updateFormData?.addressProvince?.value || userProfile?.addressProvince?.id,
      cityId: updateFormData?.addressCity?.value || userProfile?.addressCity?.id,
      address: updateFormData?.address || userProfile?.address,
      name: updateFormData?.name || userProfile?.name,
    };

    dispatchFormSubmit({ status: "loading", errors: null });
    const result = await ArcherService.updateVerifikasi(payload, {
      user_id: userProfile?.id,
    });

    if (result.success) {
      dispatchFormSubmit({ status: "success" });
    } else {
      const errorsData = errorsUtil.interpretServerErrors(result);
      dispatchFormSubmit({ status: "error", errors: errorsData });
    }
  };

  React.useEffect(() => {
    if (!userProfile) {
      return;
    }

    const getDetailVerifikasi = async () => {
      const { data } = await ArcherService.getDetailVerifikasi({ user_id: userProfile.id });
      if (data) {
        setDetailData(data);
      }
    };

    getDetailVerifikasi();
  }, [userProfile]);

  const handleInputName = (e) => {
    const payload = { ...updateFormData };
    payload[e.key] = e.value;
    setUpdateFormData(payload);
  };
  const handleInputDate = (e) => {
    const payload = { ...updateFormData };
    payload[e.key] = e.value;
    setUpdateFormData(payload);
  };

  const handleNIK = (e) => {
    const payload = { ...updateFormData };
    payload[e.target.name] = e.target.value;
    setUpdateFormData(payload);
  };

  const handleKTP = async (e) => {
    if (!e.target.files?.[0]) {
      return;
    }
    const preview = URL.createObjectURL(e.target.files[0]);
    setDisplayImage({ ...displayImage, raw: e.target.files[0], priviewImgKTP: preview });
    const base64String = await filesUtil.imageToBase64(e.target.files[0]);
    setUpdateFormData({ ...updateFormData, ktp: base64String });
  };

  const handleInputProvince = (key, e) => {
    const payload = { ...updateFormData };
    payload[key] = e;
    setUpdateFormData(payload);
  };

  const handleInputCity = (key, e) => {
    const data = { ...updateFormData };
    data[key] = e;
    setUpdateFormData(data);
  };

  const handleRadio = (e) => {
    setUpdateFormData({ ...updateFormData, gender: e.target.value });
  };

  const toggleChange = (e) => {
    setGender(e.target.value || userProfile?.gender);
  };

  const toggleIsOpenKTP = () => {
    setIsOpenKTP((open) => !open);
  };

  const hanleAddress = (e) => {
    const payload = { ...updateFormData };
    payload[e.key] = e.value;
    setUpdateFormData(payload);
  };

  const valueProvincie = () => {
    return userProfile?.addressProvince
      ? { label: userProfile?.addressProvince?.name, value: userProfile?.addressProvince?.id }
      : null;
  };
  const valueCity = () => {
    return userProfile?.addressCity
      ? { label: userProfile?.addressCity?.name, value: userProfile?.addressCity?.id }
      : null;
  };

  React.useEffect(() => {
    const fetchProvinceOptions = async () => {
      const result = await ArcheryClubService.getProvinces({ limit: 50, page: 1 });
      if (result.success) {
        const provinceOptions = result.data.map((province) => ({
          label: province.name,
          value: parseInt(province.id),
        }));
        setProvinceOptions(provinceOptions);
      }
    };

    fetchProvinceOptions();
  }, []);

  React.useEffect(() => {
    if (!updateFormData?.addressProvince?.value && !userProfile?.addressProvince?.id) {
      setCityOptions([]);
      return;
    }

    // Paksa reset kota setiap provinsi diganti
    // Biar gak mismatch kota sama provinsinya
    updateFormData.addressCity && handleInputCity("addressCity", null);

    const fetchCityOptions = async () => {
      const result = await ArcheryClubService.getCities({
        province_id: updateFormData?.addressProvince?.value || userProfile?.addressProvince?.id,
      });
      if (result.success) {
        const cityOptions = result.data.map((city) => ({
          label: city.name,
          value: parseInt(city.id),
        }));
        setCityOptions(cityOptions);
      }
    };

    fetchCityOptions();
  }, [userProfile, updateFormData?.addressProvince]);

  const showTemporaryLoading = () => {
    dispatchFormSubmit({ status: "loading" });
    setTimeout(() => {
      dispatchFormSubmit({ status: "idle" });
    }, 2000);
  };

  const onConfirm = () => {
    history.push("/dashboard");
  };

  const verifiedAlert = () => {
    return (
      <SweetAlert
        show={isAlertOpen}
        title=""
        custom
        btnSize="md"
        onConfirm={onConfirm}
        style={{ padding: "1.25rem" }}
        customButtons={
          <span className="d-flex w-100 justify-content-center" style={{ gap: "0.5rem" }}>
            <ButtonBlue onClick={onConfirm}>Kembali ke Dashboard</ButtonBlue>
          </span>
        }
      >
        <div className="d-flex justify-content-center flex-column">
          <div style={{ width: "60%", margin: "0 auto" }}>
            <div style={{ width: "214px", height: "145px" }}>
              <img src={logoBuatAkun} width="100%" height="100%" style={{ objectFit: "cover" }} />
            </div>
          </div>
          <p>Terima kasih telah melengkapi data. Data Anda akan diverifikasi dalam 1x24 jam.</p>
        </div>
      </SweetAlert>
    );
  };

  if (userProfile?.verifyStatus == 1) {
    return (
      <VerifikasiResume
        nik={detailData?.nik}
        photoID={detailData?.ktpKk}
        selfieID={detailData?.selfieKtpKk}
        {...userProfile}
      />
    );
  }

  return (
    <ProfileWrapper>
      <React.Fragment>
        <MetaTags>
          <title>Profil Archer Verifikasi | MyArchery.id</title>
        </MetaTags>

        <Container fluid>
          <BreadcrumbDashboard to="/dashboard">{breadcrumpCurrentPageLabel}</BreadcrumbDashboard>

          <div className="card-club-form">
            <div>
              <p style={{ color: "#fa402a" }}>
                {userProfile.verifyStatus == 2 ? "(!) " + userProfile.reasonRejected : ""}
              </p>

              <div className="pb-3">
                <span className="font-font-size-18" style={{ fontWeight: "600" }}>
                  Data Pribadi
                </span>
              </div>

              <Row>
                <Col md={3}>
                  <AvatarPicker />
                </Col>

                <Col md={9}>
                  <Row>
                    <Col md={12}>
                      <TextInput
                        label="Nama Lengkap"
                        value={updateFormData?.name}
                        defaultValue={userProfile?.name}
                        name="name"
                        onChange={(e) => handleInputName(e)}
                        disabled
                      />
                      <div className="d-flex mt-4">
                        <div className="w-50">
                          <DateInput
                            value={userProfile?.dateOfBirth || updateFormData?.date_of_birth}
                            name="date_of_birth"
                            onChange={(e) => handleInputDate(e)}
                            label="Tanggal Lahir"
                            disabled
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
                              disabled
                              type="radio"
                              name="gender"
                              value="male"
                              onChange={(e) => {
                                handleRadio(e);
                                toggleChange(e);
                              }}
                              checked={gender == "male" ? true : false}
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
                              disabled
                              type="radio"
                              name="gender"
                              value="female"
                              className="form-check-Input"
                              checked={gender == "female" ? true : false}
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
                        <TextareaInput
                          onChange={(e) => hanleAddress(e)}
                          label="Alamat (Sesuai dengan KTP/KK)"
                          name="address"
                          defaultValue={userProfile?.address}
                          value={updateFormData?.address}
                        />
                      </div>
                      <div className="mt-3">
                        <div>
                          <Label>NIK</Label>
                        </div>
                        <div>
                          <Input
                            value={updateFormData?.nik || detailData?.nik || ""}
                            name="nik"
                            onChange={(e) => handleNIK(e)}
                            required
                            type="text"
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <FieldSelect
                          name="addressProvince"
                          placeholder="Pilih provinsi &#47; wilayah(Sesuai dengan KTP)"
                          required
                          options={provinceOptions}
                          value={updateFormData.addressProvince || valueProvincie()}
                          onChange={(value) => handleInputProvince("addressProvince", value)}
                        >
                          Provinsi&#47;Wilayah(Sesuai dengan KTP/KK)
                        </FieldSelect>
                      </div>

                      <div className="mt4">
                        <FieldSelect
                          name="addressCity"
                          placeholder={
                            updateFormData.addressProvince
                              ? "Pilih kota"
                              : "Pilih provinsi terlebih dulu"
                          }
                          required
                          options={cityOptions}
                          value={
                            updateFormData.addressProvince
                              ? updateFormData.addressCity || null
                              : valueCity()
                          }
                          onChange={(value) => handleInputCity("addressCity", value)}
                        >
                          Kota (Sesuai dengan KTP/KK)
                        </FieldSelect>
                      </div>

                      <div className="mt-3">
                        <div>
                          <Label>Foto KTP/KK</Label>
                        </div>
                        <div className="box-upload d-flex justify-content-center align-items-center">
                          <div>
                            <div className="d-block" style={{ textAlign: "center" }}>
                              <div className="py-2">
                                {userProfile?.verifyStatus === 4 ? (
                                  <span className="font-size-14" style={{ fontWeight: "500" }}>
                                    {displayImage?.raw?.name || "Unggah gambar png/jpg"}
                                  </span>
                                ) : (
                                  <span className="font-size-14" style={{ fontWeight: "500" }}>
                                    {displayImage?.raw?.name ||
                                      "Klik lihat untuk memunculkan gambar"}
                                  </span>
                                )}
                              </div>
                              {detailData?.ktpKk || displayImage?.raw ? (
                                <div>
                                  <Button
                                    onClick={toggleIsOpenKTP}
                                    className="btn me-2"
                                    style={{ color: "#FFF", backgroundColor: '#0D47A1"' }}
                                  >
                                    Lihat
                                  </Button>

                                  <label
                                    className="custom-file-upload"
                                    onClick={showTemporaryLoading}
                                  >
                                    <input
                                      accept="image/*"
                                      onChange={(e) => handleKTP(e)}
                                      name="ktp"
                                      type="file"
                                    />
                                    <span>Ubah</span>
                                  </label>
                                </div>
                              ) : (
                                <div>
                                  <label
                                    className="custom-file-upload"
                                    onClick={showTemporaryLoading}
                                  >
                                    <input
                                      accept="image/*"
                                      onChange={(e) => handleKTP(e)}
                                      name="ktp"
                                      type="file"
                                    />
                                    <span>Unggah</span>
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button
                          disabled={isUpdateFormClean}
                          onClick={() => {
                            if (userProfile?.verifyStatus == 3 || userProfile?.verifyStatus == 2) {
                              hanleSubmitDataUpdate();
                            } else {
                              hanleSubmitData();
                            }
                          }}
                          className="btn float-end"
                          style={{ backgroundColor: "#0D47A1", color: "#FFF" }}
                        >
                          Ajukan
                        </Button>

                        <Button
                          disabled={isUpdateFormClean}
                          onClick={() => setPromptCancelOpen(true)}
                          className="btn float-end me-2"
                          style={{ color: "#0D47A1" }}
                        >
                          Batal
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </Container>
        <div>
          {isOpenKTP ? (
            <div
              onClick={toggleIsOpenKTP}
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                height: "100vh",
                width: "100vw",
                backgroundColor: "rgba(0,0,0,0.7)",
                cursor: "pointer",
                zIndex: "100",
              }}
            >
              <img
                src={displayImage?.priviewImgKTP || detailData?.ktpKk}
                alt={displayImage?.raw?.name}
                style={{
                  height: "50%",
                  width: "auto",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              />
            </div>
          ) : null}
        </div>
      </React.Fragment>

      <LoadingScreen loading={formSubmit.status === "loading"} />
      <AlertSubmitError isError={formSubmit.status === "error"} errors={formSubmit.errors} />
      <AlertConfirmAction
        shouldConfirm={
          formSubmit.status === "success" ? formSubmit.status === "success" : isPromptSendOpen
        }
        labelConfirm="Sudah Benar"
        labelCancel="Cek Kembali"
        onClose={() => setPromptSendOpen(false)}
        onConfirm={() => {
          setIsAlertOpen(true);
        }}
      >
        <div className="mt-2">
          <img src={logoSuccess} />
        </div>
        Apakah data Anda sudah benar?
      </AlertConfirmAction>

      <AlertConfirmAction
        shouldConfirm={isPromptCancelOpen}
        onConfirm={() => history.push("/dashboard")}
        onClose={() => setPromptCancelOpen(false)}
        labelConfirm="Ya, kembali ke dashboard"
        labelCancel="Tidak, lanjutkan isi data"
        reverseActions
      >
        <div className="mt-2">
          <img src={logoWarning} />
        </div>
        Anda belum menyelesaikan pengisian data, yakin akan membatalkan pengisian data?
      </AlertConfirmAction>

      {verifiedAlert()}
    </ProfileWrapper>
  );
}

function AvatarPicker() {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const dispatch = useDispatch();
  const [avatarImage, setAvatarImage] = useState(null);
  const [avatarFetching, dispatchAvatarFetching] = React.useReducer(
    (state, action) => ({
      ...state,
      ...action,
    }),
    { status: "idle" }
  );

  React.useEffect(() => {
    const avatarFile = avatarImage?.base64;
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
  }, [avatarImage?.base64]);

  const handleChooseImage = async (ev) => {
    if (!ev.target.files?.[0]) {
      return;
    }

    const imageRawData = ev.target.files[0];
    const stringAv = await filesUtil.imageToBase64(imageRawData);
    const imagePreviewUrl = URL.createObjectURL(imageRawData);

    setAvatarImage({ preview: imagePreviewUrl, raw: imageRawData, base64: stringAv });
  };

  return (
    <AvatarImageWrapper>
      <LoadingScreen loading={avatarFetching.status === "loading"} />

      <div className="my-4">
        <div className="avatar-image-picker">
          <label htmlFor="field-image-logoImage" className="avatar-image picker-input-control">
            <input
              className="picker-file-input"
              id="field-image-logoImage"
              name="avatar"
              type="file"
              accept="image/jpg,image/jpeg,image/png"
              onChange={handleChooseImage}
            />

            {avatarImage?.preview || userProfile?.avatar ? (
              <img
                key={avatarImage?.preview || userProfile?.avatar || "no-avatar"}
                src={avatarImage?.preview || userProfile?.avatar}
                className="img-avatar"
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
        Unggah foto Anda dengan ukuran 4x3, min. besar file 500kb, format PNG/JPEG untuk keperluan
        berkas cetak (ID card, dsb).
      </div>
    </AvatarImageWrapper>
  );
}

/* ============================ */
// styles

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

const AvatarImageWrapper = styled.div`
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

  .avatar-image-picker {
    position: relative;
    width: 100%;
  }

  .avatar-image {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    overflow: hidden;
    border: solid 5px #efefef;
    background-color: var(--ma-gray-200);

    .img-avatar {
      height: 100%;
      width: 100%;
      object-fit: cover;
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

export default PageProfileVerifikasiHome;
