import React from "react";
import styled from "styled-components";
import MetaTags from "react-meta-tags";
import { BreadcrumbDashboard } from "../dashboard/components/breadcrumb";
import { Container as BSContainer, Table as BSTable } from "reactstrap";
import classnames from "classnames";
import { useWizardView } from "hooks/wizard-view";
import { WizardView, WizardViewContent, ButtonBlue, Button, AvatarDefault } from "components/ma";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { FieldInputText, FieldSelectClub } from "./components";
import SweetAlert from "react-bootstrap-sweetalert";
import CurrencyFormat from "react-currency-format";
import {OrderEventService, EventsService} from "services"
import {useParams} from "react-router-dom"

import ImgEvent from "assets/images/myachery/a-1.jpg";
import IconInfo from "components/ma/icons/mono/info";
import IconAlertTriangle from "components/ma/icons/mono/alert-triangle";
import IconAddress from "components/ma/icons/mono/address";
import IconGender from "components/ma/icons/mono/gender";
import IconAge from "components/ma/icons/mono/age";
import IconMail from "components/ma/icons/mono/mail";
import IconBadgeVerified from "components/ma/icons/color/badge-verified";

const tabList = [
  { step: 1, label: "Pendaftaran" },
  { step: 2, label: "Pemesanan" },
];

const PageEventRegistration = () => {
  const [club, setClub] = React.useState({});
  const [detailEvent, setDetailEvent] = React.useState({})

  const breadcrumpCurrentPageLabel = `Pendaftaran ${""}`;
  const {slug} = useParams();

  const { currentStep, goToStep, goToNextStep, goToPreviousStep } = useWizardView(tabList);
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const [submitStatus, dispatchSubmitStatus] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    { status: "idle", errors: null }
  );

  const getEventBySlug = async() => {
    const {data, message, errors} = await EventsService.getDetailEvent({slug: slug})
    if (data) {
      setDetailEvent(data)
      console.log(message)
      console.log(errors)
    } else {
      console.log(message)
      console.log(errors)
    }
  }

  React.useEffect(() => {
    getEventBySlug()
  }, [slug])

  console.log(detailEvent)

  const isErrorSubmit = submitStatus.status === "error";

  const handleSubmitOrder = async () => {
    dispatchSubmitStatus({ status: "loading", errors: null });

    // payload kategory individual
    const payload = {
      event_category_id: category.id,
      club_id: club?.detail.id || 0,
      team_name: teamName || undefined,
      user_id: nonEmptyParticipants.length > 1 ? getUserIdsFromParticipants() : undefined,
    };

    const result = await OrderEventService.registerOfficia(payload);
    if (result.success) {
      dispatchSubmitStatus({ status: "success" });
      history.push(`/dashboard/transactions/${result.data.archeryEventParticipantId}`);
    } else {
      const makeErrorData = () => {
        // handle errors berupa [] / array kosongan
        // dan ketika null
        if (!result.errors?.length) {
          return result.message;
        }
        return result.errors;
      };
      dispatchSubmitStatus({ status: "error", errors: makeErrorData() });
    }
  };

  const getLandingPagePath = (url) => {
    if (!url) {
      return "#";
    }
    const segments = url.split("/");
    const segmentLength = segments.length;
    const path = `/${segments[segmentLength - 3]}/${segments[segmentLength - 2]}/${
      segments[segmentLength - 1]
    }`;
    return path;
  };

  const getClub = (clubValue) => {
    const payload = { ...club };
    payload["club"] = clubValue;
    setClub(payload);
  };

  const handleClickNext = () => {
    goToNextStep();
  };

  console.log(club);
  return (
    <StyledPageWrapper>
      <MetaTags>
        <title>Pendaftaran Official | MyArchery.id</title>
      </MetaTags>
      <Container>
        <BreadcrumbDashboard to={getLandingPagePath()}>
          {breadcrumpCurrentPageLabel}
        </BreadcrumbDashboard>
        <StepIndicator>
          <Step
            className={classnames({
              "step-active": currentStep === 1,
              "step-done": currentStep > 1,
            })}
            onClick={() => currentStep > 1 && goToStep(1)}
          >
            1. Pendaftaran
          </Step>
          <StepArrow>&#10097;</StepArrow>
          <Step className={classnames({ "step-active": currentStep === 2 })}>2. Pemesanan</Step>
        </StepIndicator>

        <SplitDisplay>
          <div>
            <WizardView currentStep={currentStep}>
              <WizardViewContent noContainer>
                <ContentCard>
                  <MainCardHeader>
                    <WrappedIcon>
                      <IconAddress />
                    </WrappedIcon>
                    <MainCardHeaderText>Detail Pendaftaran</MainCardHeaderText>
                  </MainCardHeader>

                  {userProfile ? (
                    <React.Fragment>
                      <FieldInputText
                        placeholder="Nama Pendaftar"
                        disabled
                        value={userProfile.name}
                        onChange={() => {}}
                      >
                        Nama Pendaftar
                      </FieldInputText>

                      <SplitFields>
                        <SplitFieldItem>
                          <FieldInputText
                            placeholder="Email"
                            disabled
                            value={userProfile.email}
                            onChange={() => {}}
                          >
                            Email
                          </FieldInputText>
                        </SplitFieldItem>

                        <SplitFieldItem>
                          <FieldInputText
                            placeholder="No. Telepon"
                            disabled
                            value={userProfile.phoneNumber}
                            onChange={() => {}}
                          >
                            No. Telepon
                          </FieldInputText>
                        </SplitFieldItem>
                      </SplitFields>
                    </React.Fragment>
                  ) : (
                    <div>Sedang memuat data pengguna...</div>
                  )}
                  <div className="mb-3">
                    <h4 className="mt-3">Data Official</h4>
                    <span className="font-size-14">
                      Masukkan email pendaftar yang telah terdaftar
                    </span>
                  </div>
                  <NoticeBar>Kartu ID Official tidak bisa dipindahtangankan</NoticeBar>
                  <FieldInputText
                    required={true}
                    placeholder="Nama lengkap sesuai KTP/KK"
                    onChange={() => {}}
                  >
                    Nama Official
                  </FieldInputText>
                  <FieldSelectClub value={club?.club} onChange={(clubValue) => getClub(clubValue)}>
                    Nama Klub
                  </FieldSelectClub>
                  <SubtleFieldNote>Dapat dikosongkan jika tidak mewakili klub</SubtleFieldNote>
                  <div className="mt-3">
                    <label htmlFor="relation" className="form-label">
                      Hubungan dengan peserta
                    </label>
                    <select id="relation" className="form-select">
                      <option>Pelatih</option>
                      <option>Maneger Klub/Tim</option>
                      <option>Orang Tua</option>
                      <option>Saudara</option>
                      <option>Lainya</option>
                    </select>
                  </div>
                  <FieldInputText placeholder="Nama lengkap sesuai KTP/KK" onChange={() => {}}>
                    Lainnya
                  </FieldInputText>
                </ContentCard>
              </WizardViewContent>

              <WizardViewContent noContainer>
                <ContentCard>
                  <MainCardHeader>
                    <WrappedIcon>
                      <IconAddress />
                    </WrappedIcon>
                    <MainCardHeaderText>Detail Pendaftar</MainCardHeaderText>
                  </MainCardHeader>

                  {userProfile ? (
                    <BSTable responsive className="mt-3">
                      <tbody>
                        <tr>
                          <td>Nama Pendaftar</td>
                          <td width="16">:</td>
                          <td>
                            <div>{userProfile.name}</div>
                          </td>
                        </tr>
                        <tr>
                          <td>Email</td>
                          <td width="16">:</td>
                          <td>
                            <div>{userProfile.email}</div>
                          </td>
                        </tr>
                        <tr>
                          <td>No. Telepon</td>
                          <td width="16">:</td>
                          <td>{userProfile.phoneNumber || <span>&ndash;</span>}</td>
                        </tr>
                      </tbody>
                    </BSTable>
                  ) : (
                    <div>Sedang memuat data pengguna...</div>
                  )}
                </ContentCard>

                <ParticipantCard>
                  <ParticipantHeadingLabel>Data Peserta</ParticipantHeadingLabel>

                  <ParticipantMediaObject>
                    <MediaParticipantAvatar>
                      <ParticipantAvatar>
                        {userProfile?.avatar ? (
                          <img className="club-logo-img" src={userProfile?.avatar} />
                        ) : (
                          <AvatarDefault fullname={userProfile?.name} />
                        )}
                      </ParticipantAvatar>
                    </MediaParticipantAvatar>

                    <MediaParticipantContent>
                      <ParticipantName>
                        <span>{userProfile?.name}</span>
                        <span>
                          <IconBadgeVerified />
                        </span>
                      </ParticipantName>

                      <LabelWithIcon icon={<IconMail size="20" />}>
                        {userProfile?.email}
                      </LabelWithIcon>

                      <RowedLabel>
                        <LabelWithIcon icon={<IconGender size="20" />}>
                          {(userProfile?.gender === "male" && "Laki-laki") ||
                            (userProfile?.gender === "female" && "Perempuan")}
                        </LabelWithIcon>

                        <LabelWithIcon icon={<IconAge size="20" />}>
                          {userProfile?.age} Tahun
                        </LabelWithIcon>
                      </RowedLabel>
                    </MediaParticipantContent>
                  </ParticipantMediaObject>
                </ParticipantCard>

                {/* {participants */}
                {/* .filter((member) => Boolean(member.data)) */}
                {/* .map((participant) => ( */}
                {/* <ParticipantCard>
                      <ParticipantHeadingLabel>Data Peserta</ParticipantHeadingLabel>

                      <ParticipantMediaObject>
                        <MediaParticipantAvatar>
                          <ParticipantAvatar>
                            
                              <AvatarDefault fullname="ilham" />
                          </ParticipantAvatar>
                        </MediaParticipantAvatar>

                        <MediaParticipantContent>
                          <ParticipantName>
                            <span>Ilham</span>
                            <span>
                              <IconBadgeVerified />
                            </span>
                          </ParticipantName>

                          <LabelWithIcon icon={<IconMail size="20" />}>
                          msatrio1utomo@gmail.com
                          </LabelWithIcon>

                          <RowedLabel>
                            <LabelWithIcon icon={<IconGender size="20" />}>
                              {("male" === "male" && "Laki-laki") ||
                                (participant.data.gender === "female" && "Perempuan")}
                            </LabelWithIcon>

                            <LabelWithIcon icon={<IconAge size="20" />}>
                              24 Tahun
                            </LabelWithIcon>
                          </RowedLabel>
                        </MediaParticipantContent>
                      </ParticipantMediaObject>
                    </ParticipantCard> */}
                {/* ))} */}
              </WizardViewContent>
            </WizardView>
          </div>
          <div>
            <TicketCard>
              <h4 className="mb-3">Tiket Lomba</h4>
              <EventMediaObject>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      overflow: "hidden",
                      width: 60,
                      height: 60,
                      borderRadius: 4,
                    }}
                  >
                    <img
                      src={ImgEvent}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </span>
                </div>

                <EventMediaObjectContent>
                  <h5>The HuB Scoring - 2021</h5>
                  <p className="mb-0">Lapangan Panahan Utama - The Hub Cibubur</p>
                </EventMediaObjectContent>
              </EventMediaObject>

              <TicketDivider />

              <TicketSectionDetail>
                <div>
                  <DetailLabel>Jenis Regu</DetailLabel>
                  <DetailValue>
                    <React.Fragment>Official</React.Fragment>
                  </DetailValue>
                </div>

                <div>
                  <DetailLabel>Jumlah Peserta</DetailLabel>
                  <DetailValue>1 Orang</DetailValue>
                </div>
              </TicketSectionDetail>
              <div className="d-flex flex-column justify-content-between">
                <TicketSectionTotal>
                  <LabelTotal>Total Pembayaran</LabelTotal>
                  <TotalWithCurrency
                    displayType={"text"}
                    value={200000}
                    prefix="Rp"
                    thousandSeparator={"."}
                    decimalSeparator={","}
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </TicketSectionTotal>

                {currentStep === 1 ? (
                  <ButtonBlue onClick={handleClickNext}>Selanjutnya</ButtonBlue>
                ) : (
                  <React.Fragment>
                    <ButtonConfirmPayment
                      onConfirm={() => handleSubmitOrder()}
                      onCancel={() => goToPreviousStep()}
                    />
                    <AlertSubmitError
                      isError={isErrorSubmit}
                      errors={submitStatus.errors}
                      onConfirm={() => dispatchSubmitStatus({ status: "idle" })}
                    />
                  </React.Fragment>
                )}
              </div>
            </TicketCard>
          </div>
        </SplitDisplay>
      </Container>
    </StyledPageWrapper>
  );
};

const StyledPageWrapper = styled.div`
  font-family: "Inter", sans-serif;
`;

const Container = styled(BSContainer)`
  margin-bottom: 5rem;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  padding: 6px 0.75rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const Step = styled.span`
  flex-basis: 100%;
  display: inline-block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  font-weight: 600;

  &.step-active {
    background-color: var(--ma-blue-primary-50);
    color: var(--ma-blue);
    font-weight: 600;
  }

  &.step-done {
    cursor: pointer;
    background-color: var(--ma-blue-primary-50);
    font-weight: 400;
  }
`;

const StepArrow = styled.span`
  width: 120px;
  padding: 0.5rem 0.75rem;
  text-align: center;
`;

const SplitDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 2rem 1rem;
`;

const ContentCard = styled.div`
  margin-bottom: 1rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const MainCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const MainCardHeaderText = styled.h4`
  margin: 0;
`;

const WrappedIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: solid 1px #c4c4c4;
`;

const SplitFields = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.375rem;
`;

const SplitFieldItem = styled.div`
  flex: 1 1 13.75rem;
`;

const TicketCard = styled(ContentCard)`
  box-shadow: 0px 7.84391px 15.6878px rgba(18, 38, 63, 0.0313726);
`;

const SubtleFieldNote = styled.div`
  color: var(--ma-gray-400);
`;

function NoticeBar({ children }) {
  return (
    <StyledNoticeBar>
      <span>
        <IconInfo />
      </span>
      <span>{children}</span>
    </StyledNoticeBar>
  );
}

const StyledNoticeBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--ma-blue-primary-50);
  color: var(--ma-blue);
`;

const EventMediaObject = styled.div`
  display: flex;
  gap: 1rem;
`;

const EventMediaObjectContent = styled.div`
  flex: 1 1 0%;
  margin: auto;
`;

const TicketDivider = styled.hr`
  margin: 2rem 0;
`;

const TicketSectionDetail = styled.div`
  margin-bottom: 4rem;
`;

const DetailLabel = styled.h6`
  font-weight: 400;
`;

const DetailValue = styled.p`
  font-size: 15px;
  font-weight: 600;
  text-transform: capitalize;
`;

const TicketSectionTotal = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const LabelTotal = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const TotalWithCurrency = styled(CurrencyFormat)`
  color: var(--ma-blue);
  font-size: 18px;
  font-weight: 600;
`;

const ParticipantCard = styled.div`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const ParticipantHeadingLabel = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  background-color: var(--ma-blue-primary-50);
  font-size: 15px;
  font-weight: 600;
`;

const ParticipantMediaObject = styled.div`
  margin: 1.25rem 0;
  display: flex;
  gap: 1.5rem;
`;

const MediaParticipantAvatar = styled.div`
  flex-grow: 0;
`;

const ParticipantAvatar = styled.div`
  overflow: hidden;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
`;

const MediaParticipantContent = styled.div`
  margin: auto 0;
`;

const ParticipantName = styled.h5`
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
`;

const RowedLabel = styled.div`
  display: flex;
  gap: 1.5rem;
`;

function LabelWithIcon({ icon, children }) {
  return (
    <StyledLabelWithIcon>
      {icon && <span className="label-icon">{icon}</span>}
      <span>{children}</span>
    </StyledLabelWithIcon>
  );
}

const StyledLabelWithIcon = styled.p`
  margin: 0;
  margin-bottom: 0.5rem;
  color: var(--ma-gray-500);

  .label-icon {
    margin-right: 0.5rem;
  }
`;

function ButtonConfirmPayment({ onConfirm, onCancel }) {
  const [isAlertOpen, setAlertOpen] = React.useState(false);

  const handleConfirmSubmit = () => {
    setAlertOpen(false);
    onConfirm?.();
  };

  const handleCancelSubmit = () => {
    setAlertOpen(false);
    onCancel?.();
  };

  return (
    <React.Fragment>
      <ButtonBlue onClick={() => setAlertOpen(true)}>Lanjutkan Pembayaran</ButtonBlue>
      <SweetAlert
        show={isAlertOpen}
        title=""
        custom
        btnSize="md"
        onConfirm={handleConfirmSubmit}
        style={{ padding: "1.25rem" }}
        customButtons={
          <span className="d-flex flex-column w-100" style={{ gap: "0.5rem" }}>
            <Button onClick={handleCancelSubmit} style={{ color: "var(--ma-blue)" }}>
              Cek Kembali
            </Button>
            <ButtonBlue onClick={handleConfirmSubmit}>Sudah Benar</ButtonBlue>
          </span>
        }
      >
        <p>Apakah data pemesanan Anda sudah benar?</p>
      </SweetAlert>
    </React.Fragment>
  );
}

function AlertSubmitError({ isError, errors, onConfirm }) {
  const [isAlertOpen, setAlertOpen] = React.useState(false);

  const renderErrorMessages = () => {
    if (errors && typeof errors === "string") {
      return errors;
    }

    if (errors) {
      const fields = Object.keys(errors);
      const messages = fields.map(
        (field) => `${errors[field].map((message) => `- ${message}\n`).join("")}`
      );
      if (messages.length) {
        return `${messages.join("")}`;
      }
    }

    return "Error tidak diketahui.";
  };

  const handleConfirm = () => {
    setAlertOpen(false);
    onConfirm?.();
  };

  React.useEffect(() => {
    if (!isError) {
      return;
    }
    setAlertOpen(true);
  }, [isError]);

  return (
    <React.Fragment>
      <SweetAlert
        show={isAlertOpen}
        title=""
        custom
        btnSize="md"
        style={{ padding: "30px 40px", width: "720px" }}
        onConfirm={handleConfirm}
        customButtons={
          <span className="d-flex flex-column w-100">
            <ButtonBlue onClick={handleConfirm}>Tutup</ButtonBlue>
          </span>
        }
      >
        <h4>
          <IconAlertTriangle />
        </h4>
        <div className="text-start">
          <p>
            Terdapat kendala teknis dalam memproses data. Coba kembali beberapa saat lagi, atau
            silakan berikan pesan error berikut kepada technical support:
          </p>
          <pre className="p-3" style={{ backgroundColor: "var(--ma-gray-100)" }}>
            {renderErrorMessages()}
          </pre>
        </div>
      </SweetAlert>
    </React.Fragment>
  );
}

export default PageEventRegistration;
