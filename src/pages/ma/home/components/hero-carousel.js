import * as React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";

import logoLight from "assets/images/myachery/myachery.png";
import bannerVictory from "assets/images/home/home-banner-victory.jpg";
import bannerPartnership from "assets/images/myachery/banner7 2.png";
import bannerWelcomeKid from "assets/images/myachery/banner6 1.svg";

import "react-responsive-carousel/lib/styles/carousel.min.css";

// * Pakai data dari API (?) Musti fetch dulu (?) Kemungkinan bakal dihapus lagi
const VICTORY_EVENT_URL = "/event/victory-archery-club/1661786987-victory-purwakarta-open-2022";

function HeroCarousel() {
  return (
    <CarouselWrapper>
      <Carousel
        showStatus={false}
        showThumbs={false}
        infiniteLoop
        autoPlay
        stopOnHover
        transitionTime={1000}
        renderIndicator={renderCustomIndicator}
        renderItem={renderCustomItem}
      >
        <SlideImageFitContent imgSrc={bannerVictory} to={VICTORY_EVENT_URL} />

        <SlidePartnership>
          <PartnershipCTAContainer>
            <ButtonCTA href="https://wa.me/6281212241633" target="_blank" rel="noreferrer">
              Informasi Partnership
            </ButtonCTA>
          </PartnershipCTAContainer>
        </SlidePartnership>

        <SlideWelcome imgSrc={bannerWelcomeKid} />
      </Carousel>
    </CarouselWrapper>
  );
}

function renderCustomIndicator(onClickHandler, isSelected, index, label) {
  if (isSelected) {
    return <CarouselIndicator className="slide-selected" aria-label={label} title={label} />;
  }
  return (
    <CarouselIndicator
      onClick={onClickHandler}
      onKeyDown={onClickHandler}
      value={index}
      key={index}
      role="button"
      tabIndex={0}
      title={label}
      aria-label={label}
    />
  );
}

function renderCustomItem(children) {
  return <CarouselItemWrapper>{children}</CarouselItemWrapper>;
}

function SlideImageFitContent({ imgSrc, title, to }) {
  const withLink = (children) => (to ? <Link to={to}>{children}</Link> : children);
  return withLink(
    <SlideFitContentWrapper>
      <img src={imgSrc} alt={title} title={title} />
    </SlideFitContentWrapper>
  );
}

function SlideWelcome({ imgSrc }) {
  return (
    <SlideWelcomeWrapper style={{ "--welcome-bg-url": `url("${imgSrc}")` }}>
      <SlideFloatingContainer>
        <WelcomeHeading>Selamat Datang di</WelcomeHeading>
        <MyArcheryHeroName>MyArchery</MyArcheryHeroName>
        <WelcomeDescription>
          <p>Temukan dan ikuti berbagai macam event panahan di MyArchery</p>
          <div>
            <ButtonCTA href="#events-list">Lihat Event</ButtonCTA>
          </div>
        </WelcomeDescription>
      </SlideFloatingContainer>
    </SlideWelcomeWrapper>
  );
}

/* =============================== */
// styles

const CarouselWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #ffffff;
`;

const CarouselIndicator = styled.li`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin: 1rem 0.25rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 50%);

  transition: background-color 0.15s;

  &:hover {
    background-color: rgba(255, 255, 255, 75%);
  }

  &.slide-selected {
    background-color: var(--ma-gray-200);
  }
`;

const CarouselItemWrapper = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 10vh;

  > * {
    width: 100%;
    height: 100%;
  }

  &::after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    opacity: 0.25;

    background-color: var(--ma-gray-100);
    background-image: url(${logoLight});
    background-size: 20%;
    background-repeat: no-repeat;
    background-position: center;
  }

  @media (min-width: 768px) {
    min-height: 600px;
  }
`;

const ButtonCTA = styled.a`
  display: inline-block;
  min-width: 17.625rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--ma-secondary);

  color: var(--ma-blue);
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;

  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:hover {
    background-color: #ffc720;
    color: var(--ma-blue);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
`;

const SlidePartnership = styled.div`
  position: relative;
  background-repeat: no-repeat;
  background-image: url("${bannerPartnership}");
  background-size: contain;
  background-position: center;

  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 767px) {
    &::before {
      content: " ";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(255, 255, 255, 0.75);
    }
  }

  @media (min-width: 768px) {
    background-size: cover;
    background-position: center;

    justify-content: flex-start;
    align-items: flex-end;
  }
`;

const PartnershipCTAContainer = styled.div`
  position: relative;

  @media (min-width: 768px) {
    margin-left: 2.75rem;
    margin-bottom: 3rem;
  }
`;

const SlideFitContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const SlideWelcomeWrapper = styled.div`
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
  background-image: var(--welcome-bg-url);

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 4rem 2rem;

  @media (max-width: 767px) {
    &::before {
      content: " ";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(13, 71, 161, 0.75);
    }
  }

  @media (min-width: 768px) {
    background-position: center;

    justify-content: flex-end;
    align-items: center;

    padding: 0;
  }
`;

const SlideFloatingContainer = styled.div`
  position: relative;
  text-align: center;

  @media (min-width: 768px) {
    max-width: 30rem;
    margin-right: 5rem;
    text-align: left;
  }
`;

const WelcomeHeading = styled.h2`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const MyArcheryHeroName = styled.h2`
  color: var(--ma-secondary);
  font-size: 2.25rem;
  font-weight: 800;
  text-transform: uppercase;
  font-style: italic;

  @media (min-width: 768px) {
    font-size: 4.25rem;
  }
`;

const WelcomeDescription = styled.div`
  color: #ffffff;
  font-size: 0.875rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

export { HeroCarousel };
