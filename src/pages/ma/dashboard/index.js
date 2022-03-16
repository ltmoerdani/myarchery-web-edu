import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import LatestEventsList from "./components/latest-events";
import DashboardMenus from "./components/menus";
import SweetAlert from "react-bootstrap-sweetalert";
import { useHistory } from "react-router-dom";
import { Button, ButtonBlue } from "components/ma";
import logoBuatAkun from "assets/images/myachery/Illustration.png";

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
    if (userProfile?.verifyStatus == 4){

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
              <span style={{ fontWeight: "600", fontSize: "18px", lineHeight: "24px" }} className="mt-3">
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
  };
  return (
    <DashboardWrapper>
      <MetaTags>
        <title>Dashboard | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <div className="mb-5">
          <GreetingUserText>{userProfile}</GreetingUserText>
          <p className="subheading">Selamat datang di myarchery.id</p>
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
    </DashboardWrapper>
  );
}

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

export default PageDashboard;
