import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import classnames from "classnames";
import { useWizardView } from "hooks/wizard-view";
import { ArcheryClubService } from "services";

import MetaTags from "react-meta-tags";
import SweetAlert from "react-bootstrap-sweetalert";
import { Container } from "reactstrap";
import { LoadingScreen } from "components";
import { ButtonBlue, WizardView, WizardViewContent, AvatarClubDefault } from "components/ma";
import { BreadcrumbDashboard } from "../components/breadcrumb";
import { ClubProfileDataView } from "./components/club-data-view";
import { MemberDataListView } from "./components/member-data-view";

import IconTabProfile from "./components/icons-colored/tab-profile";
import IconTabMembers from "./components/icons-colored/tab-members";
import IconChainLink from "./components/icons-mono/chain-link";
import IconAlertTriangle from "components/ma/icons/mono/alert-triangle";

const tabList = [
  { step: 1, label: "Profil", icon: "profile" },
  { step: 2, label: "Data Anggota", icon: "members" },
];

const APP_URL = "https://myarchery.id";
const LANDING_PAGE_ROUTE_PATH = "/clubs/profile/";

function PageClubManage() {
  const { clubId } = useParams();
  const [clubDetail, setClubDetail] = React.useState({});
  const [fieldErrors, setFieldErrors] = React.useState(null);
  const { currentStep, goToStep } = useWizardView(tabList);
  const [landingPageFullURL, setLandingPageFullURL] = React.useState("");
  const [submitStatus, setSubmitStatus] = React.useState({ status: "idle", errors: null });
  const [successfulSavingCounts, setSuccessfulSavingCounts] = React.useState(0);

  const breadcrumbCurrentPageLabel = clubDetail?.name || "Klub";
  const isFetching = submitStatus.status === "fetching";
  const isSubmitSuccess = submitStatus.status === "success";
  const isSubmitError = submitStatus.status === "error";

  const getTabClassNames = (id) => classnames({ "tab-selected": currentStep === id });
  const handleConfirmError = () => setSubmitStatus((state) => ({ ...state, status: "idle" }));

  const updateClubData = (payload) => {
    setClubDetail((state) => ({ ...state, ...payload }));
    // Invalidate errors
    // Required field
    const field = Object.keys(payload)[0];
    const value = Object.values(payload)[0];
    if (fieldErrors?.[field]?.length && value) {
      const updatedErrors = { ...fieldErrors };
      delete updatedErrors[field];
      setFieldErrors(updatedErrors);
    }
  };

  const handleSaveEdits = async () => {
    // validate fields
    const fieldsWithErrors = {};
    const requiredFields = [
      { name: "name", message: "Anda belum memasukkan nama klub" },
      { name: "placeName", message: "Nama tempat latihan belum terisi" },
      { name: "address", message: "Alamat tempat latihan belum terisi" },
      { name: "province", message: "Provinsi belum dipilih" },
      { name: "city", message: "Kota belum dipilih" },
    ];

    for (const field of requiredFields) {
      if (!clubDetail[field.name]) {
        fieldsWithErrors[field.name] = fieldsWithErrors[field.name]
          ? [...fieldsWithErrors[field], field.message]
          : [field.message];
      }
    }

    if (Object.keys(fieldsWithErrors).length) {
      setFieldErrors(fieldsWithErrors);
      return;
    }

    // jalankan ketika valid saja
    setSubmitStatus((state) => ({ ...state, status: "fetching" }));
    const bannerBase64 =
      clubDetail.bannerImage && (await imageToBase64(clubDetail.bannerImage.raw));
    const logoBase64 = clubDetail.logoImage && (await imageToBase64(clubDetail.logoImage.raw));

    const payload = {
      id: clubDetail.id || clubId,
      name: clubDetail.name.trim(),
      banner: bannerBase64,
      logo: logoBase64,
      place_name: clubDetail.placeName.trim(),
      province: clubDetail.province?.value,
      city: clubDetail.city?.value,
      address: clubDetail.address.trim(),
      description: clubDetail.description,
    };

    const result = await ArcheryClubService.edit(payload);
    if (result.success) {
      setSubmitStatus((state) => ({ ...state, status: "success" }));
      setSuccessfulSavingCounts((counts) => counts + 1);
    } else {
      setSubmitStatus((state) => ({
        ...state,
        status: "error",
        errors: result?.errors,
      }));
    }
  };

  React.useEffect(() => {
    const fetchClubData = async () => {
      const result = await ArcheryClubService.getProfile({ club_id: clubId });

      if (result.success) {
        const { detailProvince, detailCity } = result.data;
        setClubDetail({
          ...result.data,
          province:
            detailProvince?.id || detailProvince?.name
              ? {
                  label: detailProvince?.name,
                  value: parseInt(detailProvince?.id) || undefined,
                }
              : null,
          city:
            detailCity?.id || detailCity?.name
              ? {
                  label: detailCity?.name,
                  value: parseInt(detailCity?.id) || undefined,
                }
              : null,
        });
      } else {
        console.log("gak sukses wkwk");
      }
    };
    fetchClubData();
  }, [successfulSavingCounts]);

  React.useEffect(() => {
    if (!clubDetail?.id) {
      return;
    }
    const theHost = process.env.NODE_ENV === "production" ? APP_URL : window.location.host;
    const theFullURL = theHost + LANDING_PAGE_ROUTE_PATH + clubDetail.id;
    setLandingPageFullURL(theFullURL);
  }, [clubDetail?.id]);

  return (
    <ClubManagePageWrapper>
      <MetaTags>
        <title>{clubDetail?.name || "Manage Klub"} | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to="/dashboard/clubs">
          {breadcrumbCurrentPageLabel}
        </BreadcrumbDashboard>

        <div className="club-info-header mb-5">
          <div className="club-logo">
            {clubDetail?.logo ? (
              <img className="club-logo-image" src={clubDetail?.logo} />
            ) : (
              <AvatarClubDefault />
            )}
          </div>

          <div className="club-info-content">
            <h4 className="club-name">{clubDetail?.name}</h4>
            <div className="club-info">
              <LandingPageLinkPlaceholder url={landingPageFullURL} />
            </div>
          </div>

          <div className="club-info-actions">
            <ButtonBlue
              as="a"
              className="button-wide"
              href={LANDING_PAGE_ROUTE_PATH + clubDetail?.id}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lihat Klub
            </ButtonBlue>
          </div>
        </div>

        <div>
          <CardTabs>
            <CardTabItem className={getTabClassNames(1)} onClick={() => goToStep(1)}>
              <span className="icon">
                <IconTabProfile />
              </span>
              <span>Profil Klub</span>
            </CardTabItem>
            <CardTabItem className={getTabClassNames(2)} onClick={() => goToStep(2)}>
              <span className="icon">
                <IconTabMembers />
              </span>
              <span>Data Anggota</span>
            </CardTabItem>{" "}
          </CardTabs>

          <CardViewPanel>
            <WizardView currentStep={currentStep}>
              <WizardViewContent>
                {clubDetail ? (
                  <React.Fragment>
                    <ClubProfileDataView
                      club={clubDetail}
                      updateClubData={updateClubData}
                      errors={fieldErrors}
                      onSave={handleSaveEdits}
                    />

                    <LoadingScreen loading={isFetching} />
                    <AlertSuccess
                      show={isSubmitSuccess}
                      onConfirm={() => setSubmitStatus((state) => ({ ...state, status: "idle" }))}
                    />
                    <AlertErrors
                      show={isSubmitError}
                      onConfirm={handleConfirmError}
                      errors={submitStatus.errors}
                    />
                  </React.Fragment>
                ) : (
                  <div style={{ padding: "2rem", textAlign: "center" }}>
                    <h5>Sedang memuat data klub</h5>
                  </div>
                )}
              </WizardViewContent>

              <WizardViewContent>
                <MemberDataListView club={clubDetail} />
              </WizardViewContent>
            </WizardView>
          </CardViewPanel>
        </div>
      </Container>
    </ClubManagePageWrapper>
  );
}

const ClubManagePageWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";

  .button-wide {
    min-width: 120px;
  }

  .button-light {
    background-color: #eef3fe;
    border: solid 1px #eef3fe;
    color: var(--ma-blue);
  }

  .club-info-header {
    position: relative;
    margin: 0 -1.5rem;
    padding: 1.25rem;

    display: flex;
    gap: 1.25rem;

    .club-logo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      border: solid 1px #eeeeee;
      background-color: var(--ma-gray-400);

      &-image {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }

    .club-info-content {
      flex-grow: 1;
      padding-top: 0.5rem;
    }

    .club-info-actions {
      flex-shrink: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
    }
  }
`;

function LandingPageLinkPlaceholder({ url = "" }) {
  const handleClickCopyLink = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <StyledLandingPageLink onClick={handleClickCopyLink}>
      <StyledLinkInput value={url} placeholder="https://myarchery.id" disabled readOnly />
      <span className="icon-copy">
        <IconChainLink />
      </span>
    </StyledLandingPageLink>
  );
}

const StyledLandingPageLink = styled.div`
  position: relative;
  width: 300px;
  cursor: pointer;

  .icon-copy {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: calc(14px + 1.5rem);
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(238, 243, 254, 0.5);
    color: var(--ma-blue);
  }
`;

const StyledLinkInput = styled.input`
  padding: 0.47rem 0.75rem;
  width: 100%;
  background-color: #eef3fe;
  border-radius: 4px;
  border: solid 1px #eef3fe;
  color: var(--ma-gray-600);
  cursor: pointer;
  transition: box-shadow 0.15s ease-in-out;

  &:hover {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  }
`;

const CardTabs = styled.div`
  display: flex;
`;

const CardTabItem = styled.button`
  overflow: hidden;
  min-width: 12rem;
  padding: 10px;
  border: none;
  border-radius: 8px 8px 0 0;
  background-color: hotpink;
  background-color: #eef3fe;

  display: flex;
  gap: 0.75rem;
  align-items: center;

  color: var(--ma-gray-400);
  font-weight: 600;

  &.tab-selected {
    background-color: #ffffff;
    color: var(--ma-txt-black);

    > .icon {
      opacity: 1;
    }
  }

  > .icon {
    opacity: 0.5;
  }
`;

const CardViewPanel = styled.div`
  position: relative;

  min-height: 12.5rem;
  border-radius: 8px;
  border-top-left-radius: 0;
  border: 0px solid rgb(246, 246, 246);
  box-shadow: rgb(18 38 63 / 3%) 0px 0.75rem 1.5rem;
  background-color: #ffffff;
  background-clip: border-box;
`;

function AlertSuccess({ show, onConfirm }) {
  return (
    <SweetAlert
      show={show}
      title=""
      custom
      btnSize="md"
      style={{ padding: "30px 40px" }}
      onConfirm={onConfirm}
      customButtons={
        <div className="d-flex flex-column w-100">
          <ButtonBlue onClick={onConfirm}>Tutup</ButtonBlue>
        </div>
      }
    >
      <h4>Berhasil</h4>
      <p>Data klub Anda telah berhasil diperbarui</p>
    </SweetAlert>
  );
}

function AlertErrors({ show, onConfirm, errors }) {
  const renderErrorMessages = () => {
    if (errors) {
      const fields = Object.keys(errors);
      const messages = fields.map((field) => {
        return `${errors[field].map((message) => `- ${message}\n`).join("")}`;
      });
      return `${messages.join("")}`;
    }
    return "Error tidak diketahui.";
  };

  return (
    <SweetAlert
      show={show}
      title=""
      custom
      btnSize="md"
      style={{ padding: "30px 40px", width: "720px" }}
      onConfirm={() => onConfirm?.()}
      customButtons={
        <span className="d-flex flex-column w-100">
          <ButtonBlue onClick={onConfirm}>Tutup</ButtonBlue>
        </span>
      }
    >
      <h4>
        <IconAlertTriangle />
      </h4>
      <div className="text-start">
        <p>
          Terdapat error teknis dalam memproses data klub Anda. Silakan berikan pesan error berikut
          kepada technical support:
        </p>
        <pre className="p-3" style={{ backgroundColor: "var(--ma-gray-100)" }}>
          {renderErrorMessages()}
        </pre>
      </div>
    </SweetAlert>
  );
}

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

export default PageClubManage;
