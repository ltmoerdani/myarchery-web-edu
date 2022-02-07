import React, { useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbDashboard } from "../components/breadcrumb";
import styled from "styled-components";
import { DateInput, TextInput } from "components";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { ArcherService } from "services";
import { useHistory } from "react-router-dom";
import "./components/sass/styles.scss";

import { Container, Row, Col, Label, Input, Button } from "reactstrap";
import VerifikasiResume from "./components/VerifikasiResume";

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

function PageProfileVerifikasiHome() {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const history = useHistory();

  const [dataUpdate, setUpdateData] = useState({});
  const [toggle, setToggle] = useState(userProfile?.gender);
  const [display, setDisplay] = useState();
  const [isOpenKTP, setIsOpenKTP] = useState(false);
  const [isOpenKK, setIsOpenKK] = useState(false);
  const [detailData, setDetailData] = useState({});

  const hanleSubmitData = async () => {
    const { message, errors, data } = await ArcherService.updateVerifikasi(
      {
        nik: dataUpdate?.nik ? dataUpdate?.nik : userProfile?.nik,
        selfieKtpKk: dataUpdate?.kk ? dataUpdate?.kk : null,
        ktpKk: dataUpdate?.ktp ? dataUpdate?.ktp : null,
      },
      { user_id: userProfile?.id }
    );
    if (!data) {
      console.log(message);
      console.log(errors);
    }
    history.push("/dashboard");
  };

  const getDetailVerifikasi = async () => {
    const { message, errors, data } = await ArcherService.getDetailVerifikasi({
      user_id: userProfile?.id,
    });
    if (data) {
      setDetailData(data);
      console.log(message);
      console.log(errors);
    }
    console.log(message);
    console.log(errors);
  };

  React.useEffect(() => {
    getDetailVerifikasi();
  }, [userProfile]);

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

  const handleNIK = (e) => {
    const payload = { ...dataUpdate };
    payload[e.target.name] = e.target.value;
    setUpdateData(payload);
  };

  // eslint-disable-next-line no-unused-vars
  const handleKTP = async (e) => {
    const preview = URL.createObjectURL(e.target.files[0]);
    setDisplay({ ...display, ktp: e.target.files[0], priviewImgKTP: preview });
    const base64String = await imageToBase64(e.target.files[0]);
    setUpdateData({ ...dataUpdate, ktp: base64String });
  };

  const handleKK = async (e) => {
    const preview = URL.createObjectURL(e.target.files[0]);
    setDisplay({ ...display, kk: e.target.files[0], priviewImgKK: preview });
    const base64String = await imageToBase64(e.target.files[0]);
    setUpdateData({ ...dataUpdate, kk: base64String });
  };

  const handleRadio = (e) => {
    setUpdateData({ ...dataUpdate, gender: e.target.value });
  };

  const toggleChange = (e) => {
    setToggle(e.target.value ? e.target.value : userProfile?.gender);
  };

  const toggleIsOpenKTP = () => {
    setIsOpenKTP(!isOpenKTP);
  };
  const toggleIsOpenKK = () => {
    setIsOpenKK(!isOpenKK);
  };

  const breadcrumpCurrentPageLabel = "Ajukan Data";

  console.log(display);
  console.log(dataUpdate);

  if (userProfile?.verifyStatus == 1) {
    return (
      <React.Fragment>
        <VerifikasiResume
          nik={detailData?.nik}
          photoID={detailData?.ktpKk}
          selfieID={detailData?.selfieKtpKk}
          {...userProfile}
        />
      </React.Fragment>
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
              <div className="pb-3">
                <span className="font-font-size-18" style={{ fontWeight: "600" }}>
                  Data Pribadi
                </span>
              </div>
              <Row>
                <Col md={12}>
                  <TextInput
                    label="Nama Lengkap"
                    value={dataUpdate?.name}
                    defaultValue={userProfile?.name}
                    name="name"
                    onChange={(e) => handleInputName(e)}
                    disabled={true}
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
                        disabled={true}
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
                          disabled
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
                  <div className="mt-5">
                    <div>
                      <Label>NIK</Label>
                    </div>
                    <div>
                      <Input
                        value={dataUpdate?.nik ? dataUpdate?.nik : detailData?.nik}
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
                                {display?.ktp ? display?.ktp?.name : "Unggah gambar png/jpg"}
                              </span>
                            ) : (
                              <span className="font-size-14" style={{ fontWeight: "500" }}>
                                {display?.ktp
                                  ? display?.ktp?.name
                                  : "Klik lihat untuk memunculkan gambar"}
                              </span>
                            )}
                          </div>
                          {detailData?.ktpKk || display?.ktp ? (
                            <div>
                              <Button
                                onClick={toggleIsOpenKTP}
                                className="btn me-2"
                                style={{ color: "#FFF", backgroundColor: '#0D47A1"' }}
                              >
                                Lihat
                              </Button>
                              <label className="custom-file-upload">
                                <input onChange={(e) => handleKTP(e)} name="ktp" type="file" />
                                <span>Ubah</span>
                              </label>
                            </div>
                          ) : (
                            <div>
                              <label className="custom-file-upload">
                                <input onChange={(e) => handleKTP(e)} name="ktp" type="file" />
                                <span>Unggah</span>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div>
                      <Label>Foto Selfie dengan KTP/KK</Label>
                    </div>
                    <div className="box-upload d-flex justify-content-center align-items-center">
                      <div>
                        <div className="d-block" style={{ textAlign: "center" }}>
                          <div className="py-2">
                            {userProfile?.verifyStatus === 4 ? (
                              <span className="font-size-14" style={{ fontWeight: "500" }}>
                                {display?.kk ? display?.kk?.name : "Unggah gambar png/jpg"}
                              </span>
                            ) : (
                              <span className="font-size-14" style={{ fontWeight: "500" }}>
                                {display?.kk
                                  ? display?.kk?.name
                                  : "Klik lihat untuk memunculkan gambar"}
                              </span>
                            )}
                          </div>
                          {detailData?.selfieKtpKk || display?.kk ? (
                            <div>
                              <Button
                                onClick={toggleIsOpenKK}
                                className="btn me-2"
                                style={{ color: "#FFF", backgroundColor: '#0D47A1"' }}
                              >
                                Lihat
                              </Button>
                              <label className="custom-file-upload">
                                <input onChange={(e) => handleKK(e)} name="kk" type="file" />
                                <span>Ubah</span>
                              </label>
                            </div>
                          ) : (
                            <div>
                              <label className="custom-file-upload">
                                <input name="kk" onChange={(e) => handleKK(e)} type="file" />
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
                      onClick={() => {
                        hanleSubmitData();
                      }}
                      className="btn float-end"
                      style={{ backgroundColor: "#0D47A1", color: "#FFF" }}
                    >
                      Simpan
                    </Button>
                    <Button
                      onClick={() => {
                        history.push("/dashboard");
                      }}
                      className="btn float-end me-2"
                      style={{ color: "#0D47A1" }}
                    >
                      Batal
                    </Button>
                  </div>
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
                src={display?.priviewImgKTP ? display?.priviewImgKTP : detailData?.ktpKk}
                alt={display?.ktp?.name}
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
        <div>
          {isOpenKK ? (
            <div
              onClick={toggleIsOpenKK}
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
                src={display?.priviewImgKK ? display?.priviewImgKK : detailData?.selfieKtpKk}
                alt={display?.kk?.name}
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

export default PageProfileVerifikasiHome;
