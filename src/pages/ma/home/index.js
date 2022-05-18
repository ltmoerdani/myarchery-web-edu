import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";

import { ButtonBlue } from "components/ma";
import { LatestEvents } from "./components/latest-events";
import { HeroCarousel } from "./components/hero-carousel";

import { url } from "utils";

import imgSectionSeries from "assets/images/home/section-series.png";
import imgManageEvent from "assets/images/home/section-activity-illustration-manage-event.svg";
import imgClub from "assets/images/home/section-activity-illustration-club.svg";
import imgPro from "assets/images/partners/pro.png";
import imgMonster from "assets/images/partners/monster.png";
import imgQueen from "assets/images/partners/queen.png";
import imgEndorsePro from "assets/images/home/endorsement-pro-shop.png";
import imgEndorseHub from "assets/images/home/endorsement-hub.png";
import imgEndorseKarawang from "assets/images/home/endorsement-barebow-karawang.png";
import imgFeaturesMac from "assets/images/home/features-illustration-mac.png";
import imgFeaturesCircle from "assets/images/home/features-circle.svg";
import imgFeatureItemEvent from "assets/images/home/feature-item-event.svg";
import imgFeatureItemFeatureRich from "assets/images/home/feature-item-feature-rich.svg";
import imgFeatureItemLeaderboard from "assets/images/home/feature-item-leaderboard.svg";
import imgFeatureItemClub from "assets/images/home/feature-item-club.svg";
import imgFeatureItemSeries from "assets/images/home/feature-item-series.svg";
import imgFeatureItemLiveScore from "assets/images/home/feature-item-live-score.svg";

function PageHome() {
  const { isLoggedIn } = useSelector(AuthStore.getAuthenticationStore);
  // TODO: masih hardcoded, ubah dinamis kalau series udah ready
  const linkToJakartaSeriesLeaderboard = `/series/2/leaderboard`;
  return (
    <PageWrapper>
      <SectionWhite>
        <InnerContainer>
          <HeroCarousel />
        </InnerContainer>
      </SectionWhite>

      <SectionWhite id="events-list">
        <InnerContainer>
          <SectionLatestEvents>
            <SectionHeader>
              <SectionHeading>Event Terbaru</SectionHeading>
              <SectionDescription>
                Temukan dan ikuti berbagai macam event panahan di MyArchery
              </SectionDescription>
            </SectionHeader>

            <LatestEvents />
          </SectionLatestEvents>
        </InnerContainer>
      </SectionWhite>

      <SectionGray>
        <InnerContainer>
          <SeriesWrapper>
            <SeriesFloatingContent>
              <SectionHeading>Pertandingan Series</SectionHeading>
              <SectionDescription>
                Rangkaian pertandingan panahan dari DKI Jakarta Series sebagai wadah atlet untuk
                menjadi pemain inti dalam pertandingan bertaraf nasional.
              </SectionDescription>

              <ButtonBlue as={Link} to={linkToJakartaSeriesLeaderboard}>
                Leaderboard
              </ButtonBlue>
            </SeriesFloatingContent>
          </SeriesWrapper>
        </InnerContainer>
      </SectionGray>

      <SectionWhite>
        <InnerContainer>
          <PaddedWrapper>
            <SectionHeader>
              <SectionHeading>Ragam Aktivitas bersama MyArchery</SectionHeading>
              <SectionDescription>
                Menjadi bagian dari panahan lebih mudah melalui MyArchery. Mengadakan pertandingan,
                turnamen, dan berkumpul dengan komunitas dengan fitur buat event serta komunitas.
              </SectionDescription>
            </SectionHeader>

            <ActivitiesGrid>
              <ActivityItemManage>
                <ActivityItemFloatingContent>
                  <ActivityItemHeading>Buat dan Atur Event</ActivityItemHeading>
                  <SectionDescription>
                    Buat berbagai event panahan dengan pengaturan sistem skoring dan pemeringkatan
                  </SectionDescription>

                  <div>
                    <ButtonBlue as="a" href={url.getWebAdminURL()} target="_blank" rel="noreferrer">
                      Ke Organizer
                    </ButtonBlue>
                  </div>
                </ActivityItemFloatingContent>
              </ActivityItemManage>

              <ActivityItemClub>
                <ActivityItemFloatingContent>
                  <ActivityItemHeading>Jadi Bagian dari Klub</ActivityItemHeading>
                  <SectionDescription>
                    Berkumpul dan memantau kegiatan klub secara virtual lebih mudah melalui
                    MyArchery
                  </SectionDescription>

                  <div>
                    <ButtonBlue as={Link} to={_getJoinClubURL(isLoggedIn)}>
                      Gabung Klub
                    </ButtonBlue>
                  </div>
                </ActivityItemFloatingContent>
              </ActivityItemClub>
            </ActivitiesGrid>
          </PaddedWrapper>
        </InnerContainer>
      </SectionWhite>

      <SectionGray>
        <InnerContainer>
          <PaddedWrapper>
            <SectionHeader>
              <SectionHeading>Partner MyArchery</SectionHeading>

              <SectionDescription>
                Bersama berbagai komunitas, klub, organisasi, dan toko perlengkapan panah, MyArchery
                memastikan kegiatan panahan selalu nyaman dan menyenangkan untuk berbagai kalangan.
              </SectionDescription>
            </SectionHeader>

            <PartnersLogosGrid>
              <div>
                <img src={imgPro} className="img-fluid" />
              </div>

              <div>
                <img src={imgMonster} className="img-fluid" />
              </div>

              <div>
                <img src={imgQueen} className="img-fluid" />
              </div>
            </PartnersLogosGrid>
          </PaddedWrapper>
        </InnerContainer>
      </SectionGray>

      <SectionWhite>
        <InnerContainer>
          <SectionAboutWrapper>
            <SectionHeader>
              <SectionHeading>Tentang Kami</SectionHeading>
              <SectionDescription>
                Berbagai fitur dan layanan dapat Anda manfaatkan untuk mendukung kegiatan panahan
                pribadi dan komunitas. Tersedia di berbagai perangkat sesuai kebutuhan Anda.
              </SectionDescription>
            </SectionHeader>

            <FeaturesContainerOuter>
              <FeaturesContainer>
                <div>
                  <FeaturesListLeft>
                    <FeatureItemLeft
                      icon={imgFeatureItemEvent}
                      title="Banyak Event"
                      description="Menyediakan berbagai informasi mengenai event panahan"
                    />
                    <FeatureItemLeft
                      icon={imgFeatureItemFeatureRich}
                      title="Berbagai Fitur"
                      description="Fitur yang memudahkan peserta dan penyelenggara event"
                    />
                    <FeatureItemLeft
                      icon={imgFeatureItemLeaderboard}
                      title="Leaderboard"
                      description="Pantau pergerakan skor peserta melalui leaderboard yang diupdate secara"
                    />
                  </FeaturesListLeft>
                </div>

                <div>
                  <FeaturesListRight>
                    <FeatureItemRight
                      icon={imgFeatureItemClub}
                      title="Klub"
                      description="Berkumpul bersama klub secara virtual dan ikuti berbagai event panahan"
                    />
                    <FeatureItemRight
                      icon={imgFeatureItemSeries}
                      title="Series"
                      description="Event Series untuk menyeleksi peserta dan atlet panahan"
                    />
                    <FeatureItemRight
                      icon={imgFeatureItemLiveScore}
                      title="Live Score"
                      description="Skoring event secara live yang diupdate ke Leaderboard"
                    />
                  </FeaturesListRight>
                </div>
              </FeaturesContainer>
            </FeaturesContainerOuter>

            <SectionHeader>
              <EndorsementHeading>
                Dipercaya oleh berbagai klub, organisasi, dan penyedia perlengkapan panahan
              </EndorsementHeading>

              <PartnersLogosGrid>
                <div>
                  <img src={imgEndorsePro} className="img-fluid" />
                </div>

                <div>
                  <img src={imgEndorseHub} className="img-fluid" />
                </div>

                <div>
                  <img src={imgEndorseKarawang} className="img-fluid" />
                </div>
              </PartnersLogosGrid>
            </SectionHeader>
          </SectionAboutWrapper>
        </InnerContainer>
      </SectionWhite>
    </PageWrapper>
  );
}

function FeatureItemLeft({ icon, title, description }) {
  return (
    <FeatureItemLeftWrapper style={{ "--feature-item-icon": `url(${icon})` }}>
      <FeatureItemContent>
        <FeatureItemHeading>{title}</FeatureItemHeading>
        <FeatureItemDescription>{description}</FeatureItemDescription>
      </FeatureItemContent>
    </FeatureItemLeftWrapper>
  );
}

function FeatureItemRight({ icon, title, description }) {
  return (
    <FeatureItemRightWrapper style={{ "--feature-item-icon": `url(${icon})` }}>
      <FeatureItemContent>
        <FeatureItemHeading>{title}</FeatureItemHeading>
        <FeatureItemDescription>{description}</FeatureItemDescription>
      </FeatureItemContent>
    </FeatureItemRightWrapper>
  );
}

/* ================================== */
// styles

const PageWrapper = styled.div`
  background-color: #ffffff;
  font-family: "Inter";
`;

const InnerContainer = styled.div`
  max-width: 73.75rem;
  margin: 0 auto;

  @media (min-width: 768px) {
    margin: 0 0.75rem;
  }

  @media (min-width: 1264px) {
    margin: 0 auto;
  }
`;

const SectionWhite = styled.section`
  background-color: #ffffff;
`;

const SectionGray = styled.section`
  background-color: var(--ma-gray-50);
`;

const PaddedWrapper = styled.div`
  padding: 5.625rem 0;
`;

const SectionHeader = styled.div`
  max-width: 55rem;
  margin: 0 auto;
  text-align: center;
`;

const SectionHeading = styled.h2`
  color: var(--ma-blue);
  font-size: 2rem;
  font-weight: 800;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SectionDescription = styled.p`
  color: var(--ma-gray-600);
  font-size: 1.125rem;
`;

const SectionLatestEvents = styled.div`
  padding: 5.625rem 0;

  > * + * {
    margin-top: 2rem;
  }
`;

const SeriesWrapper = styled.div`
  display: flex;
  align-items: center;

  min-height: calc(45rem + 5.625rem);
  background-image: url(${imgSectionSeries});
  background-repeat: no-repeat;
  background-position-x: right;
  background-position-y: center;
`;

const SeriesFloatingContent = styled.div`
  max-width: 23.75rem;
  margin: auto 0;
`;

const ActivitiesGrid = styled.div`
  margin-top: 3.75rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const ActivityItem = styled.div`
  text-align: center;
  padding-top: 17.5rem;
  background-repeat: no-repeat;
  background-position: top center;
`;

const ActivityItemManage = styled(ActivityItem)`
  background-image: url(${imgManageEvent});
`;

const ActivityItemClub = styled(ActivityItem)`
  background-image: url(${imgClub});
`;

const ActivityItemFloatingContent = styled.div`
  max-width: 27.5rem;
`;

const ActivityItemHeading = styled.h3`
  color: var(--ma-txt-black);
  font-size: 2rem;
  font-weight: 600;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const PartnersLogosGrid = styled.div`
  margin-top: 2.75rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SectionAboutWrapper = styled.div`
  padding: 5.625rem 0;

  > * + * {
    margin-top: 5.625rem;
  }
`;

const FeaturesContainerOuter = styled.div`
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url("${imgFeaturesCircle}");
`;

const FeaturesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 31.5rem;

  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url("${imgFeaturesMac}");
`;

const FeaturesListLeft = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: right;

  > * + * {
    margin-top: 2.25rem;
  }
`;

const FeaturesListRight = styled(FeaturesListLeft)`
  text-align: left;
`;

const FeatureItemLeftWrapper = styled.li`
  display: flex;
  gap: 0.875rem;
  justify-content: flex-end;

  &::after {
    content: " ";
    display: block;
    width: 3rem;
    height: 3rem;
    background-image: var(--feature-item-icon);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`;

const FeatureItemRightWrapper = styled.li`
  display: flex;
  gap: 0.875rem;
  justify-content: flex-end;

  &::before {
    content: " ";
    display: block;
    width: 3rem;
    height: 3rem;
    background-image: var(--feature-item-icon);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`;

const FeatureItemContent = styled.div`
  max-width: 208px;
`;

const FeatureItemHeading = styled.h5`
  color: var(--ma-blue);
  font-size: 1.25rem;
  font-weight: 600;
`;

const FeatureItemDescription = styled.p`
  color: var(--ma-gray-900);
  font-size: 1rem;
`;

const EndorsementHeading = styled.h4`
  color: var(--ma-txt-black);
  font-weight: 600;
`;

/* ========================== */
// utils

function _getJoinClubURL(isLoggedIn) {
  // TODO: modifikasi cek otentikasinya di middleware?
  if (!isLoggedIn) {
    return "/archer/login?path=/dashboard/clubs/join";
  }
  return "/dashboard/clubs/join";
}

export default PageHome;
