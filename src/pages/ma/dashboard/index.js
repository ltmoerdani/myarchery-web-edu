import * as React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useUserProfile } from "hooks/user-profile";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue } from "components/ma";
import DashboardMenus from "./components/menus";
import LatestEventsList from "./components/latest-events";

import { misc } from "utils";

import illustrationWarningAlert from "assets/images/alert-publication.svg";

function PageDashboard() {
  const { userProfile } = useUserProfile();

  return (
    <DashboardWrapper>
      <MetaTags>
        <title>Dashboard | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <div className="mb-5">
          <GreetingUserText>{userProfile}</GreetingUserText>
          <p className="subheading">Selamat datang di myarchery.id</p>

          {/* Komponen `StatusVerifikasi` gak dirender karena sekarang gak pakai (?) */}
          {/* Modul komponennya masih bisa diakses di folder `./components/verification-status` */}
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

      <PromptPhotoUpload />
    </DashboardWrapper>
  );
}

function GreetingUserText({ children }) {
  const text = children ? `Halo, ${children.name}` : "Halo!";
  return <h1 className="heading">{text}</h1>;
}

function PromptPhotoUpload() {
  const history = useHistory();
  const { userProfile } = useUserProfile();
  const [isPromptOpen, setIsPromptOpen] = React.useState(false);

  const hasAvatar = Boolean(userProfile?.avatar);
  const verifyStatus = userProfile?.verifyStatus
    ? parseInt(userProfile?.verifyStatus)
    : userProfile?.verifyStatus;

  React.useEffect(() => {
    const openPromptAfterDelay = async () => {
      if (verifyStatus === 1 && !hasAvatar) {
        await misc.sleep(500); // 0.5 detik
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

const DashboardWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter", sans-serif;

  .heading {
    font-weight: 500;
    color: #000000;
  }
`;

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
