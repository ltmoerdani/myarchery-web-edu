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

import { WizardView, WizardViewContent } from "components/ma";
import { PageWrapper } from "components/ma/page-wrapper";
import { BannerReservation } from "./components/banner-reservation";
import { FormView } from "./views/form-view";
import { SummaryView } from "./views/summary-view";
import { TicketView } from "./views/ticket-view";
import AdsBanner from "./components/ads-banner";

import classnames from "classnames";

const tabList = [
  { step: 1, label: "Pendaftaran" },
  { step: 2, label: "Pemesanan" },
];

function PageEventRegistration() {
  const { slug } = useParams();
  const history = useHistory();
  const { userProfile, refresh: refreshUserProfile } = useUserProfile();

  const { data: eventDetailData, isLoading: isLoadingEventDetail } = useEventDetail(slug);
  const { data: eventCategories } = useCategoriesByTeam(eventDetailData?.id);
  const { data: verificationDetail, fetchVerificationDetail } = useVerificationDetail(
    userProfile.id
  );

  const wizardView = useWizardView(tabList);
  const { currentStep, goToStep } = wizardView;

  const formVerification = useFormVerification(verificationDetail);

  const formOrder = useFormOrder({ eventCategories });
  const { category } = formOrder.data;

  const pageTitle = "Pendaftaran " + (eventDetailData?.publicInformation.eventName || "");
  const breadcrumbLink = _getLandingPagePath(eventDetailData?.publicInformation.eventUrl);

  React.useEffect(() => {
    // Scroll to top tiap klik next/previous
    window.scrollTo(0, 0);
  }, [currentStep]);

  return (
    <PageWrapper pageTitle={pageTitle} breadcrumbText={pageTitle} breadcrumbLink={breadcrumbLink}>
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

          <Step className={classnames({ "step-active": currentStep === 2 })}>2. Pemesanan</Step>
        </StepIndicator>

        <BannerReservation category={category} onTimeout={() => history.push(breadcrumbLink)} />

        <SplitDisplay>
          <div>
            <WizardView currentStep={currentStep}>
              <WizardViewContent noContainer>
                <FormView
                  userProfile={userProfile}
                  eventCategories={eventCategories}
                  formOrder={formOrder}
                  formVerification={formVerification}
                />
              </WizardViewContent>

              <WizardViewContent noContainer>
                <SummaryView userProfile={userProfile} formOrder={formOrder} />
              </WizardViewContent>
            </WizardView>
          </div>

          <div>
            <TicketView
              isLoadingEventDetail={isLoadingEventDetail}
              eventDetailData={eventDetailData}
              wizardView={wizardView}
              formVerification={formVerification}
              formOrder={formOrder}
              onSuccessVerification={() => {
                fetchVerificationDetail();
                refreshUserProfile();
              }}
            />
          </div>
        </SplitDisplay>
      </ViewLayout>

      <AdsBanner />
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
`;

/* ==================================== */
// utils

function _getLandingPagePath(url) {
  if (!url) {
    return "#";
  }
  const segments = url.split("/");
  const segmentLength = segments.length;
  const path = `/${segments[segmentLength - 3]}/${segments[segmentLength - 2]}/${
    segments[segmentLength - 1]
  }`;
  return path;
}

export default PageEventRegistration;
