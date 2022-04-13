import * as React from "react";
import styled from "styled-components";
// import { useWizardView } from "../../../hooks/wizard-view";
import { eventCategories } from "../../../constants";
import { EventsService, Landingpage, FagService, CategoryService } from "services";
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
import CurrencyFormat from "react-currency-format";

import { parseISO, format } from "date-fns";
import { id } from "date-fns/locale";

const { TEAM_CATEGORIES } = eventCategories;

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

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

function LandingPage() {
  const { slug } = useParams();
  // const { steps, currentStep, goToStep } = useWizardView(categoryTabsList);
  const [eventData, setEventData] = React.useState({});
  const [, setEventPerCategoryTeamPriceData] = React.useState([]);
  const [category, setCategory] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingCategory, setLoadingCategory] = React.useState(false);
  const [selectMenu, setSelectMenu] = React.useState("desc");
  const [selectClass, setSelectClass] = React.useState("");
  const [selectAge, setSelectAge] = React.useState("");
  const [filteClass, setFilterClass] = React.useState({});
  const [eventNew, setEventNew] = React.useState({});
  const [dataFAQ, setDataFAQ] = React.useState([]);
  const [listCategory, setListCategory] = React.useState([]);

  const { width } = useWindowDimensions();
  console.log(width);

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
    const { data, errors } = await Landingpage.getEventBySlug({
      slug,
    });
    if (data) {
      setEventNew(data);
    }
    console.info(errors);
  };

  const getListFAQ = async (id) => {
    const { data, message, errors } = await FagService.getListFaq({ event_id: id, limit: 30 });
    if (message === "Success") {
      setDataFAQ(data);
    }
    console.info(errors);
  };

  const getCategoryEvent = async (id) => {
    const { data } = await CategoryService.getCategoryv2({ event_id: id });
    if (data) {
      setCategory(data);
      setLoadingCategory(true);
    }
  };
  const getListCategoryEvent = async (id) => {
    const { data } = await CategoryService.getCategoryv2({
      event_id: id,
      competition_category_id: selectClass ? selectClass : "",
      // age_category_id: filteClass ? filteClass?.age_category_id : null,
      // distance_id: filteClass ? filteClass?.distance_id : null
    });
    if (data) {
      setListCategory(data);
      setLoadingCategory(true);
    }
  };

  React.useEffect(() => {
    getDataEventDetail();
    getDetailEventBySlug();
    getCategoryEvent(eventNew?.id);
    getListFAQ(eventNew.id);
    getListCategoryEvent(eventNew?.id);
  }, [eventNew?.id, selectClass, filteClass, arrAge]);

  let arrCategory = [];
  let classCategoryList = [];
  let firsArrayCategory = [];
  let firtsclassCategory = [];

  let classCategory = [];

  for (let i = 0; i < category.length; i++) {
    arrCategory[i] = category[i].competitionCategoryId;
  }

  for (let i = 0; i < listCategory.length; i++) {
    if (listCategory[i].competitionCategoryId === arrCategory[0]) {
      firsArrayCategory.push(listCategory[i]);
    }
  }

  let categoryArr = [...new Set(arrCategory)];

  for (let i = 0; i < firsArrayCategory.length; i++) {
    firtsclassCategory[i] = firsArrayCategory[i].classCategory;
  }

  for (let i = 0; i < listCategory.length; i++) {
    classCategoryList[i] = listCategory[i].classCategory;
  }
  classCategory = selectClass ? [...new Set(classCategoryList)] : [...new Set(firtsclassCategory)];

  // const categoriesByTeam = React.useMemo(() => computeCategoriesByTeam(category), [category]);

  const dateEventStart = eventNew ? parseISO(eventNew?.eventStartDatetime) : "";
  const dateEventEnd = eventNew ? parseISO(eventNew?.eventEndDatetime) : "";

  // const registerEventStart = eventData
  //   ? parseISO(eventData?.publicInformation?.eventStartRegister)
  //   : "";
  const registerEventEnd = eventNew ? parseISO(eventNew?.registrationEndDatetime) : "";

  const breadcrumpCurrentPageLabel = () => {
    return (
      <>
        <span style={{ color: "#0d47a1" }}>Beranda</span>
        <span> / </span>
        <span style={{ color: "#000" }}>{eventNew?.eventName}</span>
      </>
    );
  };

  let feeArray = [];
  let feeType = [];
  let arrayFee = [];
  let dateEarlyBird = [];

  arrayFee = eventNew?.eventPrice ? Object.values(eventNew?.eventPrice) : [];
  feeType = eventNew?.eventPrice ? Object.keys(eventNew?.eventPrice) : [];

  for (let i = 0; i < arrayFee.length; i++) {
    dateEarlyBird.push(arrayFee[i].endDateEarlyBird);
  }

  // let earlyBirdDate = [...new Set(dateEarlyBird)];

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

  const handleLoadCategory = () => {
    return <div>{screenLoading()}</div>;
  };

  const hanlderSplitString = (data) => {
    if (data) {
      let arr = data.split(" - ");
      let payload = { ...filteClass };
      payload["age_category_id"] = arr[0];
      payload["distance_id"] = arr[1];
      setFilterClass(payload);
    }
  };

  let arrData = !selectClass ? firsArrayCategory : listCategory;
  let compData = [];
  let compDataFirst = [];

  let arrAge = classCategory[0]?.split(" - ");

  for (let i = 0; i < arrData.length; i++) {
    if (filteClass.age_category_id === arrData[i].ageCategoryId) {
      compData.push(arrData[i]);
    }
    if (arrAge[0] === arrData[i].ageCategoryId) {
      compDataFirst.push(arrData[i]);
    }
  }

  let computerData = !selectAge ? compDataFirst : compData;

  const convertLabel = (label) => {
    if (label === TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE) {
      return "Individu Putra";
    }
    if (label === TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE) {
      return "Individu Putri";
    }
    if (label === TEAM_CATEGORIES.TEAM_MALE) {
      return "Beregu Putra";
    }
    if (label === TEAM_CATEGORIES.TEAM_FEMALE) {
      return "Beregu Putri";
    }
    if (label === TEAM_CATEGORIES.TEAM_MIXED) {
      return "Mixed Team";
    }
  };

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
                    onClick={() => {
                      setSelectClass(categoryArr[0]);
                      setSelectAge("");
                      setFilterClass({});
                    }}
                    className={classnames({
                      "filter-category-active":
                        selectClass === "" || selectClass === categoryArr[0],
                      "filter-category": selectClass !== "" && selectClass !== categoryArr[0],
                    })}
                  >
                    {categoryArr[0]}
                  </span>
                  {categoryArr.map((data, index) => {
                    if (index !== 0) {
                      return (
                        <span
                          key={index}
                          onClick={() => {
                            setSelectClass(data);
                            setSelectAge("");
                            setFilterClass({});
                          }}
                          className={classnames({
                            "filter-category-active": selectClass === data,
                            "filter-category": selectClass !== data,
                          })}
                        >
                          {data}
                        </span>
                      );
                    }
                  })}
                </div>
                <div>
                  {!loadingCategory ? (
                    handleLoadCategory()
                  ) : (
                    <div className="d-flex justify-content-center my-4 w-100">
                      <span
                        onClick={() => {
                          setSelectAge(classCategory[0]);
                          hanlderSplitString(classCategory[0]);
                        }}
                        className={classnames("p-1 me-2", {
                          "age-filter-active": selectAge === "" || selectAge === classCategory[0],
                          "age-filter": selectAge !== "" && selectAge !== classCategory[0],
                        })}
                      >
                        {classCategory[0]}
                      </span>
                      {classCategory.map((data, index) => {
                        if (index !== 0) {
                          return (
                            <span
                              key={index}
                              onClick={() => {
                                setSelectAge(data);
                                hanlderSplitString(data);
                              }}
                              className={classnames("p-1 me-2", {
                                "age-filter-active": selectAge === data,
                                "age-filter": selectAge !== data,
                              })}
                            >
                              {data}
                            </span>
                          );
                        }
                      })}
                    </div>
                  )}
                </div>
                <div
                  className="d-flex justify-content-center py-2"
                  style={{ backgroundColor: "#F6F6F6" }}
                >
                  <span style={{ color: "#0D47A1", fontSize: "18px" }}>Kuota Pertandingan</span>
                </div>
                <div
                  className="d-flex mt-2 justify-content-between"
                  style={{ overflowX: "auto", gap: "5px" }}
                >
                  {computerData.map((data, index) => {
                    return (
                      <div
                        key={index}
                        className="px-3 py-2"
                        style={{
                          border: "1px solid #EEEEEE",
                          borderRadius: "5px",
                          textAlign: "center",
                        }}
                      >
                        <div className="py-2 text-category">
                          <span>{convertLabel(data.teamCategoryId)}</span>
                        </div>
                        <div
                          className="py-1 px-2"
                          style={{ backgroundColor: "#AEDDC2", borderRadius: "25px" }}
                        >
                          <span>Tersedia: {data.quota}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {width < 768 && (
              <Col md="4">
                <div className="event-countdown-box">
                  {eventData && (
                    <React.Fragment>
                      <div style={{ textAlign: "start" }}>
                        <h5>Biaya Pendaftaran</h5>
                        <Row className="py-3">
                          {arrayFee?.map((data, index) => {
                            return (
                              <Col
                                key={index}
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
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {feeType[index]}
                                </div>
                                <div className="mt-2 col-4 w-100">
                                  {data.isEarlyBird ? (
                                    <>
                                      <div style={{ textAlign: "center" }}>
                                        <CurrencyFormat
                                          style={{ textDecoration: "line-through" }}
                                          className="mx-2"
                                          displayType={"text"}
                                          value={data.price ? Number(data.price) : 0}
                                          prefix="Rp"
                                          thousandSeparator={"."}
                                          decimalSeparator={","}
                                          decimalScale={0}
                                          fixedDecimalScale
                                        />
                                        <CurrencyFormat
                                          displayType={"text"}
                                          value={data.earlyBird ? Number(data.earlyBird) : 0}
                                          prefix="Rp"
                                          thousandSeparator={"."}
                                          decimalSeparator={","}
                                          decimalScale={0}
                                          fixedDecimalScale
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <div>
                                      <CurrencyFormat
                                        displayType={"text"}
                                        value={data.price ? Number(data.price) : 0}
                                        prefix="Rp"
                                        thousandSeparator={"."}
                                        decimalSeparator={","}
                                        decimalScale={0}
                                        fixedDecimalScale
                                      />
                                    </div>
                                  )}
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                        <div className="pb-3">
                          {/* <span style={{ fontWeight: "600" }}>
                        Early Bird sampai Rabu, 25 Maret 2022
                      </span> */}
                          <span>
                            Segera daftarkan dirimu dan timmu pada kompetisi {eventNew?.eventName}
                          </span>
                        </div>
                      </div>
                      <Countdown date={registerEventEnd} renderer={HandlerCountDown} />
                    </React.Fragment>
                  )}
                  <div className="pb-2">
                    {eventData?.closedRegister ? (
                      <Button style={{ width: 120 }}>Tutup</Button>
                    ) : (
                      <ButtonBlue
                        as={Link}
                        to={`${
                          !isLoggedIn
                            ? `/archer/login?path=/event-registration/${slug}`
                            : `/event-registration/${slug}`
                        }`}
                        style={{ width: "100%", fontWeight: "600", fontSize: "16px" }}
                      >
                        Daftar Event
                      </ButtonBlue>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4">
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
                            Klik untuk unduh{">"}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </Col>
            )}
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
                    {dataFAQ.map((data) => {
                      if (!data?.isHide) {
                        return (
                          <div className="mb-2">
                            <span style={{ fontSize: "16px", fontWeight: "600", color: "#1C1C1C" }}>
                              {data?.question}
                            </span>
                            <br />
                            <span>{data?.answer}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            </div>
          </Col>

          {width > 768 && (
            <Col md="4">
              <div className="event-countdown-box">
                {eventData && (
                  <React.Fragment>
                    <div style={{ textAlign: "start" }}>
                      <h5>Biaya Pendaftaran</h5>
                      <Row className="py-3">
                        {arrayFee?.map((data, index) => {
                          return (
                            <Col
                              key={index}
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
                                  textTransform: "capitalize",
                                }}
                              >
                                {feeType[index]}
                              </div>
                              <div className="mt-2 col-4 w-100">
                                {data.isEarlyBird ? (
                                  <>
                                    <div style={{ textAlign: "center" }}>
                                      <CurrencyFormat
                                        style={{ textDecoration: "line-through" }}
                                        className="mx-2"
                                        displayType={"text"}
                                        value={data.price ? Number(data.price) : 0}
                                        prefix="Rp"
                                        thousandSeparator={"."}
                                        decimalSeparator={","}
                                        decimalScale={0}
                                        fixedDecimalScale
                                      />
                                      <CurrencyFormat
                                        displayType={"text"}
                                        value={data.earlyBird ? Number(data.earlyBird) : 0}
                                        prefix="Rp"
                                        thousandSeparator={"."}
                                        decimalSeparator={","}
                                        decimalScale={0}
                                        fixedDecimalScale
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <div>
                                    <CurrencyFormat
                                      displayType={"text"}
                                      value={data.price ? Number(data.price) : 0}
                                      prefix="Rp"
                                      thousandSeparator={"."}
                                      decimalSeparator={","}
                                      decimalScale={0}
                                      fixedDecimalScale
                                    />
                                  </div>
                                )}
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                      <div className="pb-3">
                        {/* <span style={{ fontWeight: "600" }}>
                        Early Bird sampai Rabu, 25 Maret 2022
                      </span> */}
                        <span>
                          Segera daftarkan dirimu dan timmu pada kompetisi {eventNew?.eventName}
                        </span>
                      </div>
                    </div>
                    <Countdown date={registerEventEnd} renderer={HandlerCountDown} />
                  </React.Fragment>
                )}
                <div className="pb-2">
                  {eventData?.closedRegister ? (
                    <Button style={{ width: 120 }}>Tutup</Button>
                  ) : (
                    <ButtonBlue
                      as={Link}
                      to={`${
                        !isLoggedIn
                          ? `/archer/login?path=/event-registration/${slug}`
                          : `/event-registration/${slug}`
                      }`}
                      style={{ width: "100%", fontWeight: "600", fontSize: "16px" }}
                    >
                      Daftar Event
                    </ButtonBlue>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4">
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
                  </>
                ) : null}
              </div>
            </Col>
          )}
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

  .text-category {
    color: #0d47a1;
    font-size: 16px;
    font-weight: 600;
  }

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

const DescriptionContent = styled.p`
  white-space: pre-wrap;
`;

// util
function formatEventDate(date) {
  let dateObject = typeof date === "string" ? parseISO(date) : date;
  return format(dateObject, "d MMMM yyyy", { locale: id });
}

export default LandingPage;
