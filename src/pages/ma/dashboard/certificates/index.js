import * as React from "react";
import styled from "styled-components";
import { useUserCertificates } from "./hooks/user-certificates";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { ButtonBlue, LoadingScreen, AlertSubmitError as AlertErrorFetch } from "components/ma";
import { BreadcrumbDashboard } from "../components/breadcrumb";

import IconCertificate from "components/ma/icons/color/certificate";
import IconDownload from "components/ma/icons/mono/download";

function PageCertificates() {
  const {
    data: certificatesByEvents,
    isLoading: isLoadingCertificates,
    isError: isErrorCertificates,
    errors: errorsCertificates,
  } = useUserCertificates();

  return (
    <PageWrapper>
      <MetaTags>
        <title>Event Saya | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to="/dashboard">Sertifikat</BreadcrumbDashboard>

        <EventsList>
          {certificatesByEvents ? (
            certificatesByEvents.length ? (
              certificatesByEvents.map((event, index) => (
                <EventItem key={index}>
                  <EventName>{event.eventName}</EventName>

                  <div>
                    {event.certificates.map((certificate, index) => (
                      <React.Fragment key={certificate.category.id}>
                        {index > 0 && <GroupSeparator />}

                        <CertificatesGroup>
                          <CategoryName>{certificate.category.name}</CategoryName>

                          <CertificatesGrid>
                            {certificate.files.map((file) => (
                              <CardDocItem key={file.url}>
                                <div>
                                  <DocItemTitle>
                                    <span>
                                      <IconCertificate />
                                    </span>
                                    <span>{file.name}</span>
                                  </DocItemTitle>
                                </div>

                                <div>
                                  <ButtonBlueDownload
                                    as="a"
                                    target="_blank"
                                    rel="noreferrer"
                                    href={file.url}
                                  >
                                    <span>
                                      <IconDownload size="13" />
                                    </span>
                                    <span>Unduh</span>
                                  </ButtonBlueDownload>
                                </div>
                              </CardDocItem>
                            ))}
                          </CertificatesGrid>
                        </CertificatesGroup>
                      </React.Fragment>
                    ))}
                  </div>
                </EventItem>
              ))
            ) : (
              <EventItem>
                <EventEmpty>Belum terdaftar dalam event</EventEmpty>
              </EventItem>
            )
          ) : isLoadingCertificates ? (
            <EventItem>
              <EventName>
                <SkeletonBlockText width="300" />
              </EventName>

              <CertificatesGroup>
                <CategoryName>
                  <SkeletonBlockText width="240" />
                </CategoryName>

                <CertificatesGrid>
                  {new Array(2).fill("skeleton").map((item, index) => (
                    <SkeletonCardDocItem key={index}>
                      <DocItemTitle>
                        <span>
                          <SkeletonBlockText width="28" fontSize="1em" />
                        </span>
                        <span>
                          <SkeletonBlockText width="100" fontSize="1em" />
                        </span>
                      </DocItemTitle>

                      <SkeletonBlockButton width="120" fontSize="1em" />
                    </SkeletonCardDocItem>
                  ))}
                </CertificatesGrid>
              </CertificatesGroup>
            </EventItem>
          ) : (
            <EventItem>
              <EventEmpty>Tidak ditemukan data sertifikat</EventEmpty>
            </EventItem>
          )}
        </EventsList>
      </Container>

      <LoadingScreen
        loading={isLoadingCertificates}
        message={
          <React.Fragment>
            Sedang mempersiapkan sertifikat.
            <br />
            Mohon tunggu sejenak...
          </React.Fragment>
        }
      />
      <AlertErrorFetch isError={isErrorCertificates} errors={errorsCertificates} />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";
`;

const EventsList = styled.div`
  > * + * {
    margin-top: 2.5rem;
  }
`;

const EventEmpty = styled.div`
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: var(--ma-gray-400);
  font-weight: 600;
`;

function SkeletonBlockText({ width, fontSize }) {
  const styleParams = {
    maxWidth: width ? (isNaN(width) ? width : width + "px") : undefined,
    fontSize: fontSize ? (isNaN(fontSize) ? fontSize : fontSize + "px") : "1em",
  };
  return <StyledSkeletonBlock style={styleParams}>skeleton</StyledSkeletonBlock>;
}

function SkeletonBlockButton({ width, fontSize }) {
  const styleParams = {
    padding: "0.5rem",
    borderRadius: "0.25rem",
    maxWidth: width ? (isNaN(width) ? width : width + "px") : undefined,
    fontSize: fontSize ? (isNaN(fontSize) ? fontSize : fontSize + "px") : "1em",
  };
  return <StyledSkeletonBlock style={styleParams}>skeleton</StyledSkeletonBlock>;
}

const StyledSkeletonBlock = styled.div`
  display: inline-block;
  width: 100%;
  background-color: var(--ma-gray-200);
  color: transparent;

  animation: glowing 1.5s infinite;

  @keyframes glowing {
    from {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }

    to {
      opacity: 1;
    }
  }
`;

const EventItem = styled.div`
  padding: 1.25rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const EventName = styled.h4`
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--ma-blue);
  font-weight: 600;
`;

const GroupSeparator = styled.hr`
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  background-color: var(--ma-gray-400);
`;

const CertificatesGroup = styled.div`
  &:not(:first-child) {
    margin-top: 2rem;
  }
`;

const CategoryName = styled.h5`
  margin-bottom: 1.5rem;
  color: var(--ma-gray-500);
  text-transform: capitalize;
`;

const CertificatesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem 1rem;

  @media (min-width: 361px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (min-width: 961px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const CardDocItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem 0.5rem;

  @media (min-width: 361px) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  padding: 1rem;
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px 0.25px rgba(0, 0, 0, 0.075);

  > *:first-child {
    flex-grow: 1;
    flex-basis: 50%;
    margin: auto 0;
    text-align: center;

    @media (min-width: 361px) {
      text-align: left;
    }
  }

  > *:last-child {
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.5rem;

    @media (min-width: 361px) {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
    }
  }
`;

const SkeletonCardDocItem = styled(CardDocItem)`
  box-shadow: none;
  border: solid 1px var(--ma-gray-200);
  animation: glowing 1.5s infinite;
`;

const DocItemTitle = styled.h5`
  margin: 0;
  font-weight: 600;
  text-transform: capitalize;

  > span + span {
    margin-left: 0.5rem;
  }
`;

const ButtonBlueDownload = styled(ButtonBlue)`
  &,
  &:focus,
  &:active {
    border: solid 1px var(--ma-blue);
    border-radius: 0.25rem;
    background-color: var(--ma-blue);
    color: #ffffff;

    display: inline-block;
    padding: 0.47rem 0.75rem;
    box-shadow: none;

    text-decoration: none;
    line-height: 1.5;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;

    cursor: pointer;
    user-select: none;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  &:hover {
    background-color: #ffffff;
    border: solid 1px var(--ma-blue);
    color: var(--ma-blue);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background-color: var(--ma-gray-400);
    border-color: var(--ma-gray-400);
    box-shadow: none;
    color: var(--ma-gray-100);
    cursor: not-allowed;
  }

  > span + span {
    margin-left: 0.5rem;
  }
`;

export default PageCertificates;
