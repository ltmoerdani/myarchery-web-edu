import * as React from "react";
import { useParams, useHistory } from "react-router-dom";
import styled from "styled-components";
import { useUserProfile } from "hooks/user-profile";
import { useWizardView } from "hooks/wizard-view";
import { useEventDetail } from "./hooks/event-detail";
import { useCategoriesByTeam } from "./hooks/categories-by-team";
import { useVerificationDetail } from "./hooks/verification-detail";
import { useFormVerification } from "./hooks/form-verification";
import { useFormOrder } from "./hooks/form-order";

import { ButtonBlue, WizardView, WizardViewContent } from "components/ma";
import { PageWrapper } from "components/ma/page-wrapper";
import { ErrorBoundary } from "components/ma/error-boundary";
import { BannerReservation } from "./components/banner-reservation";
import { FormView } from "./views/form-view";
import { SummaryView } from "./views/summary-view";
import { TicketView } from "./views/ticket-view";
import AdsBanner from "./components/ads-banner";

import { Landingpage } from "services";

import classnames from "classnames";
import ListParticipant from "./views/list-participant";
import { HeaderTitleText } from "./views/list-participant/single-list-participant";

const tabList = [
  { step: 1, label: "Pendaftaran" },
  { step: 2, label: "Data Peserta" },
  { step: 3, label: "Pemesanan" },
];

function PageEventRegistration() {
  const { slug } = useParams();
  const [parentClassificationId, setParentClassification] = React.useState(0);
  React.useEffect(() => {
    (async () => {
      const {
        data: { parentClassification },
      } = await Landingpage.getEventBySlug({ slug });

      setParentClassification(parentClassification);
    })();
  }, []);

  const history = useHistory();
  const { userProfile } = useUserProfile();
  // const { userProfile, refresh: refreshUserProfile } = useUserProfile();

  const { data: eventDetailData, isLoading: isLoadingEventDetail } =
    useEventDetail(slug);

  const { data: eventCategories } = useCategoriesByTeam(eventDetailData?.id);

  const { data: verificationDetail, fetchVerificationDetail } =
    useVerificationDetail(userProfile?.id);

  const wizardView = useWizardView(tabList);
  const { currentStep, goToStep } = wizardView;

  const formVerification = useFormVerification(verificationDetail);

  const formOrder = useFormOrder({
    ...eventCategories,
    parentClassificationId,
  });
  const {
    selectCategoryUser,
    city_id,
    category,
    isCollective,
    asParticipant,
    emailRegisteredList,
    dataParticipant,
  } = formOrder.data;

  const [isOrderSuccess, setOrderSuccess] = React.useState(false);

  const pageTitle =
    "Pendaftaran " + (eventDetailData?.publicInformation.eventName || "");
  const breadcrumbLink = _getLandingPagePath(
    eventDetailData?.publicInformation.eventUrl
  );

  React.useEffect(() => {
    // Scroll to top tiap klik next/previous
    window.scrollTo(0, 0);
  }, [currentStep]);

  const [isRegisterUser, setIsRegisterUser] = React.useState(null);

  React.useEffect(() => {
    if (!isCollective && !asParticipant) {
      if (!emailRegisteredList?.length) {
        setIsRegisterUser(false);
      } else {
        setIsRegisterUser(true);
      }
    }
  }, [isCollective, asParticipant, emailRegisteredList]);
  return (
    <PageWrapper
      pageTitle={pageTitle}
      breadcrumbText={pageTitle}
      breadcrumbLink={breadcrumbLink}
    >
      <ErrorBoundary>
        <ViewLayout>
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

            <Step
              className={classnames({
                "step-active": currentStep === 2,
                "step-done": currentStep > 2,
              })}
              onClick={() => currentStep > 2 && goToStep(2)}
            >
              2. Data Peserta
            </Step>

            <StepArrow>&#10097;</StepArrow>

            <Step className={classnames({ "step-active": currentStep === 3 })}>
              3. Pemesanan
            </Step>
          </StepIndicator>

          <BannerReservation
            category={!isCollective ? selectCategoryUser : category}
            onTimeout={() => history.push(breadcrumbLink)}
            isSuccess={isOrderSuccess}
            eventDetailData={eventDetailData}
            formOrder={formOrder}
          />

          <SplitDisplay>
            <div>
              <WizardView currentStep={currentStep}>
                <WizardViewContent noContainer>
                  <ErrorBoundary>
                    <FormView
                      pageTitle={pageTitle}
                      wizardView={wizardView}
                      userProfile={userProfile}
                      eventCategories={eventCategories}
                      formOrder={formOrder}
                      parentClassificationId={parentClassificationId}
                      formVerification={formVerification}
                      onProfileUpdated={fetchVerificationDetail}
                      eventDetailData={eventDetailData}
                    />
                  </ErrorBoundary>
                </WizardViewContent>

                <WizardViewContent noContainer>
                  <React.Suspense>
                    <ErrorBoundary>
                      <ListParticipant
                        formOrder={formOrder}
                        wizardView={wizardView}
                        eventDetailData={eventDetailData}
                        userProfile={userProfile}
                      />
                    </ErrorBoundary>
                  </React.Suspense>
                </WizardViewContent>
                <SplitDisplay>
                  <WizardViewContent noContainer>
                    <SummaryWrapper>
                      <ErrorBoundary>
                        <SummaryView
                          userProfile={userProfile}
                          formOrder={formOrder}
                        />
                      </ErrorBoundary>

                      {eventDetailData?.parentClassification === 4 ? (
                        <ContigentBox>
                          <ContigentTitle>Kontingen</ContigentTitle>
                          <ContigentContentText>
                            {city_id?.label}
                          </ContigentContentText>
                        </ContigentBox>
                      ) : null}

                      {!isCollective && !asParticipant ? (
                        <ContigentBox>
                          <HeaderTitleText>
                            {isRegisterUser
                              ? "Email Sudah Terdaftar"
                              : "Email Belum Terdaftar"}
                          </HeaderTitleText>
                          <div
                            style={{
                              fontWeight: 400,
                              fontSize: "14px",
                              color: "#1C1C1C",
                              paddingLeft: "10px",
                            }}
                          >
                            {dataParticipant[0]?.email} (
                            {dataParticipant[0]?.name})
                          </div>
                        </ContigentBox>
                      ) : null}
                    </SummaryWrapper>
                  </WizardViewContent>
                  <div>
                    <ErrorBoundary>
                      <TicketView
                        isLoadingEventDetail={isLoadingEventDetail}
                        eventDetailData={eventDetailData}
                        wizardView={wizardView}
                        formVerification={formVerification}
                        parentClassificationId={parentClassificationId}
                        formOrder={formOrder}
                        onSuccessVerification={() => {
                          fetchVerificationDetail();
                          refreshUserProfile();
                        }}
                        onSuccessOrder={() => setOrderSuccess(true)}
                      />
                    </ErrorBoundary>
                  </div>
                </SplitDisplay>

                <ButtonBlue onClick={() => setOrderSuccess(true)}>
                  ok
                </ButtonBlue>
              </WizardView>
            </div>
          </SplitDisplay>
        </ViewLayout>

        <AdsBanner />
      </ErrorBoundary>
    </PageWrapper>
  );
}

/* ==================================== */
// styles

const ViewLayout = styled.div`
  > * + * {
    margin-top: 1rem;
  }
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
  @media (max-width: 460px) {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
  @media (max-width: 300px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
`;

const SummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContigentBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
`;

const ContigentTitle = styled.span`
  font-weight: 400;
  font-size: 0.875rem;
  color: #000000;
`;

const ContigentContentText = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: #1c1c1c;
`;

/* ==================================== */
// utils

function _getLandingPagePath(url) {
  if (!url) {
    return "#";
  }
  const segments = url.split("/");
  const segmentLength = segments.length;
  const path = `/${segments[segmentLength - 3]}/${
    segments[segmentLength - 2]
  }/${segments[segmentLength - 1]}`;
  return path;
}

export default PageEventRegistration;
