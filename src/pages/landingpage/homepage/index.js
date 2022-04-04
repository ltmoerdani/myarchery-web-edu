import * as React from "react";
import styled from "styled-components";
// import { useWizardView } from "../../../hooks/wizard-view";
// import { eventCategories } from "../../../constants";
import { EventsService, Landingpage } from "services";
import { useParams, Link } from "react-router-dom";
import Countdown from "react-countdown";
import { Container, Row, Col, Button } from "reactstrap";
import { ButtonBlue } from "components/ma";
import classnames from "classnames";
import { BreadcrumbDashboard } from "./components/breadcrumb";
import { useSelector } from "react-redux";
import { getAuthenticationStore } from "store/slice/authentication";
import kalasemen from "assets/images/myachery/kalasemen.png";
import book from "assets/images/myachery/book.png";
// import CurrencyFormat from "react-currency-format";

import { parseISO, format } from "date-fns";
import { id } from "date-fns/locale";

// const { TEAM_CATEGORIES } = eventCategories;

// const categoryTabsList = [
//   { step: 1, label: "Individu Putra", teamCategory: TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE },
//   { step: 2, label: "Individu Putri", teamCategory: TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE },
//   { step: 3, label: "Beregu Putra", teamCategory: TEAM_CATEGORIES.TEAM_MALE },
//   { step: 4, label: "Beregu Putri", teamCategory: TEAM_CATEGORIES.TEAM_FEMALE },
//   { step: 5, label: "Mixed Team", teamCategory: TEAM_CATEGORIES.TEAM_MIXED },
// ];

// function computeCategoriesByTeam(categoriesData) {
//   const categoriesByTeam = {
//     [TEAM_CATEGORIES.TEAM_INDIVIDUAL]: [],
//     [TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE]: [],
//     [TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE]: [],
//     [TEAM_CATEGORIES.TEAM_MALE]: [],
//     [TEAM_CATEGORIES.TEAM_FEMALE]: [],
//     [TEAM_CATEGORIES.TEAM_MIXED]: [],
//   };

//   for (const key in categoriesData) {
//     if (categoriesData.hasOwnProperty.call(categoriesData, key)) {
//       const element = categoriesData[key];
//       element.forEach((competition) => {
//         if (
//           competition?.teamCategoryId === TEAM_CATEGORIES.TEAM_INDIVIDUAL ||
//           competition?.teamCategoryId === "Individu"
//         ) {
//           categoriesByTeam[TEAM_CATEGORIES.TEAM_INDIVIDUAL].push(competition);
//         } else if (competition?.teamCategoryId === TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE) {
//           categoriesByTeam[TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE].push(competition);
//         } else if (competition?.teamCategoryId === TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE) {
//           categoriesByTeam[TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE].push(competition);
//         } else if (competition?.teamCategoryId === TEAM_CATEGORIES.TEAM_MALE) {
//           categoriesByTeam[TEAM_CATEGORIES.TEAM_MALE].push(competition);
//         } else if (competition?.teamCategoryId === TEAM_CATEGORIES.TEAM_FEMALE) {
//           categoriesByTeam[TEAM_CATEGORIES.TEAM_FEMALE].push(competition);
//         } else if (competition?.teamCategoryId === TEAM_CATEGORIES.TEAM_MIXED) {
//           categoriesByTeam[TEAM_CATEGORIES.TEAM_MIXED].push(competition);
//         }
//       });
//     }
//   }

//   return categoriesByTeam;
// }

function LandingPage() {
  const { slug } = useParams();
  // const { steps, currentStep, goToStep } = useWizardView(categoryTabsList);
  const [eventData, setEventData] = React.useState({});
  const [, setEventPerCategoryTeamPriceData] = React.useState([]);
  const [, setCategory] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [, setLoadingCategory] = React.useState(false);
  const [selectMenu, setSelectMenu] = React.useState("desc");
  const [selectClass, setSelectClass] = React.useState("recuver");
  const [selectAge, setSelectAge] = React.useState("umum");
  const [eventNew, setEventNew] = React.useState({});

  let { isLoggedIn } = useSelector(getAuthenticationStore);

  const getDataEventDetail = async () => {
    const { data } = await EventsService.getDetailEvent({ slug });
    if (data) {
      setEventData(data);
      setLoading(true);
      let fees = [];
      let checkFees = [];
      if (data.eventCategories && data.eventCategories.length > 0) {
        data.eventCategories.map((eventCategori) => {
          if (checkFees[eventCategori.teamCategoryId.id] == undefined)
            fees.push({
              label: eventCategori?.teamCategoryId?.label,
              fee: eventCategori?.fee,
              earlyBird: eventCategori?.earlyBird,
              endDateEarlyBird: eventCategori?.endDateEarlyBird,
              isEarlyBird: eventCategori?.isEarlyBird,
            });

          checkFees[eventCategori.teamCategoryId.id] = 1;
        });
      }
      setEventPerCategoryTeamPriceData(fees);
    }
  };

  const getDetailEventBySlug = async () => {
    const { data, message, errors } = await Landingpage.getEventBySlug({ slug });
    if (message === "Success") {
      setEventNew(data);
    }
    console.info(errors);
  };

  const getCategoryEvent = async (id) => {
    const { data } = await EventsService.getCategory({ event_id: id });
    if (data) {
      setCategory(data);
      setLoadingCategory(true);
    }
  };

  React.useEffect(() => {
    getDataEventDetail();
    getDetailEventBySlug();
    getCategoryEvent(eventData?.id);
  }, [eventData?.id]);

  // const categoriesByTeam = React.useMemo(() => computeCategoriesByTeam(category), [category]);

  const dateEventStart = eventData ? parseISO(eventNew?.eventStartDatetime) : "";
  const dateEventEnd = eventData ? parseISO(eventNew?.eventEndDatetime) : "";

  // const registerEventStart = eventData
  //   ? parseISO(eventData?.publicInformation?.eventStartRegister)
  //   : "";
  const registerEventEnd = eventData
    ? parseISO(eventData?.publicInformation?.eventEndRegister)
    : "";

  const breadcrumpCurrentPageLabel = () => {
    return (
      <>
        <span style={{ color: "#0d47a1" }}>Beranda</span>
        <span> / </span>
        <span style={{ color: "#000" }}>{eventData?.publicInformation?.eventName}</span>
      </>
    );
  };

  let feeArray = [];

  console.log(eventNew);

  const getFee = () => {
    return eventData?.eventCategories?.map((categorie) => {
      return categorie?.fee;
    });
  };
  feeArray = getFee();
  feeArray?.sort((a, b) => a - b);

  const screenLoading = () => {
    return (
      <div style={{ height: "50vh" }} className="d-flex justify-content-center align-items-center">
        <div className="spinner-grow" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  };

  if (!loading) {
    return <React.Fragment>{screenLoading()}</React.Fragment>;
  }

  // const handleLoadCategory = () => {
  //   return <div>{screenLoading()}</div>;
  // };

  return (
    <PageWrapper>
      <Container fluid>
        <BreadcrumbDashboard to="/dashboard">{breadcrumpCurrentPageLabel()}</BreadcrumbDashboard>

        <div className="event-banner">
          <img className="event-banner-image" src={eventNew?.poster} />
        </div>

        <Row className="mt-3">
          <Col md="8">
            <div className="event-box">
              <div className="d-flex align-items-center">
                <span style={{ color: "#0D47A1", fontSize: "32px" }}>{eventNew?.eventName}</span>
                <span
                  className="p-1"
                  style={{ color: "#000", backgroundColor: "#FFCF70", borderRadius: "25px" }}
                >
                  {eventNew?.eventCompetition}
                </span>
              </div>
              <div style={{ fontWeight: "600" }}>
                {eventNew
                  ? `${formatEventDate(dateEventStart)} - ${formatEventDate(dateEventEnd)}`
                  : "tanggal tidak tersedia"}{" "}
                | {eventNew?.location}
              </div>
              <div>oleh {eventNew?.detailAdmin?.name}</div>
              <div>
                <div
                  className="d-flex justify-content-center align-content-center py-3"
                  style={{
                    flexWrap: "wrap",
                    gap: "28px",
                    backgroundColor: "#E7EDF6",
                    borderRadius: "5px",
                    fontSize: "18px",
                  }}
                >
                  <span
                    onClick={() => setSelectClass("recuver")}
                    className={classnames({
                      "filter-category-active": selectClass === "recuver",
                      "filter-category": selectClass !== "recuver",
                    })}
                  >
                    Recurve
                  </span>
                  <span
                    onClick={() => setSelectClass("compound")}
                    className={classnames({
                      "filter-category-active": selectClass === "compound",
                      "filter-category": selectClass !== "compound",
                    })}
                  >
                    Compound
                  </span>
                  <span
                    onClick={() => setSelectClass("nasional")}
                    className={classnames({
                      "filter-category-active": selectClass === "nasional",
                      "filter-category": selectClass !== "nasional",
                    })}
                  >
                    Nasional
                  </span>
                  <span
                    onClick={() => setSelectClass("barebow")}
                    className={classnames({
                      "filter-category-active": selectClass === "barebow",
                      "filter-category": selectClass !== "barebow",
                    })}
                  >
                    Barebow
                  </span>
                </div>
                <div>
                  <div className="d-flex justify-content-center my-4 w-100">
                    <span
                      onClick={() => setSelectAge("umum")}
                      className={classnames("p-1 me-2", {
                        "age-filter-active": selectAge === "umum",
                        "age-filter": selectAge !== "umum",
                      })}
                    >
                      Umum - 50 Meter
                    </span>
                    <span
                      onClick={() => setSelectAge("u-12")}
                      className={classnames("p-1 me-2", {
                        "age-filter-active": selectAge === "u-12",
                        "age-filter": selectAge !== "u-12",
                      })}
                    >
                      U-12 - 50 Meter
                    </span>
                  </div>
                </div>
                <div
                  className="d-flex justify-content-center py-2"
                  style={{ backgroundColor: "#F6F6F6" }}
                >
                  <span style={{ color: "#0D47A1", fontSize: "18px" }}>Kuota Pertandingan</span>
                </div>
                <div className="d-flex mt-2">
                  <div
                    className="px-2 py-2"
                    style={{
                      border: "1px solid #EEEEEE",
                      borderRadius: "5px",
                      textAlign: "center",
                    }}
                  >
                    <div>
                      <span style={{ color: "#0D47A1", fontSize: "16px" }}>Putra</span>
                    </div>
                    <div
                      className="py-1 px-2"
                      style={{ backgroundColor: "#AEDDC2", borderRadius: "25px" }}
                    >
                      <span>Tersedia: 8/30</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="d-flex">
                <div
                  onClick={() => setSelectMenu("desc")}
                  className="py-2 pe-4 ps-3"
                  style={{
                    width: "204px",
                    backgroundColor: `${selectMenu === "desc" ? "#0D47A1" : "#FFF"}`,
                    borderRadius: "5px 5px 0 0",
                    color: `${selectMenu === "desc" ? "#FFF" : "#000"}`,
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: `${
                      selectMenu === "desc" ? "none" : "0 0.1rem 0.5rem rgb(18 38 63 / 10%)"
                    }`,
                  }}
                >
                  Deskripsi
                </div>
                <div
                  onClick={() => setSelectMenu("faq")}
                  className="ms-2 py-2 pe-4 ps-3"
                  style={{
                    width: "204px",
                    backgroundColor: `${selectMenu === "faq" ? "#0D47A1" : "#FFF"}`,
                    borderRadius: "5px 5px 0 0",
                    color: `${selectMenu === "faq" ? "#FFF" : "#000"}`,
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: `${
                      selectMenu === "faq" ? "none" : "0 0.1rem 0.5rem rgb(18 38 63 / 10%)"
                    }`,
                  }}
                >
                  FAQ
                </div>
              </div>
              <div className="event-box">
                {selectMenu === "desc" && (
                  <div>
                    <div>
                      <h3>Deskripsi</h3>
                      <DescriptionContent>{eventNew?.description}</DescriptionContent>
                    </div>
                    <h3>Waktu &amp; Tempat</h3>
                    <table className="mb-3 content-info-time-place">
                      <tbody>
                        <tr>
                          <td style={{ minWidth: 120 }}>Tanggal Event</td>
                          <td style={{ minWidth: "0.5rem" }}>:</td>
                          <td>
                            {eventNew
                              ? `${formatEventDate(dateEventStart)} - ${formatEventDate(
                                  dateEventEnd
                                )}`
                              : "tanggal tidak tersedia"}
                          </td>
                        </tr>
                        <tr>
                          <td>Lokasi</td>
                          <td>:</td>
                          <td>{eventNew?.location}</td>
                        </tr>
                        <tr>
                          <td>Kota</td>
                          <td>:</td>
                          <td>{eventNew?.detailCity?.name}</td>
                        </tr>
                        <tr>
                          <td>Lapangan</td>
                          <td>:</td>
                          <td>{eventNew?.locationType}</td>
                        </tr>
                      </tbody>
                    </table>
                    {eventNew?.moreInformation?.map((information) => {
                      return (
                        <div key={information.id}>
                          <h5 className="content-info-heading">{information?.title}</h5>
                          <div>
                            <DescriptionContent>{information?.description}</DescriptionContent>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {selectMenu === "faq" && (
                  <div>
                    <h3>FAQ</h3>
                  </div>
                )}
              </div>
            </div>
          </Col>

          <Col md="4">
            <div className="event-countdown-box">
              {eventData && (
                <React.Fragment>
                  <div style={{ textAlign: "start" }}>
                    <h5>Biaya Pendaftaran</h5>
                    <Row>
                      <Col
                        md={4}
                        className="py-2 px-2"
                        style={{
                          border: "1px solid #FFB420",
                          textAlign: "center",
                          borderRadius: "5px",
                        }}
                      >
                        <div
                          className="px-3 py-1"
                          style={{
                            backgroundColor: "#FFB420",
                            color: "#495057",
                            borderRadius: "5px",
                          }}
                        >
                          Individu
                        </div>
                        <div className="mt-2 col-4">
                          <div>
                            <span style={{ textDecoration: "line-through" }}>Rp350.000</span>
                          </div>
                          <div>
                            <span
                              style={{ lineHeight: "24px", fontSize: "18px", color: "#0D47A1" }}
                            >
                              Rp350.000
                            </span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div>
                      <span style={{ fontWeight: "600" }}>
                        Early Bird sampai Rabu, 25 Maret 2022
                      </span>
                      <span>
                        | Segera daftarkan dirimu dan timmu pada kompetisi Pro Jakarta Open 2022
                      </span>
                    </div>
                  </div>
                  <Countdown date={registerEventEnd} renderer={HandlerCountDown} />
                </React.Fragment>
              )}

              {eventData?.closedRegister ? (
                <Button disabled style={{ width: 120 }}>
                  Tutup
                </Button>
              ) : (
                <ButtonBlue
                  as={Link}
                  to={`${
                    !isLoggedIn
                      ? `/archer/login?path=/event-registration/${slug}`
                      : `/event-registration/${slug}`
                  }`}
                  style={{ width: "100%" }}
                >
                  Daftar
                </ButtonBlue>
              )}
            </div>

            <div className="mt-4">
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
                    Klik untuk melihat{">"}
                  </span>
                </div>
              </div>
              {eventNew?.handbook ? (
                <>
                  <div
                    onClick={() => window.open(eventNew?.handbook)}
                    style={{ backgroundColor: "#0D47A1", borderRadius: "8px", cursor: "pointer" }}
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
                        Klik untuk unduh{">"}
                      </span>
                    </div>
                  </div>
                  {/* <ButtonOutlineBlue
                    onClick={() => window.open(eventData?.publicInformation?.handbook)}
                    className="w-100 fw-bold"
                  >
                    Download THB
                  </ButtonOutlineBlue> */}
                </>
              ) : null}
              {/* <ButtonOutlineBlue
                className="w-100 fw-bold mt-2"
                as={Link}
                to={`/live-score/${slug}/qualification`}
              >
                Live Score
              </ButtonOutlineBlue>

              <ButtonOutlineBlue
                className="w-100 fw-bold mt-2"
                as={Link}
                to={`/event-ranks/${slug}/clubs`}
              >
                Lihat Pemeringkatan Klub
              </ButtonOutlineBlue> */}
            </div>
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
}

function HandlerCountDown({ days, hours, minutes, seconds, completed }) {
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

// function EventCategoryGrid({ eventData, categories, slug, isLoggedIn }) {
//   return (
//     <div className="event-category-grid">
//       {categories.map((category, index) => (
//         <div key={index} className="event-category-card">
//           <h5 className="heading-category-name">{category.categoryLabel}</h5>
//           <div className="mt-4 body-category-detail">
//             <div>
//               <span className="category-quota-label">
//                 Tersedia: {category.quota - category.totalParticipant}/{category.quota}
//               </span>
//             </div>
//             <div>
//               {eventData?.closedRegister == false &&
//               category.quota - category.totalParticipant > 0 &&
//               category?.isOpen ? (
//                 <ButtonBlue
//                   as={Link}
//                   to={`${
//                     !isLoggedIn
//                       ? `/archer/login?path=/event-registration/${slug}?categoryId=${category?.id}`
//                       : `/event-registration/${slug}?categoryId=${category?.id}`
//                   }`}
//                   corner="8"
//                   style={{ width: 120 }}
//                 >
//                   Daftar
//                 </ButtonBlue>
//               ) : (
//                 <Button disabled style={{ width: 120 }}>
//                   {!category.isOpen ? "Belum Buka" : eventData?.closedRegister ? "Tutup" : "Full"}
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

const PageWrapper = styled.div`
  margin: 40px 0;
  background-color: #fff;
  font-family: "Inter";

  .event-box {
    padding: 16px 18px;
    border-radius: 4px;
    box-shadow: 0 0.1rem 0.5rem rgb(18 38 63 / 10%);
    color: #000000;
  }

  .filter-category-active {
    border-bottom: 1px solid #ffb420;
    transform: translateY(-5px);
    color: #0d47a1;
    font-weight: 600;
    cursor: pointer;
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

const DescriptionContent = styled.p`
  white-space: pre-wrap;
`;

// util
function formatEventDate(date) {
  let dateObject = typeof date === "string" ? parseISO(date) : date;
  return format(dateObject, "d MMMM yyyy", { locale: id });
}

export default LandingPage;
