import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import LatestEventsList from "./components/latest-events";
import DashboardMenus from "./components/menus";
import SweetAlert from "react-bootstrap-sweetalert";
import { useHistory, Link } from "react-router-dom";
import { Button, ButtonBlue } from "components/ma";

import { misc } from "utils";

import logoBuatAkun from "assets/images/myachery/Illustration.png";
import illustrationWarningAlert from "assets/images/alert-publication.svg";
import icon from "assets/images/myachery/icon.svg";

const DashboardWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter", sans-serif;

  .heading {
    font-weight: 500;
    color: #000000;
  }
`;

function GreetingUserText({ children }) {
  const text = children ? `Halo, ${children.name}` : "Halo!";
  return <h1 className="heading">{text}</h1>;
}

function PageDashboard() {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const history = useHistory();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    setIsAlertOpen(true);
  }, []);

  const onConfirm = () => {
    history.push("/dashboard/profile/verifikasi");
  };

  const onCancel = () => {
    setIsAlertOpen(false);
  };

  const verifiedAlert = () => {
    if (userProfile?.verifyStatus == 4) {
      return (
        <>
          <SweetAlert
            show={isAlertOpen}
            title=""
            custom
            btnSize="md"
            onConfirm={onConfirm}
            style={{ padding: "1.25rem" }}
            customButtons={
              <span className="d-flex w-100 justify-content-center" style={{ gap: "0.5rem" }}>
                <Button onClick={onCancel} style={{ color: "var(--ma-blue)" }}>
                  Nanti Saja
                </Button>
                <ButtonBlue onClick={onConfirm}>Ya, lengkapi data</ButtonBlue>
              </span>
            }
          >
            <div className="d-flex justify-content-center flex-column">
              <div style={{ width: "60%", margin: "0 auto" }}>
                <div style={{ width: "214px", height: "145px" }}>
                  <img
                    src={logoBuatAkun}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <span
                style={{ fontWeight: "600", fontSize: "18px", lineHeight: "24px" }}
                className="mt-3"
              >
                Verifikasi Akun
              </span>
              <p>
                Akun Anda belum terverifikasi. Silakan lengkapi data untuk dapat mengikuti berbagai
                event panahan.
              </p>
            </div>
          </SweetAlert>
        </>
      );
    }
    if (userProfile?.verifyStatus == 2) {
      return (
        <>
          <SweetAlert
            show={isAlertOpen}
            title=""
            custom
            btnSize="md"
            onConfirm={onConfirm}
            style={{ padding: "1.25rem" }}
            customButtons={
              <span className="d-flex w-100 justify-content-center" style={{ gap: "0.5rem" }}>
                <Button onClick={onCancel} style={{ color: "var(--ma-blue)" }}>
                  Nanti Saja
                </Button>
                <ButtonBlue onClick={onConfirm}>Ya, lengkapi data</ButtonBlue>
              </span>
            }
          >
            <div className="d-flex justify-content-center flex-column">
              <div style={{ width: "60%", margin: "0 auto" }}>
                <div style={{ width: "214px", height: "145px" }}>
                  <img
                    src={logoBuatAkun}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <span
                style={{ fontWeight: "600", fontSize: "18px", lineHeight: "24px" }}
                className="mt-3"
              >
                Verifikasi Akun
              </span>
              <p>
                Proses verifikasi Anda hampir selesai,
                <br />
                <span>{userProfile?.reasonRejected}</span>
              </p>
            </div>
          </SweetAlert>
        </>
      );
    }
  };

  const statusVerifikasi = () => {
    if (userProfile?.verifyStatus == 4) {
      return (
        <div className="d-flex align-items-center p-2" style={{ backgroundColor: "#F2F8FF" }}>
          <div style={{ width: "24px", height: "24px" }}>
            <img width="100%" height="100%" src={icon} />
          </div>
          <div className="ms-2">
            <span style={{ fontWeight: "600" }}>
              Akun Anda belum terverifikasi. Silakan lengkapi data Anda.
            </span>
          </div>
          <div style={{ width: "60%" }}>
            <Link className="float-end" to="/dashboard/profile/verifikasi">
              <span>Verifikasi Sekarang</span>
            </Link>
          </div>
        </div>
      );
    }

    if (userProfile?.verifyStatus == 3) {
      return (
        <div className="d-flex align-items-center p-2" style={{ backgroundColor: "#F2F8FF" }}>
          <div style={{ width: "24px", height: "24px" }}>
            <img width="100%" height="100%" src={icon} />
          </div>
          <div className="ms-2">
            <span style={{ fontWeight: "600" }}>Akun Anda sedang dalam proses verifikasi.</span>
          </div>
          <div style={{ width: "70%" }}>
            <Link className="float-end" to="/dashboard/profile/verifikasi">
              <span>Halam Verifikasi</span>
            </Link>
          </div>
        </div>
      );
    }

    if (userProfile?.verifyStatus == 2) {
      return (
        <div className="d-flex align-items-center p-2" style={{ backgroundColor: "#fcc8c2" }}>
          <div style={{ width: "24px", height: "24px" }}>
            <img width="100%" height="100%" src={icon} />
          </div>
          <div className="ms-2">
            <span style={{ fontWeight: "600" }}>
              Proses verifikasi ditolak karena {userProfile?.reasonRejected}, silahkan ajukan lagi.
            </span>
          </div>
          <div style={{ width: "70%" }}>
            <Link className="float-end" to="/dashboard/profile/verifikasi">
              <span>Halam Verifikasi</span>
            </Link>
          </div>
        </div>
      );
    }
  };

  return (
    <DashboardWrapper>
      <MetaTags>
        <title>Dashboard | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <div className="mb-2">
          <GreetingUserText>{userProfile}</GreetingUserText>
          <p className="subheading">Selamat datang di myarchery.id</p>
          <div className="mt-3">{statusVerifikasi()}</div>
        </div>

        <DashboardMenus />

        <LatestEventsHeader className="mt-5 mb-4">
          <h3 className="events-heading">3 Event Terbaru yang Diikuti</h3>
          <div className="events-description">
            Lihat semua pertandingan yang diikuti di Menu Event Saya
          </div>
        </LatestEventsHeader>
        <LatestEventsList />
      </Container>

      {verifiedAlert()}
      <PromptPhotoUpload />
    </DashboardWrapper>
  );
}

function PromptPhotoUpload() {
  const history = useHistory();
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const [isPromptOpen, setIsPromptOpen] = React.useState(false);

  useEffect(() => {
    const openPromptAfterDelay = async () => {
      if (userProfile && parseInt(userProfile.verifyStatus) === 1 && !userProfile.avatar) {
        await misc.sleep(750); // 0.75 detik
        setIsPromptOpen(true);
      }
    };

    openPromptAfterDelay();

    // `userProfile` jarang berubah nilainya, akan
    // seringnya dipanggil cuma sekali: waktu pertama render aja.
    // Ini expected.
  }, [userProfile]);

  const handleClickCancel = () => setIsPromptOpen(false);

  const handleClickConfirm = async () => {
    setIsPromptOpen(false);
    await misc.sleep(100);
    history.push("/dashboard/profile/");
  };

  return (
    <SweetAlert
      show={isPromptOpen}
      title=""
      custom
      btnSize="md"
      onConfirm={handleClickConfirm}
      onCancel={handleClickCancel}
      style={{ width: 700, padding: "1.5rem 2rem", borderRadius: "1.25rem" }}
      customButtons={
        <PromptButtonsWrapper>
          <Button onClick={handleClickCancel}>Nanti saja, kembali ke Dashboard</Button>
          <ButtonBlue onClick={handleClickConfirm}>Ya, Lengkapi Data</ButtonBlue>
        </PromptButtonsWrapper>
      }
    >
      <IllustationAlertPrompt />
      <h4>Verifikasi Akun</h4>
      <p className="text-muted">
        Terdapat pembaharuan dalam ketentuan foto profil, lihat ketentuan lebih lanjut
      </p>
    </SweetAlert>
  );
}

/* ========================================= */
// Styles

const LatestEventsHeader = styled.div`
  .events-heading {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .events-description {
    font-size: 0.875rem;
    color: var(--ma-gray-500);
  }
`;

const PromptButtonsWrapper = styled.span`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;

  > button {
    flex-grow: 1;
    flex-basis: 100%;
  }
`;

const IllustationAlertPrompt = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  min-height: 188px;
  background-image: url(${illustrationWarningAlert});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

export default PageDashboard;
