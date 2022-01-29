import * as React from "react";
import styled from "styled-components";
import { useWizardView } from "../../../hooks/wizard-view";
import { eventCategories } from "../../../constants";
import { EventsService } from "services";
import { useParams, Link } from "react-router-dom";
import Countdown from "react-countdown";
import { Container, Row, Col, Button } from "reactstrap";
import { WizardView, WizardViewContent, ButtonBlue } from "components/ma";
import classnames from "classnames";
import { BreadcrumbDashboard } from "./components/breadcrumb";

const { TEAM_CATEGORIES } = eventCategories;

const categoryTabsList = [
  { step: 1, label: "Individu", teamCategory: TEAM_CATEGORIES.TEAM_INDIVIDUAL },
  { step: 2, label: "Male Team", teamCategory: TEAM_CATEGORIES.TEAM_MALE },
  { step: 3, label: "Female Team", teamCategory: TEAM_CATEGORIES.TEAM_FEMALE },
  { step: 4, label: "Mixed Team", teamCategory: TEAM_CATEGORIES.TEAM_MIXED },
];

function computeCategoriesByTeam(categoriesData) {
  const categoriesByTeam = {
    [TEAM_CATEGORIES.TEAM_INDIVIDUAL]: [],
    [TEAM_CATEGORIES.TEAM_MALE]: [],
    [TEAM_CATEGORIES.TEAM_FEMALE]: [],
    [TEAM_CATEGORIES.TEAM_MIXED]: [],
  };

  for (const key in categoriesData) {
    if (categoriesData.hasOwnProperty.call(categoriesData, key)) {
      const element = categoriesData[key];
      element.forEach((competition) => {
        console.log(competition);
        if (
          competition?.teamCategoryId === TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE ||
          competition?.teamCategoryId === TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE ||
          competition?.teamCategoryId === TEAM_CATEGORIES.TEAM_INDIVIDUAL ||
          competition?.teamCategoryId === "Individu"
        ) {
          categoriesByTeam[TEAM_CATEGORIES.TEAM_INDIVIDUAL].push(competition);
        } else if (competition?.teamCategoryId === TEAM_CATEGORIES.TEAM_MALE) {
          categoriesByTeam[TEAM_CATEGORIES.TEAM_MALE].push(competition);
        } else if (competition?.teamCategoryId === TEAM_CATEGORIES.TEAM_FEMALE) {
          categoriesByTeam[TEAM_CATEGORIES.TEAM_FEMALE].push(competition);
        } else if (competition?.teamCategoryId === TEAM_CATEGORIES.TEAM_MIXED) {
          categoriesByTeam[TEAM_CATEGORIES.TEAM_MIXED].push(competition);
        }
      });
    }
  }

  return categoriesByTeam;
}

function LandingPage() {
  const { slug } = useParams();
  const { steps, currentStep, goToStep } = useWizardView(categoryTabsList);
  const [eventData, setEventData] = React.useState({});
  const [category, setCategory] = React.useState({});

  const getDataEventDetail = async () => {
    const { message, errors, data } = await EventsService.getDetailEvent({ slug });
    if (data) {
      setEventData(data);
      console.log(data);
      console.log(message);
      console.log(errors);
    }
    console.log(message);
    console.log(errors);
  };

  const getCategoryEvent = async (id) => {
    const { message, errors, data } = await EventsService.getCategory({ event_id: id });
    if (data) {
      setCategory(data);
      console.log(message);
      console.log(errors);
    }
    console.log(message);
    console.log(errors);
  };

  React.useEffect(() => {
    getDataEventDetail();
    getCategoryEvent(eventData?.id);
  }, [eventData?.id]);

  const categoriesByTeam = React.useMemo(() => computeCategoriesByTeam(category), [category]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateEventStart = new Date(eventData?.publicInformation?.eventStart);
  const dateEventEnd = new Date(eventData?.publicInformation?.eventEnd);

  const registerEventStart = new Date(eventData?.publicInformation?.eventStartRegister);
  const registerEventEnd = new Date(eventData?.publicInformation?.eventEndRegister);

  const handlerEvenDate = (date) => {
    const dateEvent = `${date?.getDate()} ${months[date?.getMonth()]} ${date?.getFullYear()}`;
    return dateEvent;
  };

  const breadcrumpCurrentPageLabel = () => {
    return (
      <>
        <span style={{ color: "#0d47a1" }}>Beranda</span>
        <span> / </span>
        <span style={{ color: "#000" }}>{eventData?.publicInformation?.eventName}</span>
      </>
    );
  };

  return (
    <PageWrapper>
      <Container fluid>
        <BreadcrumbDashboard to="/dashboard">{breadcrumpCurrentPageLabel()}</BreadcrumbDashboard>

        <div className="event-banner">
          <img className="event-banner-image" src={eventData?.publicInformation?.eventBanner} />
        </div>

        <Row className="mt-3">
          <Col md="8">
            <div className="d-flex align-items-center">
              <h1 className="event-heading me-3">{eventData?.publicInformation?.eventName}</h1>
              <span
                style={{
                  backgroundColor: "#FFCF70",
                  padding: "4px 8px",
                  alignItems: "center",
                  borderRadius: "10px",
                  fontWeight: "bold",
                }}
              >
                {eventData?.eventType}
              </span>
            </div>
            <div>Oleh {`${eventData?.admins?.name}`} Club</div>

            <div className="content-section mt-5">
              {/* Optional field */}
              <React.Fragment>
                <h5 className="content-info-heading">Deskripsi</h5>
                <p>{eventData?.publicInformation?.eventDescription}</p>
              </React.Fragment>
              {/* Required fields */}
              <h5 className="content-info-heading">Waktu &amp; Tempat</h5>
              <table className="mb-3 content-info-time-place">
                <tbody>
                  <tr>
                    <td style={{ minWidth: 120 }}>Tanggal Event</td>
                    <td style={{ minWidth: "0.5rem" }}>:</td>
                    <td>{`${handlerEvenDate(dateEventStart)} ${handlerEvenDate(dateEventEnd)}`}</td>
                  </tr>
                  <tr>
                    <td>Lokasi</td>
                    <td>:</td>
                    <td>{eventData?.publicInformation?.eventLocation}</td>
                  </tr>
                  <tr>
                    <td>Kota</td>
                    <td>:</td>
                    <td>{eventData?.publicInformation?.eventCity?.nameCity}</td>
                  </tr>
                  <tr>
                    <td>Lapangan</td>
                    <td>:</td>
                    <td>{eventData?.publicInformation?.eventLocationType}</td>
                  </tr>
                </tbody>
              </table>
              {eventData?.moreInformation?.map((information) => {
                return (
                  <div key={information.id}>
                    <h5 className="content-info-heading">{information?.title}</h5>
                    <div>
                      <p>{information?.description}</p>
                    </div>
                  </div>
                );
              })}

              <h5 className="content-info-heading">Biaya Registrasi</h5>
              <div>
                {eventData?.eventCategories?.map((eventCategori) => {
                  return (
                    <>
                      <p>
                        {eventCategori?.teamCategoryId?.label}:
                        <br />
                        <span>
                          {`${eventCategori?.ageCategoryId?.label} - ${eventCategori?.competitionCategoryId?.label} - ${eventCategori?.distanceId?.label}`}
                        </span>
                        <br />
                        <span>
                          Tanggal Registrasi{" "}
                          {`${handlerEvenDate(registerEventStart)} - ${handlerEvenDate(
                            registerEventEnd
                          )}`}
                        </span>
                        <br />
                        <span>Mulai dari Rp{eventCategori?.fee}</span>
                      </p>
                    </>
                  );
                })}
              </div>
            </div>
          </Col>

          <Col md="4">
            <div className="event-notice-find">
              Temukan lebih banyak event panahan di{" "}
              <Link to="/home">
                <a className="event-preview-link">myarchery.id</a>
              </Link>
            </div>

            <div className="event-countdown-box">
              <h5>Waktu tersisa</h5>

              <Countdown
                date={`${eventData?.publicInformation?.eventEndRegister}`}
                renderer={HandlerCountDown}
              />
              <ButtonBlue as={Link} to={`/event-registration/${slug}`} style={{ width: "100%" }}>
                Daftar
              </ButtonBlue>
            </div>

            <div className="mt-4">
              <Button
                className="btn w-100"
                style={{ backgroundColor: "#FFF", borderColor: "#0d47a1" }}
              >
                <span style={{ color: "#0d47a1", fontWeight: "600" }}>Live Score</span>
              </Button>
            </div>
          </Col>
        </Row>

        <div className="mt-4" id="kategori-lomba">
          <h5 className="text-black">Kategori Lomba</h5>

          <div className="event-team-tabs mt-3 mb-4">
            {steps.map((tabItem) => (
              <div key={tabItem.step}>
                <button
                  className={classnames("event-team-item", {
                    "team-active": currentStep === tabItem.step,
                  })}
                  onClick={() => goToStep(tabItem.step)}
                >
                  {tabItem.label}
                </button>
              </div>
            ))}
          </div>

          <WizardView currentStep={currentStep}>
            <WizardViewContent>
              <EventCategoryGrid
                slug={slug}
                categories={categoriesByTeam[TEAM_CATEGORIES.TEAM_INDIVIDUAL]}
              />
            </WizardViewContent>
            <WizardViewContent>
              <EventCategoryGrid
                slug={slug}
                categories={categoriesByTeam[TEAM_CATEGORIES.TEAM_MALE]}
              />
            </WizardViewContent>
            <WizardViewContent>
              <EventCategoryGrid
                slug={slug}
                categories={categoriesByTeam[TEAM_CATEGORIES.TEAM_FEMALE]}
              />
            </WizardViewContent>
            <WizardViewContent>
              <EventCategoryGrid
                slug={slug}
                categories={categoriesByTeam[TEAM_CATEGORIES.TEAM_MIXED]}
              />
            </WizardViewContent>
          </WizardView>
        </div>
      </Container>
    </PageWrapper>
  );
}

function HandlerCountDown({ days, hours, minutes, seconds, completed }) {
  // const { slug } = useParams();
  if (completed) {
    return (
      <div>
        <span>Expired</span>
      </div>
    );
  }
  return (
    <div>
      <div className="countdown-timer">
        <div className="countdown-item">
          {days}
          <span className="timer-unit">Hari</span>
        </div>
        <div className="countdown-item">
          {hours}
          <span className="timer-unit">Jam</span>
        </div>
        <div className="countdown-item">
          {minutes}
          <span className="timer-unit">Menit</span>
        </div>
        <div className="countdown-item">
          {seconds}
          <span className="timer-unit">Detik</span>
        </div>
      </div>
    </div>
  );
}

// function CopywritingRegistrationFee({ eventData }) {
//   const computeDisplayFee = () => {
//     if (eventData.isFlatRegistrationFee) {
//       return eventData.registrationFee;
//     }
//     const lowestFee = eventData.registrationFees?.sort(lowToHigh)[0].amount;
//     return lowestFee;
//   };

//   if (!eventData.registrationFee && !eventData.registrationFees?.length) {
//     return (
//       <React.Fragment>
//         Mulai dari Rp <span>&laquo;data harga tidak tersedia&raquo;</span>
//       </React.Fragment>
//     );
//   }

//   return (
//     <React.Fragment>
//       Mulai dari{" "}
//       <CurrencyFormat
//         displayType={"text"}
//         value={computeDisplayFee()}
//         prefix="Rp&nbsp;"
//         thousandSeparator={"."}
//         decimalSeparator={","}
//         decimalScale={2}
//         fixedDecimalScale
//       />
//     </React.Fragment>
//   );
// }

function EventCategoryGrid({ categories, slug }) {
  return (
    <div className="event-category-grid">
      {categories.map((category, index) => (
        <div key={index} className="event-category-card">
          <h5 className="heading-category-name">{category.categoryLabel}</h5>
          <div className="mt-4 body-category-detail">
            <div>
              <span className="category-quota-label">0&#47;{category.quota}</span>
            </div>
            <div>
              <ButtonBlue
                as={Link}
                to={`/event-registration/${slug}?categoryId=${category?.id}`}
                className="btn btn-primary"
                corner="8"
                style={{ width: 120 }}
              >
                Daftar
              </ButtonBlue>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const PageWrapper = styled.div`
  margin: 40px 0;
  background-color: #fff;
  font-family: "Inter";

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
        padding: 0.5rem;
        border-radius: 4px;
        border: solid 1px #eff2f7;
        font-size: 18px;
        font-weight: 600;

        .timer-unit {
          padding: 2px 8px;
          background-color: #eff2f7;
          font-size: 11px;
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

// const lowToHigh = (feeA, feeB) => {
//   if (feeA.amount === feeB.amount) {
//     return 0;
//   }
//   if (feeA.amount < feeB.amount) {
//     return -1;
//   }
//   return 1;
// };

export default LandingPage;
