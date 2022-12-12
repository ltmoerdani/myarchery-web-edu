import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";

import MetaTags from "react-meta-tags";
import { ButtonBlue } from "components/ma";
import { LatestEvents } from "./components/latest-events";
import { HeroCarousel } from "./components/hero-carousel";

import { url } from "utils";

import imgSectionSeries from "assets/images/home/section-series.png";
import imgManageEvent from "assets/images/home/section-activity-illustration-manage-event.svg";
import imgClub from "assets/images/home/section-activity-illustration-club.svg";
import imgPro from "assets/images/partners/pro.png";
import imgHammam from "assets/images/partners/hammam.jpg";
import imgVictory from "assets/images/partners/victory.png";
import imgQueen from "assets/images/partners/queen.png";
import imgEndorsePro from "assets/images/home/endorsement-pro-shop.png";
import imgEndorseHub from "assets/images/home/endorsement-hub.png";
import imgEndorseKarawang from "assets/images/home/endorsement-barebow-karawang.png";
import imgEndorsePerpaniJkt from "assets/images/home/endorsement-perpani-jkt.jpg";
import imgEndorsePerpaniKebumen from "assets/images/home/endorsement-perpani-kebumen.png";
import imgEndorseBxp from "assets/images/home/endorsement-bxp.png";
import imgEndorseTac from "assets/images/home/endorsement-tac.png";
import imgEndorseKujang from "assets/images/home/endorsement-kujang.jpg";
import imgEndorseFast from "assets/images/home/endorsement-fast.png";
import imgFeaturesMac from "assets/images/home/features-illustration-mac.png";
import imgFeaturesCircle from "assets/images/home/features-circle.svg";
import imgFeatureItemEvent from "assets/images/home/feature-item-event.svg";
import imgFeatureItemFeatureRich from "assets/images/home/feature-item-feature-rich.svg";
import imgFeatureItemLeaderboard from "assets/images/home/feature-item-leaderboard.svg";
import imgFeatureItemClub from "assets/images/home/feature-item-club.svg";
import imgFeatureItemSeries from "assets/images/home/feature-item-series.svg";
import imgFeatureItemLiveScore from "assets/images/home/feature-item-live-score.svg";

const partners = [
  {
    name: "Pro Archery Shop",
    imgSrc: imgPro,
    webSrc: "https://instagram.com/proarcheryshop/",
  },
  {
    name: "Hammam Archery Shop",
    imgSrc: imgHammam,
    webSrc: "https://www.instagram.com/hammam_archery_shop/",
  },
  {
    name: "Victory Archer Club",
    imgSrc: imgVictory,
    webSrc: "https://instagram.com/victoryarcheryclub?igshid=MTg0ZDhmNDA=",
  },
];

const logosTrustedBy = [
  { imgSrc: imgEndorsePerpaniJkt },
  { imgSrc: imgEndorsePerpaniKebumen },
  { imgSrc: imgEndorsePro },
  { imgSrc: imgEndorseHub },
  { imgSrc: imgEndorseKarawang },
  { imgSrc: imgEndorseBxp },
  { imgSrc: imgEndorseTac },
  { imgSrc: imgEndorseKujang },
  { imgSrc: imgEndorseFast },
  { imgSrc: imgQueen },
];

function PageHome() {
  const { isLoggedIn } = useSelector(AuthStore.getAuthenticationStore);
  // TODO: masih hardcoded, ubah dinamis kalau series udah ready
  const linkToJakartaSeriesLeaderboard = `/series/1/leaderboard`;
  return (
    <React.Fragment>
      <MetaTags>
        <title>
          MyArchery.id - Temukan dan ikuti berbagai macam event panahan di
          MyArchery
        </title>
      </MetaTags>

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
                  Rangkaian pertandingan panahan dari DKI Jakarta Series sebagai
                  wadah atlet untuk menjadi pemain inti dalam pertandingan
                  bertaraf nasional.
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
                <SectionHeading>
                  Ragam Aktivitas bersama MyArchery
                </SectionHeading>
                <SectionDescription>
                  Menjadi bagian dari panahan lebih mudah melalui MyArchery.
                  Mengadakan pertandingan, turnamen, dan berkumpul dengan
                  komunitas dengan fitur buat event serta komunitas.
                </SectionDescription>
              </SectionHeader>

              <ActivitiesGrid>
                <ActivityItemManage>
                  <ActivityItemFloatingContent>
                    <ActivityItemHeading>
                      Buat dan Atur Event
                    </ActivityItemHeading>
                    <SectionDescription>
                      Buat berbagai event panahan dengan pengaturan sistem
                      skoring dan pemeringkatan
                    </SectionDescription>

                    <div>
                      <ButtonBlue
                        as="a"
                        href={url.getWebAdminURL()}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ke Organizer
                      </ButtonBlue>
                    </div>
                  </ActivityItemFloatingContent>
                </ActivityItemManage>

                <ActivityItemClub>
                  <ActivityItemFloatingContent>
                    <ActivityItemHeading>
                      Jadi Bagian dari Klub
                    </ActivityItemHeading>
                    <SectionDescription>
                      Berkumpul dan memantau kegiatan klub secara virtual lebih
                      mudah melalui MyArchery
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
                  Bersama berbagai komunitas, klub, organisasi, dan toko
                  perlengkapan panah, MyArchery memastikan kegiatan panahan
                  selalu nyaman dan menyenangkan untuk berbagai kalangan.
                </SectionDescription>
              </SectionHeader>

              <LogosGrid>
                {partners.map((partner, index) => (
                  <PartnerItem key={index} partner={partner} />
                ))}
              </LogosGrid>
            </PaddedWrapper>
          </InnerContainer>
        </SectionGray>

        <SectionWhite>
          <InnerContainer>
            <SectionAboutWrapper>
              <SectionHeader>
                <SectionHeading>Tentang Kami</SectionHeading>
                <SectionDescription>
                  Berbagai fitur dan layanan dapat Anda manfaatkan untuk
                  mendukung kegiatan panahan pribadi dan komunitas. Tersedia di
                  berbagai perangkat sesuai kebutuhan Anda.
                </SectionDescription>
              </SectionHeader>

              <FeaturesContainerOuter>
                <FeaturesContainer>
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
                      description="Pantau pergerakan skor peserta dan peringkat medali klub, melalui leaderboard yang diupdate secara live"
                    />
                  </FeaturesListLeft>

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
                </FeaturesContainer>
              </FeaturesContainerOuter>

              <SectionHeader>
                <EndorsementHeading>
                  Dipercaya oleh berbagai klub, organisasi, dan penyedia
                  perlengkapan panahan
                </EndorsementHeading>

                <LogoList logos={logosTrustedBy} />
              </SectionHeader>
            </SectionAboutWrapper>
          </InnerContainer>
        </SectionWhite>
      </PageWrapper>
    </React.Fragment>
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

function PartnerItem({ partner }) {
  const imgElement = (
    <img
      src={partner.imgSrc}
      alt={partner.name}
      title={partner.name}
      className="img-fluid"
    />
  );
  if (!partner.webSrc) {
    return <PartnerItemWrapper>{imgElement}</PartnerItemWrapper>;
  }
  return (
    <PartnerItemWrapper>
      <a href={partner.webSrc} target="_blank" rel="noreferrer">
        {imgElement}
      </a>
    </PartnerItemWrapper>
  );
}

function LogoList({ logos }) {
  if (!logos?.length) {
    return <div>List logo tidak tersedia</div>;
  }
  return (
    <LogosGrid>
      {logos.map((logo, index) => (
        <LogoContainerConstrained key={index}>
          <img src={logo.imgSrc} />
        </LogoContainerConstrained>
      ))}
    </LogosGrid>
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
  margin: 0 1.5rem;
  text-align: center;

  @media (min-width: 768px) {
    margin: 0 auto;
  }
`;

const SectionHeading = styled.h2`
  color: var(--ma-blue);
  font-size: 1.75rem;
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
  align-items: flex-end;
  min-height: calc(32.5rem + 5.625rem);

  margin-left: 1rem;
  margin-right: 1rem;

  background-image: url(${imgSectionSeries});
  background-repeat: no-repeat;
  background-size: 17.5rem;
  background-position-x: center;
  background-position-y: 3.75rem;

  @media (min-width: 520px) {
    min-height: calc(45rem + 5.625rem);
    background-size: 70vw;
    background-position-y: 5.625rem;
  }

  @media (min-width: 720px) {
    min-height: calc(32.5rem + 5.625rem);
    align-items: center;
    margin-left: 1.5rem;
    margin-right: 1.5rem;
    background-size: 50vw;
    background-position-x: right;
    background-position-y: center;
  }

  @media (min-width: 1180px) {
    min-height: calc(45rem + 5.625rem);
    margin-left: 0;
    margin-right: 0;
    background-size: auto;
  }
`;

const SeriesFloatingContent = styled.div`
  max-width: 20rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3.75rem;
  text-align: center;

  @media (min-width: 520px) {
    margin-bottom: 5.625rem;
  }

  @media (min-width: 720px) {
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 0;
    text-align: left;
  }

  @media (min-width: 960px) {
    max-width: 23.75rem;
  }

  @media (min-width: 1180px) {
    max-width: 23.75rem;
  }
`;

const ActivitiesGrid = styled.div`
  margin-top: 3.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4rem 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ActivityItem = styled.div`
  text-align: center;
  margin-left: 1.5rem;
  margin-right: 1.5rem;

  padding-top: 12rem;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 10rem;

  @media (min-width: 768px) {
    margin-left: 0;
    margin-right: 0;
    padding-top: 17.5rem;
    background-size: auto;
  }
`;

const ActivityItemManage = styled(ActivityItem)`
  background-image: url(${imgManageEvent});
`;

const ActivityItemClub = styled(ActivityItem)`
  background-image: url(${imgClub});
`;

const ActivityItemFloatingContent = styled.div`
  max-width: 27.5rem;
  margin-left: auto;
  margin-right: auto;
`;

const ActivityItemHeading = styled.h3`
  color: var(--ma-txt-black);
  font-size: 1.75rem;
  font-weight: 600;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const LogosGrid = styled.div`
  margin-top: 2.75rem;
  margin-left: 1.5rem;
  margin-right: 1.5rem;

  display: flex;
  flex-wrap: wrap;
  gap: 3rem 1rem;
  justify-content: center;
  align-items: center;
  text-align: center;

  @media (min-width: 768px) {
    margin-left: 0;
    margin-right: 0;
  }
`;

const PartnerItemWrapper = styled.div`
  img {
    max-height: 90px;
  }
`;

const LogoContainerConstrained = styled.div`
  margin: 0 1.5rem;

  > img {
    max-width: 122px;
    max-height: 122px;
    height: auto;
  }
`;

const SectionAboutWrapper = styled.div`
  padding: 5.625rem 0;

  > * + * {
    margin-top: 3.75rem;

    @media (min-width: 1024px) {
      margin-top: 5.625rem;
    }
  }
`;

const FeaturesContainerOuter = styled.div`
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 60vw;
  background-image: url("${imgFeaturesCircle}");

  @media (min-width: 425px) {
    background-size: 60vw;
  }

  @media (min-width: 580px) {
    background-size: 40vw;
  }

  @media (min-width: 768px) {
    background-position-y: top;
    background-size: 30vw;
  }

  @media (min-width: 1024px) {
    background-position-y: center;
  }

  @media (min-width: 1180px) {
    background-size: contain;
  }
`;

const FeaturesContainer = styled.div`
  padding-top: 15rem;
  margin-left: 1rem;
  margin-right: 1rem;

  display: flex;
  gap: 2.25rem 2rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-height: 31.5rem;

  background-repeat: no-repeat;
  background-position: top center;
  background-size: 80vw;
  background-image: url("${imgFeaturesMac}");

  @media (min-width: 425px) {
    padding-top: 20rem;
  }

  @media (min-width: 580px) {
    flex-direction: row;
    background-position-y: -2rem;
    background-size: 60vw;
  }

  @media (min-width: 768px) {
    background-size: 50vw;
  }

  @media (min-width: 1024px) {
    padding-top: 0;
    margin-left: 1rem;
    margin-right: 1rem;
    justify-content: space-between;
    align-items: center;
    background-position: center;
  }

  @media (min-width: 1180px) {
    background-size: contain;
  }
`;

const FeaturesListLeft = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: left;

  > * + * {
    margin-top: 2.25rem;
  }

  @media (min-width: 1024px) {
    text-align: right;
  }
`;

const FeaturesListRight = styled(FeaturesListLeft)`
  text-align: left;
`;

const FeatureItemLeftWrapper = styled.li`
  display: flex;
  gap: 0.875rem;
  justify-content: flex-end;

  &::before {
    flex-shrink: 0;
    content: " ";
    display: block;
    width: 3rem;
    height: 3rem;
    background-image: var(--feature-item-icon);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  @media (min-width: 1024px) {
    flex-direction: row-reverse;
  }
`;

const FeatureItemRightWrapper = styled.li`
  display: flex;
  gap: 0.875rem;
  justify-content: flex-end;

  &::before {
    flex-shrink: 0;
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
  flex-grow: 1;

  @media (min-width: 580px) {
    max-width: 208px;
  }
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
