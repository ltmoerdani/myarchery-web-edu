import * as React from "react";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import { useEventDetail } from "./hooks/event-detail";
import { useEventFAQ } from "./hooks/event-faqs";

import { SpinnerDotBlock } from "components/ma";
import { MainCardEvent } from "./components/main-card-event";
import { CardEventCTA } from "./components/card-event-cta";
import { DetailInTabs } from "./components/detail-in-tabs";
import { SecondaryCTAItem } from "./components/secondary-cta-item";

import { url } from "utils";
// import { useSelector } from "react-redux";
// import * as AuthStore from "store/slice/authentication";


import kalasemen from "assets/images/myachery/kalasemen.png";
import book from "assets/images/myachery/book.png";
import clubRank from "assets/images/myachery/club-rank.png";
import official from "assets/images/myachery/official.png";



function LandingPage() {
  const { slug } = useParams();
  const history = useHistory();

  const { data: eventDetail } = useEventDetail(slug);
  const { data: dataFAQ } = useEventFAQ(eventDetail?.id);

  if (!eventDetail) {
    return <SpinnerDotBlock />;
  }

  // const { isLoggedIn } = useSelector(AuthStore.getAuthenticationStore);

  return (
    <PageWrapper>
      <InnerContentWrapper>
        <EventBanner>
          <img className="event-banner-image" src={eventDetail?.poster} />
        </EventBanner>

        <MainContent>
          <LayoutTop>
            <MainCardEvent eventDetail={eventDetail} />
            <CardEventCTA eventDetail={eventDetail} />
          </LayoutTop>

          <LayoutBottom>
            <div>
              <DetailInTabs eventDetail={eventDetail} dataFAQ={dataFAQ} />
            </div>

            <SecondaryCTA>
              <SecondaryCTAItem
                bgImg={official}
                heading="Official Pertandingan"
                subheading="Klik untuk daftar"
                onClick={() => {
                  // if (isLoggedIn) {
                  //   history.push(`/event-registration-official/${slug}`)
                  // } else {
                  //   history.push('/archer/login');
                  // }}
                  history.push(`/event-registration-official/${slug}`)
              }}/> 

              <SecondaryCTAItem
                bgImg={kalasemen}
                heading="Klasemen Pertandingan"
                subheading="Klik untuk melihat"
                onClick={() => history.push(`/live-score/${slug}/qualification`)}
              />

              {Boolean(eventDetail?.handbook) && (
                <SecondaryCTAItem
                  bgImg={book}
                  heading="Technical Handbook"
                  subheading="Klik untuk unduh"
                  onClick={() => url.openUrlOnNewTab(eventDetail?.handbook)}
                />
              )}

              <SecondaryCTAItem
                bgImg={clubRank}
                heading="Pemeringkatan Klub"
                subheading="Klik untuk melihat"
                onClick={() => history.push(`/event-ranks/${slug}/clubs`)}
              />
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
  /* fix untuk konten yang overflowing kalau pakai grid 1fr pakai minmax */
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;

  @media (min-width: 769px) {
    /* fix untuk konten yang overflowing kalau pakai grid 1fr pakai minmax */
    grid-template-columns: minmax(0, 3fr) 2fr;
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
