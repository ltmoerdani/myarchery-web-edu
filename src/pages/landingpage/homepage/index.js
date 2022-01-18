import * as React from "react";
import styled from "styled-components";
import { useWizardView } from "../../../hooks/wizard-view";
import { eventCategories } from "../../../constants";
import { CategoryService } from "services";
import { useParams } from "react-router-dom";

// import CurrencyFormat from "react-currency-format";
import { Container, Row, Col } from "reactstrap";
import { Button, ButtonOutline, WizardView, WizardViewContent } from "components/ma";

import classnames from "classnames";
// import format from "date-fns/format";
// import id from "date-fns/locale/id";
// import imgLandingPageDetailEvent from "assets/images/myachery/img-landing-page-event-detail.png"

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

  categoriesData?.forEach((competition) => {
    // console.log(competition)
    // competition?.categoryDetails?.forEach((detail) => {
      // detail?.distance?.forEach((distanceItem, index) => {
        const newCategory = {
          ...competition,
          key: `${competition?.categoryDetailsId}`,
          competitionCategory: competition.competitionCategoryId?.label,
          ageCategory: competition?.ageCategoryId?.label,
          distance: competition?.distanceId.label,
          teamCategory: competition?.teamCategoryId?.label,
        };

        if (
          competition?.teamCategoryId?.id === TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE ||
          competition?.teamCategoryId?.id === TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE ||
          competition?.teamCategoryId?.id === TEAM_CATEGORIES.TEAM_INDIVIDUAL
        ) {
          categoriesByTeam[TEAM_CATEGORIES.TEAM_INDIVIDUAL].push(newCategory);
        } else if (competition?.teamCategoryId?.id === TEAM_CATEGORIES.TEAM_MALE) {
          categoriesByTeam[TEAM_CATEGORIES.TEAM_MALE].push(newCategory);
        } else if (competition?.teamCategoryId?.id === TEAM_CATEGORIES.TEAM_FEMALE) {
          categoriesByTeam[TEAM_CATEGORIES.TEAM_FEMALE].push(newCategory);
        } else if (competition?.teamCategoryId?.id === TEAM_CATEGORIES.TEAM_MIXED) {
          categoriesByTeam[TEAM_CATEGORIES.TEAM_MIXED].push(newCategory);
        }
      // });
    // });
  });

  return categoriesByTeam;
}

function LandingPage() {
  const {slug} = useParams();
  const { steps, currentStep, goToStep } = useWizardView(categoryTabsList);
  const [eventData, setEventData] = React.useState({})
  // const [time, setTime] = React.useState({})
  // const [expired, setExpired] = React.useState(false)

  const categoriesByTeam = React.useMemo(
    () => computeCategoriesByTeam(eventData?.eventCategories),
    []
  );

  console.log(categoriesByTeam)

  const getDataEventDetail = async () => {
    const {message, errors, data} = await CategoryService.getDetailEvent({slug})
    if (data) {
      setEventData(data)
      console.log(message)
      console.log(errors)
    }
    console.log(message)
    console.log(errors)
  }

  React.useEffect(() => {
    getDataEventDetail();
  }, [])

  // const wordHtml = () => {
  // return (
  //   <>
  //   <p><span style={{whiteSpace: 'pre-wrap'}}>Peraturan pertandingan pada The HuB Scoring menggunakan peraturan Internasional World Archery.<br /><br />&nbsp; &nbsp; Babak kualifikasi<br />&nbsp; &nbsp; Babak Kualifikasi dilaksanakan pada hari selasa &ndash; jum&rsquo;at dimulai tanggal 28 September hingga 29 Oktober 2021<br />&nbsp; &nbsp; &nbsp; &nbsp; Selasa &ndash; kamis,<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; kloter 1. Jam 08.00 &ndash; 10.00<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; kloter 2. Jam 10.00 &ndash; 12.00<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; kloter 3. Jam 13.00 &ndash; 15.00<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; kloter 4. Jam 15.00 &ndash; 17.00<br />&nbsp; &nbsp; &nbsp; &nbsp; Jumat,<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; kloter 1. Jam 08.00 &ndash; 10.00<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; kloter 2. Jam 13.00 &ndash; 15.00<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; kloter 3. Jam 15.00 &ndash; 17.00<br />&nbsp; &nbsp; &nbsp; &nbsp; Sabtu,<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; kloter 1. Jam 08.00 &ndash; 10.00<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; kloter 2. Jam 10.00 &ndash; 12.00<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; kloter 3. Jam 13.00 &ndash; 15.00<br />&nbsp; &nbsp; &nbsp; &nbsp; Ahad,<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; kloter 1. Jam 08.00 &ndash; 10.00<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; kloter 2. Jam 10.00 &ndash; 12.00<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; kloter 3. Jam 13.00 &ndash; 15.00<br />&nbsp; &nbsp; Babak eliminasi<br />&nbsp; &nbsp; Peserta individu yang lolos ke babak eliminasi adalah 16 besar/ Babak eliminasi 1/8 untuk divisi Recurve/Nasional U-16, Compound U-16 dan Barebow Umum.</span></p>
  //   </>
  // )
  // }

  // const categories =[
  //   {
  //     ageCategory: "Umum",
  //     competitionCategory: "Barebow",
  //     distance: "50m",
  //     quota: 100
  //   },
  //   {
  //     ageCategory: "Umum",
  //     competitionCategory: "Barebow",
  //     distance: "50m",
  //     quota: 100
  //   },
  //   {
  //     ageCategory: "Umum",
  //     competitionCategory: "Barebow",
  //     distance: "50m",
  //     quota: 100
  //   },
  //   {
  //     ageCategory: "Umum",
  //     competitionCategory: "Barebow",
  //     distance: "50m",
  //     quota: 100
  //   },
  //   {
  //     ageCategory: "Umum",
  //     competitionCategory: "Barebow",
  //     distance: "50m",
  //     quota: 100
  //   },
  //   {
  //     ageCategory: "Umum",
  //     competitionCategory: "Barebow",
  //     distance: "50m",
  //     quota: 100
  //   },
  // ]

  // var countDownDate = new Date("Jan 20, 2022 15:37:25").getTime();
  // var x = setInterval(function() {

  //   var payload = {...time}

  //   var now = new Date().getTime();

  //   var distance = countDownDate - now;
      
  //   var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  //   payload['days'] = days
  //   var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //   payload['hours'] = hours
  //   var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //   payload['minutes'] = minutes
  //   var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  //   payload['seconds'] = seconds

  //   setTime(payload)
      
  //   if (distance < 0) {
  //     setExpired(true)
  //     clearInterval(x);
  //   }
  // }, 1000);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const dateEventStart = new Date(eventData?.publicInformation?.eventStart)
  const dateEventEnd = new Date(eventData?.publicInformation?.eventEnd)

  const handlerEvenDate = (date) => {
    const dateEvent = `${date?.getDate()} ${months[date?.getMonth()]} ${date?.getFullYear()}`
    return dateEvent
  }

  return (
    <PageWrapper>
      <Container fluid>
        <div className="event-banner">
          <img className="event-banner-image" src={eventData?.publicInformation?.eventBanner} />
        </div>

        <Row className="mt-3">
          <Col md="8">
            <h1 className="event-heading">{eventData?.publicInformation?.eventName}</h1>
            <div>Oleh Pro Archery Club</div>

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
                    <td>
                      {`${handlerEvenDate(dateEventStart)} ${handlerEvenDate(dateEventEnd)}`}
                    </td>
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
              {
                eventData?.moreInformation?.map((information) => {
                  return(
                    <div key={information.id}>
                    <h5 className="content-info-heading">{information?.title}</h5>
                      <div>
                        <p>{information?.description}</p>
                      </div>
                    </div>
                  )
                })
              }

              <h5 className="content-info-heading">Biaya Registrasi</h5>
              <div>
              <p>
                Early Bird:<br />
                <span>Tanggal Registrasi 01 Januari 2022 - 31 Januari 2022</span><br />
                <span>Mulai dari Rp50.000</span>
              </p>
              <p>
                Normal:<br />
                <span>Tanggal Registrasi 01 Februari 2022 - 07 Februari 2022</span><br />
                <span>Mulai dari Rp99.000</span>
              </p>
              </div>
            </div>
          </Col>

          <Col md="4">
            <div className="event-notice-find">
              Temukan lebih banyak event panahan di{" "}
              <a className="event-preview-link">myarchery.id</a>
            </div>

            <div className="event-countdown-box">
              <h5>Waktu tersisa</h5>

              {/* {!expired ? ( */}
                <div className="countdown-timer">
                <div className="countdown-item">
                  {/* {time?.days} */}
                  <span className="timer-unit">Hari</span>
                </div>
                <div className="countdown-item">
                  {/* {time?.hours} */}
                  <span className="timer-unit">Jam</span>
                </div>
                <div className="countdown-item">
                  {/* {time?.minutes} */}
                  <span className="timer-unit">Menit</span>
                </div>
                <div className="countdown-item">
                  {/* {time?.seconds} */}
                  <span className="timer-unit">Detik</span>
                </div>
              </div>
              {/* ): "Expired" */}
              {/* } */}

              <Button style={{ width: "100%",backgroundColor: '#0D47A1', color: '#FFF' }} disabled>
                Daftar
              </Button>
            </div>

            <div className="mt-4">
              <ButtonOutline disabled className="button-preview-outline button-leaderboard">
                Leaderboard &amp; Hasil
              </ButtonOutline>
            </div>
          </Col>
        </Row>

        <div className="mt-4">
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

          {/* TODO: Dicommet dulu nanti bergunua ketika sudah bisa integrate API */}
          <WizardView currentStep={currentStep}>
            <WizardViewContent>
              <EventCategoryGrid categories={categoriesByTeam[TEAM_CATEGORIES.TEAM_INDIVIDUAL]} />
            </WizardViewContent>
            <WizardViewContent>
              <EventCategoryGrid categories={categoriesByTeam[TEAM_CATEGORIES.TEAM_MALE]} />
            </WizardViewContent>
            <WizardViewContent>
              <EventCategoryGrid categories={categoriesByTeam[TEAM_CATEGORIES.TEAM_FEMALE]} />
            </WizardViewContent>
            <WizardViewContent>
              <EventCategoryGrid categories={categoriesByTeam[TEAM_CATEGORIES.TEAM_MIXED]} />
            </WizardViewContent>
          </WizardView>
        </div>
      </Container>
    </PageWrapper>
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


function EventCategoryGrid({ categories  }) {
  return (
    <div className="event-category-grid">
      {categories.map((category, index) => (
        <div key={index} className="event-category-card">
          <h5 className="heading-category-name">
            {category.ageCategory} - {category.competitionCategory} - {category.distance}
          </h5>
          <div className="mt-4 body-category-detail">
            <div>
              <span className="category-quota-label">0&#47;{category.quota}</span>
            </div>
            <div>
              <ButtonOutline
                disabled
                corner="8"
                style={{ width: 120 }}
              >
                Daftar
              </ButtonOutline>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const PageWrapper = styled.div`
  margin: 40px 0;
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
      background-color: #0D47A1;
      border: solid 1px var(--ma-gray-200) !important;
      color: #FFF;
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
      border: solid 1px #0D47A1;
      background-color: transparent;
      color: #0D47A1;

      &.team-active {
        background-color: #0D47A1;
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