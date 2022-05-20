import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import MetaTags from "react-meta-tags";
import { LoginForm } from "./components/login-form";

import bgAbstractTop from "assets/images/auth/auth-illustration-abstract-top.png";
import bgAbstractBottom from "assets/images/auth/auth-illustration-abstract-bottom.png";
import bgIllustrationPeople from "assets/images/auth/auth-illustration-people.svg";
import imgMyArcheryLogoWhite from "assets/images/auth/auth-logo-myarchery-untrimmed.png";

function ContentLayoutWrapper({ children, pageTitle }) {
  return (
    <React.Fragment>
      <MetaTags>
        {pageTitle ? <title>{pageTitle} | MyArchery.id</title> : <title>MyArchery.id</title>}
      </MetaTags>
      {children}
    </React.Fragment>
  );
}

function PageAuthLogin() {
  return (
    <ContentLayoutWrapper pageTitle="Selamat Datang">
      <SplitLayoutContainer>
        <ContainerLeft>
          <ContentFloating>
            <MyArcheryHeadlineLogo>
              <Link to="/">
                <img src={imgMyArcheryLogoWhite} alt="MyArchery Logo White" />
              </Link>
            </MyArcheryHeadlineLogo>

            <MainContent>
              <MyArcheryName>MyArchery</MyArcheryName>
              <HeadlineDescription>
                Selamat datang! Masuk ke akun Anda untuk temukan dan ikuti berbagai macam event
                panahan di MyArchery.
              </HeadlineDescription>
            </MainContent>
          </ContentFloating>
        </ContainerLeft>

        <ContainerRight>
          <FormAreaContainer>
            <div>
              <FormAreaHeading>Selamat Datang</FormAreaHeading>
              <FormAreaDescription>Satu akun untuk daftar berbagai event</FormAreaDescription>
            </div>

            <div>
              <LoginForm />
            </div>
          </FormAreaContainer>
        </ContainerRight>
      </SplitLayoutContainer>
    </ContentLayoutWrapper>
  );
}

/* =============================== */
// styles

const SplitLayoutContainer = styled.div`
  @media (min-width: 960px) {
    display: flex;
    flex-direction: row;
    height: 100vh;
  }
`;

const ContainerLeft = styled.div`
  flex: 1 0 0;
  background-color: var(--ma-blue);
  color: #ffffff;

  background-image: url(${bgIllustrationPeople}), url(${bgAbstractBottom}), url(${bgAbstractTop});
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-position: bottom right, bottom left, top right;
  background-size: contain, auto, auto;

  @media (min-width: 600px) {
    background-size: auto, auto, auto;
  }
`;

const ContainerRight = styled.div`
  flex: 1 0 0;
  background-color: #ffffff;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentFloating = styled.div`
  padding: 1rem 1.5rem;
  background-color: rgba(13, 71, 161, 0.9);

  @media (min-width: 600px) {
    padding-bottom: 2rem;
  }

  @media (min-width: 960px) {
    padding: 0;
    margin: 2rem auto;
    width: min-content;
    background-color: transparent;

    > * + * {
      margin-top: 6.5rem;
    }
  }

  @media (min-width: 1440px) {
    margin: 2rem 6.5rem;
  }
`;

const MyArcheryHeadlineLogo = styled.div`
  height: 4rem;
  text-align: center;

  img {
    max-height: 100%;
    object-fit: cover;
  }

  @media (min-width: 960px) {
    height: fit-content;
    text-align: left;
  }
`;

const MainContent = styled.div`
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  @media (min-width: 600px) {
    max-width: min-content;
    padding-bottom: 2rem;

    position: relative;
    z-index: 0;

    &::before,
    &::after {
      content: " ";
      position: absolute;
      z-index: -1;
      bottom: 0;
      left: 0;

      display: block;
      background-color: #ffffff;
      height: 3px;
    }

    &::before {
      width: 100%;
      margin-bottom: 1rem;
    }

    &::after {
      left: 30%;
      right: 30%;
    }
  }

  @media (min-width: 960px) {
    text-align: left;

    &::after {
      left: 0;
      width: 40%;
    }
  }
`;

const MyArcheryName = styled.h1`
  color: var(--ma-secondary);
  font-size: 2rem;
  font-weight: 800;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 0.09em;

  @media (min-width: 600px) {
    font-size: 4rem;
  }
`;

const HeadlineDescription = styled.p`
  font-size: 1rem;

  @media (min-width: 600px) {
    font-size: 1.125rem;
  }

  @media (min-width: 960px) {
    font-size: 1.25rem;
  }
`;

const FormAreaContainer = styled.div`
  flex-grow: 1;
  max-width: 25rem;
  margin: 2rem 1rem;

  > * + * {
    margin-top: 2.25rem;
  }

  @media (min-width: 600px) {
    margin: 4rem 1rem;
  }

  @media (min-width: 960px) {
    margin: 0;
  }
`;

const FormAreaHeading = styled.h2`
  color: var(--ma-blue);
  font-size: 2rem;
  font-weight: 600;
`;

const FormAreaDescription = styled.p`
  color: var(--ma-gray-600);
  font-size: 1rem;

  @media (min-width: 600px) {
    font-size: 1.125rem;
  }

  @media (min-width: 960px) {
    font-size: 1.25rem;
  }
`;

export default PageAuthLogin;
