import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEventDetail } from "./hooks/event-detail";
import { useEventFAQ } from "./hooks/event-faqs";

import { SpinnerDotBlock } from "components/ma";
import { MainCardEvent } from "./components/main-card-event";
import { CardEventCTA } from "./components/card-event-cta";
import { DetailInTabs } from "./components/detail-in-tabs";
import { SecondaryCTAItem } from "./components/secondary-cta-item";

import kalasemen from "assets/images/myachery/kalasemen.png";
import book from "assets/images/myachery/book.png";

function LandingPage() {
  const { slug } = useParams();

  const { data: eventDetail } = useEventDetail(slug);
  const { data: dataFAQ } = useEventFAQ(eventDetail?.id);

  if (!eventDetail) {
    return <SpinnerDotBlock />;
  }

  return (
    <PageWrapper>
      <InnerContentWrapper>
        <EventBanner>
          <img className="event-banner-image" src={eventDetail?.poster} />
        </EventBanner>

        <MainContent>
          <LayoutTop>
            <MainCardEvent eventDetail={eventDetail} />

            <div>
              <CardEventCTA eventDetail={eventDetail} />
            </div>
          </LayoutTop>

          <LayoutBottom>
            <div>
              <DetailInTabs eventDetail={eventDetail} dataFAQ={dataFAQ} />
            </div>

            <SecondaryCTA>
              <SecondaryCTAItem
                bgImg={kalasemen}
                heading="Klasemen Pertandingan"
                subheading="Klik untuk melihat"
              />

              {Boolean(eventDetail?.handbook) && (
                <SecondaryCTAItem
                  bgImg={book}
                  heading="Technical Handbook"
                  subheading="Klik untuk unduh"
                />
              )}
            </SecondaryCTA>
          </LayoutBottom>
        </MainContent>
      </InnerContentWrapper>
    </PageWrapper>
  );
}

const InnerContentWrapper = styled.div`
  max-width: 79rem;
  margin: 0 auto;

  @media (min-width: 769px) {
    margin: 0 0.75rem;
  }

  @media (min-width: 1264px) {
    margin: 0 auto;
  }
`;

const PageWrapper = styled.div`
  margin: 2.5rem 0;
  background-color: #f8f8fa;
  font-family: "Inter";
`;

const EventBanner = styled.div`
  position: relative;
  width: 100%;
  padding-top: 42%;
  background-color: var(--ma-gray-600);

  .event-banner-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const SecondaryCTA = styled.div`
  margin: 0 1rem;

  > * + * {
    margin-top: 1rem;
  }

  @media (min-width: 769px) {
    margin: 0;
    margin-top: 3.25rem;
  }
`;

const MainContent = styled.div`
  > * {
    margin-top: 1.5rem;
  }
`;

const LayoutTop = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 769px) {
    grid-template-columns: 3fr 2fr;
  }
`;

const LayoutBottom = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 1.5rem;

  @media (min-width: 769px) {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 1.5rem;
  }
`;

export default LandingPage;
