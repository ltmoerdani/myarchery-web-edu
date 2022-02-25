import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useWizardView } from "hooks/wizard-view";
import { useEventDetail } from "../hooks/event-detail";
import { useParticipantMembers } from "../hooks/participant-members";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { WizardView, WizardViewContent } from "components/ma";
import { BreadcrumbDashboard } from "../components/breadcrumb";

import { TabEvent } from "./tab-views/event";
import { TabPeserta } from "./tab-views/peserta";

import classnames from "classnames";

const tabsList = [
  { step: 1, label: "Event" },
  { step: 2, label: "Peserta" },
  { step: 3, label: "Riwayat" },
  { step: 4, label: "Dokumen" },
];

function PageEventCategoryDetail() {
  const { event_id, order_id } = useParams();
  const eventId = parseInt(event_id);
  const orderId = parseInt(order_id);
  const { currentStep, goToStep } = useWizardView(tabsList);
  const { eventState, data: event } = useEventDetail(eventId);
  const participantMembersState = useParticipantMembers(orderId);

  const { data: participantMembers } = participantMembersState;

  return (
    <PageWrapper>
      <MetaTags>
        <title>Event Saya | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to={`/dashboard/events/${eventId}`}>
          <CapitalizedText>
            {participantMembers?.eventCategoryDetail?.categoryLabel ||
              event?.publicInformation?.eventName ||
              "Kategori Event"}
          </CapitalizedText>
        </BreadcrumbDashboard>

        <div>
          <TabsList>
            <TabItem
              className={classnames({ "tab-active": currentStep === 1 })}
              onClick={() => goToStep(1)}
              disabled={currentStep === 1}
            >
              Event
            </TabItem>

            <TabItem
              className={classnames({ "tab-active": currentStep === 2 })}
              onClick={() => goToStep(2)}
              disabled={currentStep === 2}
            >
              Peserta
            </TabItem>

            {/* TODO: uncomment kalo udah ready */}
            {/* <TabItem
              className={classnames({ "tab-active": currentStep === 3 })}
              onClick={() => goToStep(3)}
              disabled={currentStep === 3}
            >
              Riwayat
            </TabItem> */}

            {/* TODO: uncomment kalo udah ready */}
            {/* <TabItem
              className={classnames({ "tab-active": currentStep === 4 })}
              onClick={() => goToStep(4)}
              disabled={currentStep === 4}
            >
              Dokumen
            </TabItem> */}
          </TabsList>

          <PanelWrapper>
            <WizardView currentStep={currentStep}>
              <WizardViewContent noContainer>
                <TabEvent eventState={eventState} />
              </WizardViewContent>

              <WizardViewContent noContainer>
                <TabPeserta
                  eventState={eventState}
                  participantMembersState={participantMembersState}
                />
              </WizardViewContent>
            </WizardView>
          </PanelWrapper>
        </div>
      </Container>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";
`;

const CapitalizedText = styled.span`
  text-transform: capitalize;
`;

const TabsList = styled.div`
  display: flex;
  justify-content: flex-start;
  background-color: var(--ma-gray-100);
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  overflow: hidden;
`;

const TabItem = styled.button`
  min-width: 12.75rem;
  padding: 0.9375rem 1.25rem;
  border: solid 1px var(--ma-gray-100);
  background-color: var(--ma-gray-100);
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  text-align: left;
  font-weight: 600;

  &.tab-active {
    border-color: #ffffff;
    background-color: #ffffff;
    color: var(--ma-blue);
  }
`;

const PanelWrapper = styled.div`
  background-color: #ffffff;
`;

export default PageEventCategoryDetail;
