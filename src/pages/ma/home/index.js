import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";

import { ButtonBlue } from "components/ma";

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

function PageHome() {
  const { isLoggedIn } = useSelector(AuthStore.getAuthenticationStore);
  // TODO: masih hardcoded, ubah dinamis kalau series udah ready
  const linkToJakartaSeriesLeaderboard = `/series/2/leaderboard`;
  return (
    <PageWrapper>
      <SectionWhite>
        <InnerContainer>
          <CarouselWrapper>heading carousel</CarouselWrapper>
        </InnerContainer>
      </SectionWhite>

      <SectionWhite>
        <InnerContainer>
          <PaddedWrapper>
            <SectionHeader>
              <SectionHeading>Event Terbaru</SectionHeading>
              <SectionDescription>
                Temukan dan Ikuti berbagai macam Event Panahan di MyArchery
              </SectionDescription>
            </SectionHeader>

            <div>
              <div>grid latest events</div>

              <div>
                <ButtonToEventsPage as={Link} to="/events">
                  Lihat semua event
                </ButtonToEventsPage>
              </div>
            </div>
          </PaddedWrapper>
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

            <div>layout fitur app</div>

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

const CarouselWrapper = styled.div`
  min-height: 300px;
  background-color: var(--ma-gray-50);
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
    margin-top: 3.75rem;
  }
`;

const EndorsementHeading = styled.h4`
  color: var(--ma-txt-black);
  font-weight: 600;
`;

const ButtonToEventsPage = styled.a`
  display: block;
  padding: 1.25rem 0;
  border-radius: 0.5rem;
  color: var(--ma-blue);
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;

  transition: all 0.15s;

  &:hover {
    color: var(--ma-blue);
    text-decoration: underline !important;
    background-color: #fafafa;
  }
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
