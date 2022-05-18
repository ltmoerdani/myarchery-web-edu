import * as React from "react";
import styled from "styled-components";

import { Carousel } from "react-responsive-carousel";

import logoLight from "assets/images/myachery/myachery.png";
import bannerPartnership from "assets/images/myachery/banner7 2.png";
import bannerWelcomeKid from "assets/images/myachery/banner6 1.svg";
import bannerWelcomeBro from "assets/images/myachery/banner6 3.svg";

import "react-responsive-carousel/lib/styles/carousel.min.css";

function HeroCarousel() {
  return (
    <CarouselWrapper>
      <Carousel
        showStatus={false}
        showThumbs={false}
        infiniteLoop
        autoPlay
        stopOnHover
        transitionTime={750}
        renderIndicator={renderCustomIndicator}
        renderItem={renderCustomItem}
      >
        <SlidePartnership>
          <PartnershipCTAContainer>
            <ButtonCTA href="https://wa.me/6281212241633" target="_blank" rel="noreferrer">
              Informasi Partnership
            </ButtonCTA>
          </PartnershipCTAContainer>
        </SlidePartnership>
        <SlideWelcome imgSrc={bannerWelcomeKid} />
        <SlideWelcome imgSrc={bannerWelcomeBro} />
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
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 600px;

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
  background-image: url("${bannerPartnership}");

  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`;

const PartnershipCTAContainer = styled.div`
  margin-left: 2.75rem;
  margin-bottom: 3rem;
`;

const SlideWelcomeWrapper = styled.div`
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-image: var(--welcome-bg-url);

  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const SlideFloatingContainer = styled.div`
  max-width: 30rem;
  margin-right: 5rem;
  text-align: left;
`;

const WelcomeHeading = styled.h2`
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const MyArcheryHeroName = styled.h2`
  color: var(--ma-secondary);
  font-size: 4.25rem;
  font-weight: 800;
  text-transform: uppercase;
  font-style: italic;
`;

const WelcomeDescription = styled.div`
  color: #ffffff;
  font-size: 1.5rem;

  p {
    line-height: 2rem;
  }
`;

export { HeroCarousel };
