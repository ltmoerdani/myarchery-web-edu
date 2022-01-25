import * as React from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import styled from "styled-components";
import queryString from "query-string";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { useWizardView } from "hooks/wizard-view";
import { CategoryService, OrderEventService } from "services";

import MetaTags from "react-meta-tags";
import { Container as BSContainer, Table as BSTable } from "reactstrap";
import CurrencyFormat from "react-currency-format";
import SweetAlert from "react-bootstrap-sweetalert";
import { LoadingScreen } from "components";
import { WizardView, WizardViewContent, Button, ButtonBlue, AvatarDefault } from "components/ma";
import { BreadcrumbDashboard } from "../dashboard/components/breadcrumb";
import { FieldInputText, FieldSelectCategory, FieldSelectClub } from "./components";

import IconAddress from "components/ma/icons/mono/address";
import IconGender from "components/ma/icons/mono/gender";
import IconAge from "components/ma/icons/mono/age";
import IconMail from "components/ma/icons/mono/mail";
import IconAlertTriangle from "components/ma/icons/mono/alert-triangle";
import IconBadgeVerified from "components/ma/icons/color/badge-verified";

import classnames from "classnames";

const tabList = [
  { step: 1, label: "Pendaftaran" },
  { step: 2, label: "Pemesanan" },
];

function PageEventRegistration() {
  const { slug } = useParams();
  const { search } = useLocation();
  const { categoryId } = queryString.parse(search);
  const history = useHistory();

  const { currentStep, goToNextStep, goToPreviousStep, goToStep } = useWizardView(tabList);
  const [eventDetail, updateEventDetail] = React.useReducer(eventDetailReducer, {
    status: "idle",
    data: null,
    errors: null,
  });
  const [eventCategories, updateEventCategories] = React.useReducer(eventCategoriesReducer, {
    status: "idle",
    data: null,
    errors: null,
  });
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const [formData, updateFormData] = React.useReducer(formReducer, {
    data: { category: null, club: null },
    errors: {},
  });
  const [submitStatus, dispatchSubmitStatus] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    { status: "idle", errors: null }
  );

  const { category, club } = formData.data;
  const eventDetailData = eventDetail?.data;
  const isLoadingEventDetail = eventDetail.status === "loading";
  const eventId = eventDetailData?.id;
  const breadcrumpCurrentPageLabel = `Pendaftaran ${
    eventDetailData?.publicInformation.eventName || ""
  }`;
  const isLoadingSubmit = submitStatus.status === "loading";
  const isErrorSubmit = submitStatus.status === "error";
  const participantCounts = 1;

  const handleClickNext = () => {
    let validationErrors = {};
    if (!category?.id) {
      validationErrors = { ...validationErrors, category: ["Kategori harus dipilih"] };
    }
    if (!club?.detail.id) {
      validationErrors = { ...validationErrors, club: ["Klub harus dipilih"] };
    }
    updateFormData({ errors: validationErrors });

    const isValid = !Object.keys(validationErrors)?.length;
    if (isValid) {
      goToNextStep();
    }
  };

  const handleSubmitOrder = async () => {
    dispatchSubmitStatus({ status: "loading", errors: null });
    // payload kategory individual
    const payload = {
      event_category_id: category.id,
      club_id: club.detail.id,
    };
    const result = await OrderEventService.register(payload);
    if (result.success) {
      dispatchSubmitStatus({ status: "success" });
      history.push(`/dashboard/transactions/${result.data.id}`);
    } else {
      dispatchSubmitStatus({ status: "error", errors: result.errors || result.message });
    }
  };

  React.useEffect(() => {
    const getEventDetail = async () => {
      updateEventDetail({ status: "loading", errors: null });
      const result = await CategoryService.getDetailEvent({ slug });
      if (result.success) {
        updateEventDetail({ status: "success", data: result.data });
      } else {
        updateEventDetail({ status: "error", errors: result.errors });
      }
    };

    getEventDetail();
  }, []);

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    const getCategories = async () => {
      updateEventCategories({ status: "loading", errors: null });
      const result = await CategoryService.getCategory({ event_id: eventId });
      if (result.success) {
        updateEventCategories({ status: "success", data: result.data });
      } else {
        updateEventCategories({ status: "error", errors: result.errors });
      }
    };
    getCategories();
  }, [eventId]);

  React.useEffect(() => {
    if (!eventCategories.data) {
      return;
    }

    let category;
    for (const group in eventCategories.data) {
      const targetCategory = eventCategories.data[group].find(
        (category) => parseInt(category.id) === parseInt(categoryId)
      );
      if (targetCategory) {
        category = targetCategory;
        break;
      }
    }

    category && updateFormData({ type: "FIELD", payload: { category } });
  }, [eventCategories]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  return (
    <StyledPageWrapper>
      <MetaTags>
        <title>
          Pendaftaran {eventDetailData?.publicInformation.eventName || ""} | MyArchery.id
        </title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to="#">{breadcrumpCurrentPageLabel}</BreadcrumbDashboard>

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

                  <FieldSelectCategory
                    groupedOptions={eventCategories?.data}
                    value={category}
                    onChange={(category) =>
                      updateFormData({ type: "FIELD", payload: { category } })
                    }
                  >
                    Kategori Lomba
                  </FieldSelectCategory>

                  <FieldInputText
                    placeholder="Nama Pendaftar"
                    disabled
                    value={userProfile.name}
                    onChange={() => {}}
                  >
                    Nama Pendaftar
                  </FieldInputText>

                  <SplitFields>
                    <FieldInputText
                      placeholder="Email"
                      disabled
                      value={userProfile.email}
                      onChange={() => {}}
                    >
                      Email
                    </FieldInputText>

                    <FieldInputText
                      placeholder="No. Telepon"
                      disabled
                      value={userProfile.phoneNumber}
                      onChange={() => {}}
                    >
                      No. Telepon
                    </FieldInputText>
                  </SplitFields>

                  <div className="mt-5 mb-0">
                    <h5>Data Peserta</h5>
                  </div>

                  <FieldSelectClub
                    value={club}
                    onChange={(club) => updateFormData({ type: "FIELD", payload: { club } })}
                  >
                    Nama Klub
                  </FieldSelectClub>
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
                </ContentCard>

                <ContentCard>
                  <ClubDetailLabel>Nama Klub</ClubDetailLabel>
                  <ClubDetailValue>{club?.detail.name}</ClubDetailValue>
                </ContentCard>

                <ParticipantCard>
                  <ParticipantHeadingLabel>Data Peserta</ParticipantHeadingLabel>

                  <ParticipantMediaObject>
                    <MediaParticipantAvatar>
                      <ParticipantAvatar>
                        <AvatarDefault fullname={userProfile.name} />
                      </ParticipantAvatar>
                    </MediaParticipantAvatar>

                    <MediaParticipantContent>
                      <ParticipantName>
                        <span>{userProfile.name}</span>
                        <span>
                          <IconBadgeVerified />
                        </span>
                      </ParticipantName>

                      <LabelWithIcon icon={<IconMail size="20" />}>
                        {userProfile.email}
                      </LabelWithIcon>

                      <RowedLabel>
                        <LabelWithIcon icon={<IconGender size="20" />}>
                          {(userProfile.gender === "male" && "Laki-laki") ||
                            (userProfile.gender === "female" && "Perempuan")}
                        </LabelWithIcon>

                        <LabelWithIcon icon={<IconAge size="20" />}>
                          {userProfile.age} Tahun
                        </LabelWithIcon>
                      </RowedLabel>
                    </MediaParticipantContent>
                  </ParticipantMediaObject>
                </ParticipantCard>
              </WizardViewContent>
            </WizardView>
          </div>

          <div>
            {isLoadingEventDetail ? (
              <TicketCard>Sedang memuat data event...</TicketCard>
            ) : eventDetailData ? (
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
                        src={eventDetailData?.publicInformation.eventBanner}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </span>
                  </div>

                  <EventMediaObjectContent>
                    <h5>{eventDetailData?.publicInformation.eventName}</h5>
                    <p className="mb-0">{eventDetailData?.publicInformation.eventLocation}</p>
                  </EventMediaObjectContent>
                </EventMediaObject>

                <TicketDivider />

                <TicketSectionDetail>
                  <div>
                    <DetailLabel>Jenis Regu</DetailLabel>
                    <DetailValue>
                      {category?.teamCategoryDetail?.label || category?.teamCategoryId || (
                        <React.Fragment>&ndash;</React.Fragment>
                      )}
                    </DetailValue>
                  </div>

                  <div>
                    <DetailLabel>Kategori</DetailLabel>
                    <DetailValue>
                      {category?.categoryLabel || <React.Fragment>&ndash;</React.Fragment>}
                    </DetailValue>
                  </div>

                  <div>
                    <DetailLabel>Jumlah Peserta</DetailLabel>
                    <DetailValue>{participantCounts} Orang</DetailValue>
                  </div>
                </TicketSectionDetail>

                <div className="d-flex flex-column justify-content-between">
                  <TicketSectionTotal>
                    <LabelTotal>Total Pembayaran</LabelTotal>
                    <TotalWithCurrency
                      displayType={"text"}
                      value={category ? Number(category?.fee) : 0}
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
            ) : (
              <TicketCard>Ada kesalahan dalam memuat data.</TicketCard>
            )}
          </div>
        </SplitDisplay>
      </Container>
      <LoadingScreen loading={isLoadingSubmit} />
    </StyledPageWrapper>
  );
}

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
  gap: 1.375rem;
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

const ClubDetailLabel = styled.h6`
  font-size: 12px;
  font-weight: 400;
`;

const ClubDetailValue = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
`;

const EventMediaObject = styled.div`
  display: flex;
  gap: 1rem;
`;

const EventMediaObjectContent = styled.div`
  flex: 1 1 0%;
  margin: auto;
`;

const TicketCard = styled(ContentCard)`
  box-shadow: 0px 7.84391px 15.6878px rgba(18, 38, 63, 0.0313726);
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

function eventDetailReducer(state, action) {
  if (action) {
    return { ...state, ...action };
  }
  return state;
}

function eventCategoriesReducer(state, action) {
  if (action) {
    return { ...state, ...action };
  }
  return state;
}

function formReducer(state, action) {
  if (action.type === "FIELD") {
    return {
      ...state,
      data: { ...state.data, ...action.payload },
    };
  }
  if (action) {
    return { ...state, ...action };
  }
  return state;
}

export default PageEventRegistration;
