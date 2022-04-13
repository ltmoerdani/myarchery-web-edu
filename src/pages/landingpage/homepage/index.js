import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEventDetail } from "./hooks/event-detail";
import { useEventFAQ } from "./hooks/event-faqs";

import { Container, Row, Col } from "reactstrap";
import { SpinnerDotBlock } from "components/ma";
import { MainCardEvent } from "./components/main-card-event";
import { CardEventCTA } from "./components/card-event-cta";
import { TabbedContents } from "./components/tabbed-contents";

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
      <Container fluid>
        <InnerContentWrapper>
          <div className="event-banner">
            <img className="event-banner-image" src={eventDetail?.poster} />
          </div>

          <Row className="mt-3">
            <Col md="8">
              <MainCardEvent eventDetail={eventDetail} />

              <TabbedContents eventDetail={eventDetail} dataFAQ={dataFAQ} />
            </Col>

            <Col md="4">
              <CardEventCTA eventDetail={eventDetail} />

              <div className="mt-4 pt-4">
                {/* Klasemen */}
                <div
                  style={{ backgroundColor: "#0D47A1", borderRadius: "8px", cursor: "pointer" }}
                  className="d-flex justify-content-between align-items-center px-1"
                >
                  <div style={{ width: "70%" }}>
                    <img width="100%" style={{ objectFit: "cover" }} src={kalasemen} />
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontWeight: "600", fontSize: "18px", color: "#FFF" }}>
                      Klasemen Pertandingan
                    </span>

                    <br />

                    <span style={{ fontStyle: "italic", color: "#FFF" }}>
                      Klik untuk melihat {">"}
                    </span>
                  </div>
                </div>

                {/*  Handbook */}
                {Boolean(eventDetail?.handbook) && (
                  <div
                    onClick={() => window.open(eventDetail?.handbook)}
                    style={{
                      backgroundColor: "#0D47A1",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    className="d-flex justify-content-between align-items-center px-1 mt-3"
                  >
                    <div style={{ width: "70%" }}>
                      <img width="100%" style={{ objectFit: "cover" }} src={book} />
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontWeight: "600", fontSize: "18px", color: "#FFF" }}>
                        Technical Handbook{" "}
                      </span>

                      <br />

                      <span style={{ fontStyle: "italic", color: "#FFF" }}>
                        Klik untuk unduh {">"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </InnerContentWrapper>
      </Container>
    </PageWrapper>
  );
}

const InnerContentWrapper = styled.div`
  max-width: 75rem;
  margin: 0 auto;
`;

const PageWrapper = styled.div`
  margin: 2.5rem 0;
  background-color: #f8f8fa;
  font-family: "Inter";

  .text-category {
    color: #0d47a1;
    font-size: 16px;
    font-weight: 600;
  }

  .event-box {
    padding: 16px 18px;
    border-radius: 4px;
    box-shadow: 0 0.1rem 0.5rem rgb(18 38 63 / 10%);
    background-color: #ffffff;
    color: #000000;
  }

  .filter-category-active {
    border-bottom: 1px solid #ffb420;
    transform: translateY(-5px);
    color: #0d47a1;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.5s;
  }

  .filter-category {
    color: #90aad4;
    font-weight: 600;
    cursor: pointer;
  }

  .age-filter-active {
    border-radius: 8px;
    border: 1px solid #ffb420;
    background-color: #fff8e9;
    color: #ffb420;
    font-size: 18px;
    cursor: pointer;
  }

  .age-filter {
    color: #afafaf;
    font-size: 18px;
    cursor: pointer;
  }

  .event-banner {
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
  }

  .event-heading {
    margin-bottom: 0;
    color: var(--ma-blue);
  }

  .content-section {
    color: #000000;

    .content-info-heading {
      margin-top: 2rem;
      color: #000000;
    }

    .content-info-time-place td {
      cursor: initial;
    }
  }

  .event-preview-link {
    color: var(--ma-blue);
  }

  .button-preview {
    transition: all 0.2s;

    &:hover {
      box-shadow: none;
      opacity: 0.4;
    }
  }

  .button-preview-outline {
    transition: all 0.2s;

    &:disabled {
      background-color: #0d47a1;
      border: solid 1px var(--ma-gray-200) !important;
      color: #fff;
    }

    &:hover {
      box-shadow: none;
      opacity: 0.7;
    }
  }

  .button-leaderboard {
    width: 100%;
    text-align: center;
  }

  .event-notice-find {
    margin-bottom: 20px;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: #f3f3f3;
    color: #000000;
  }

  .event-countdown-box {
    padding: 16px 18px;
    border-radius: 4px;
    box-shadow: 0 0.1rem 0.5rem rgb(18 38 63 / 10%);
    text-align: center;
    background-color: #ffffff;
    color: #000000;

    h5 {
      color: #000000;
    }

    > *:not(:first-child) {
      margin-top: 1rem;
    }

    .countdown-timer {
      display: flex;
      justify-content: space-evenly;
      gap: 0.5rem;

      .countdown-item {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        border-radius: 4px;
        border: solid 1px #eff2f7;
        font-size: 18px;
        font-weight: 600;

        .timer-unit {
          padding: 2px 8px;
          background-color: #eff2f7;
          font-size: 12px;
          font-weight: 400;
        }
      }
    }
  }

  .event-team-tabs {
    display: flex;
    list-style: none;
    padding: 0;
    gap: 0.75rem;

    .event-team-item {
      display: inline-block;
      padding: 0.8rem 1.5rem;
      border-radius: 2rem;
      border: solid 1px #0d47a1;
      background-color: transparent;
      color: #0d47a1;

      &.team-active {
        background-color: #0d47a1;
        color: #ffffff;
      }
    }
  }

  .event-category-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media screen and (max-width: 600px) {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      height: 245px;
      overflow-y: auto;
    }

    .event-category-card {
      padding: 12px 1rem;
      border-radius: 4px;
      background-color: #ffffff;
      transition: box-shadow 0.5s, transform 0.25s;

      &:hover {
        box-shadow: 0 0.3rem 0.75rem rgb(18 38 63 / 10%);
        transform: translateY(-0.75px);

        .button-card-regist {
          border-color: var(--ma-blue);
          background-color: var(--ma-blue);

          &:hover {
            border-color: var(--ma-gray-400);
            background-color: var(--ma-gray-400);
          }
        }
      }

      .heading-category-name {
        color: var(--ma-blue);
      }

      .body-category-detail {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .category-quota-label {
          padding: 4px 8px;
          border-radius: 1em;
          background-color: #aeddc2;
        }
      }
    }
  }
`;

export default LandingPage;
