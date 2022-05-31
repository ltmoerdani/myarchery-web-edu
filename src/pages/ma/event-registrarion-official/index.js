import * as React from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import styled from "styled-components";
import queryString from "query-string";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { useWizardView } from "hooks/wizard-view";
import { EventsService, OrderEventService } from "services";


import IconInfo from "components/ma/icons/mono/info";
import MetaTags from "react-meta-tags";
import { Container as BSContainer, Table as BSTable } from "reactstrap";
import CurrencyFormat from "react-currency-format";
import SweetAlert from "react-bootstrap-sweetalert";
import { LoadingScreen } from "components";
import {
  WizardView,
  WizardViewContent,
  Button,
  ButtonBlue,
  AvatarDefault,
  AlertSubmitError,
} from "components/ma";
import { BreadcrumbDashboard } from "../dashboard/components/breadcrumb";
import { 
  FieldInputText, 
  // FieldSelectCategory, 
  FieldSelectClub 
} from "./components";

import IconAddress from "components/ma/icons/mono/address";
import IconBadgeVerified from "components/ma/icons/color/badge-verified";

import classnames from "classnames";
import { stringUtil, errorsUtil } from "utils";
import AdsBanner from "./components/ads-banner";

const tabList = [
  { step: 1, label: "Pendaftaran" },
  { step: 2, label: "Pemesanan" },
];

const initialFormState = {
  data: {
    category: null,
    club: null,
    participants: [
      { name: `member-email-${stringUtil.createRandom()}`, data: null },
      { name: `member-email-${stringUtil.createRandom()}`, data: null },
      { name: `member-email-${stringUtil.createRandom()}`, data: null },
    ],
  },
  errors: {},
};

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
  const [formData, updateFormData] = React.useReducer(formReducer, initialFormState);
  const [submitStatus, dispatchSubmitStatus] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    { status: "idle", errors: null }
  );

  const { category, club, 
    // participants 
  } = formData.data;
  const formErrors = formData.errors;
  const eventDetailData = eventDetail?.data;
  const isLoadingEventDetail = eventDetail.status === "loading";
  const eventId = eventDetailData?.id;
  const breadcrumpCurrentPageLabel = `Pendaftaran ${
    eventDetailData?.publicInformation.eventName || ""
  }`;
  const isLoadingSubmit = submitStatus.status === "loading";
  const isErrorSubmit = submitStatus.status === "error";
  // const participantCounts = participants.filter((member) => Boolean(member.data))?.length;

  const matchesTeamCategoryId = (id) => category?.teamCategoryId === id;
  const isCategoryIndividu = ["individu male", "individu female"].some(matchesTeamCategoryId);

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

  const handleClickNext = () => {
    let validationErrors = {};
    // if (!category?.id) {
    //   validationErrors = { ...validationErrors, category: ["Kategori harus dipilih"] };
    // }

    // Kategori tim secara umum
    // if (
    //   category?.id &&
    //   ["individu male", "individu female"].every((team) => team !== category?.teamCategoryId)
    // ) {
      if (!club?.detail.id) {
        validationErrors = { ...validationErrors, club: ["Klub harus dipilih"] };
      }
    // }

    updateFormData({ type: "FORM_INVALID", errors: validationErrors });

    const isValid = !Object.keys(validationErrors)?.length;
    if (isValid) {
      goToNextStep();
    }
  };

  const handleSubmitOrder = async () => {
    dispatchSubmitStatus({ status: "loading", errors: null });

    const payload = {
      // team_category_id : category.teamCategoryId,
      // age_category_id : category.ageCategoryId,
      // competition_category_id : category.competitionCategoryId,
      // distance_id : category.distanceId,
      club_id: club?.detail.id || 0,
      event_id: eventDetail?.data?.id,
    };

    const result = await OrderEventService.registerOfficial(payload);
    if (result.success) {
      dispatchSubmitStatus({ status: "success" });
      history.push(`/dashboard/transactions-official/${result?.data?.archeryEventOfficial?.eventOfficialDetailId}`);
    } else {
      const errorData = errorsUtil.interpretServerErrors(result);
      dispatchSubmitStatus({ status: "error", errors: errorData });
      history.push(`/dashboard/list-transaction`);
    }
  };

  React.useEffect(() => {
    const getEventDetail = async () => {
      updateEventDetail({ status: "loading", errors: null });
      const result = await EventsService.getDetailEvent({ slug });
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
      const result = await EventsService.getCategory({ event_id: eventId });
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

    category && updateFormData({ category });
  }, [eventCategories]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  console.log(eventDetail, 'detail');

  return (
    <StyledPageWrapper>
      <MetaTags>
        <title>
          Pendaftaran {eventDetailData?.publicInformation.eventName || ""} | MyArchery.id
        </title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to={getLandingPagePath(eventDetailData?.publicInformation.eventUrl)}>
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

                  <SplitFieldItem>
                    <FieldInputText
                      placeholder="Kategori"
                      value="Official"
                      onChange={() => {}}
                    >
                      Kategori
                    </FieldInputText>
                  </SplitFieldItem>

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
                  <NoticeBar>Kartu ID Official tidak bisa dipindahtangankan</NoticeBar>
                  <h4 className="mt-3">Data Official</h4>

                  <FieldSelectClub
                    required={category?.id && !isCategoryIndividu}
                    value={club}
                    onChange={(clubValue) => updateFormData({ club: clubValue })}
                    errors={formErrors.club}
                  >
                    Nama Klub
                  </FieldSelectClub>
                  {isCategoryIndividu && (
                    <SubtleFieldNote>Dapat dikosongkan jika tidak mewakili klub</SubtleFieldNote>
                  )}
                  {/* <FieldSelectCategory
                    required
                    groupedOptions={eventCategories?.data}
                    value={category}
                    onChange={(category) => {
                      updateFormData({ type: "FORM_INVALID", errors: {} });
                      updateFormData({
                        type: "CHANGE_CATEGORY",
                        default: userProfile,
                        payload: category,
                      });
                    }}
                    errors={formErrors.category}
                  >
                    Kategori Lomba
                  </FieldSelectCategory> */}
                  
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

                {isCategoryIndividu && (
                  <ParticipantCard>
                    <ParticipantHeadingLabel>Data Official</ParticipantHeadingLabel>

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

                        <LabelWithIcon >
                          {club?.detail.name}
                        </LabelWithIcon>

                      </MediaParticipantContent>
                    </ParticipantMediaObject>
                  </ParticipantCard>
                )}

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
                      Official 
                      {/* {category?.categoryLabel || category?.teamCategoryId || (
                        <React.Fragment>&ndash;</React.Fragment>
                      )} */}
                    </DetailValue>
                  </div>

                  {/* <div>
                    <DetailLabel>Jumlah Peserta</DetailLabel>
                    {isCategoryIndividu ? (
                      <DetailValue>1 Orang</DetailValue>
                    ) : participantCounts > 0 ? (
                      <DetailValue>{participantCounts} Orang</DetailValue>
                    ) : (
                      <DetailValue muted>&mdash;</DetailValue>
                    )}
                  </div> */}
                </TicketSectionDetail>

                <div className="d-flex flex-column justify-content-between">
                  <TicketSectionTotal>
                    <div>
                      <LabelTotal>Total Pembayaran</LabelTotal>
                    </div>
                    <div>
                      {eventDetail?.data?.officialFee ? (
                        <>
                          {/* <CurrencyFormat
                            style={{ textDecoration: "line-through" }}
                            className="me-2"
                            displayType={"text"}
                            value={category?.fee ? Number(eventDetail?.data?.officialFee) : 0}
                            prefix="Rp"
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            decimalScale={0}
                            fixedDecimalScale
                          /> */}
                          <TotalWithCurrency
                            displayType={"text"}
                            value={Number(eventDetail?.data?.officialFee)}
                            prefix="Rp"
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            decimalScale={0}
                            fixedDecimalScale
                          />
                        </>
                      ) : (
                        <>
                          <TotalWithCurrency
                            displayType={"text"}
                            value={Number(eventDetail?.data?.officialFee)}
                            prefix="Rp"
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            decimalScale={0}
                            fixedDecimalScale
                          />
                        </>
                      )}
                    </div>
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
        <AdsBanner/>
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
  padding-bottom: 2.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const MainCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const SubtleFieldNote = styled.div`
  color: var(--ma-gray-400);
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

const isTextMuted = ({ muted }) => (muted ? "color: var(--ma-gray-400);" : "");

const DetailValue = styled.p`
  font-size: 15px;
  font-weight: 600;
  text-transform: capitalize;
  ${isTextMuted}
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
  if (action.type === "CHANGE_CATEGORY") {
    // Kasih default user profile hanya kalau kategorinya individual
    // selain itu reset ke kosongan semua
    const nextParticipantsState = state.data.participants.map((member) => ({
      ...member,
      data: null,
    }));

    return {
      ...state,
      data: {
        ...state.data,
        category: action.payload,
        // reset field-field data peserta
        teamName: "",
        // club: null,
        participants: nextParticipantsState,
      },
    };
  }

  if (action.type === "FIELD_MEMBER_EMAIL") {
    const nextParticipantsState = state.data.participants.map((member) => {
      if (member.name === action.name) {
        return { ...member, data: action.payload };
      }
      return member;
    });

    return {
      ...state,
      data: { ...state.data, participants: nextParticipantsState },
    };
  }

  if (action.type === "FORM_INVALID") {
    return {
      ...state,
      errors: action.errors,
    };
  }

  if (action) {
    return {
      ...state,
      data: { ...state.data, ...action },
    };
  }

  return state;
}

export default PageEventRegistration;
