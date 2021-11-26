import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime } from "react-brackets";
import { Container, Card, CardBody, Button, Row, Col } from "reactstrap";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logomyarchery from "assets/images/myachery/myachery.png";
import { getAuthenticationStore } from "store/slice/authentication";
import {
  getEliminationStagesStore,
  selectCategory,
  selectGender,
} from "store/slice/eliminationStages";
import ProfileMenuArcher from "components/TopbarDropdown/ProfileMenuArcher";
import { Elimination, EventsService } from "services";
import { useParams } from "react-router-dom";
import { SelectInput } from "components";

const CustomSeed = ({ seed, breakpoint }) => {
  // breakpoint passed to Bracket component
  // to check if mobile view is triggered or not

  // mobileBreakpoint is required to be passed down to a seed
  return (
    <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
      <SeedItem style={{ padding: 2, backgroundColor: "var(--bs-gray-800)" }}>
        {seed.teams.map((team, index) => {
          return team.win != undefined ? (
            team.win == 1 ? (
              <SeedTeamStyled index={index} color="white" bgColor="#BC8B2C">
                <SeedNameLabel>
                  {team?.name || <React.Fragment>&lt;not have participant&gt;</React.Fragment>}
                </SeedNameLabel>

                <SeedScoreLabel bgColor="white" color="black">
                  {team?.score || 0}
                </SeedScoreLabel>
              </SeedTeamStyled>
            ) : (
              <SeedTeamStyled index={index} color="#757575" bgColor="#E2E2E2">
                <SeedNameLabel>
                  {team?.name || <React.Fragment>&lt;not have participant&gt;</React.Fragment>}
                </SeedNameLabel>

                <SeedScoreLabel bgColor="white" color="black">
                  {team?.score || 0}
                </SeedScoreLabel>
              </SeedTeamStyled>
            )
          ) : (
            <SeedTeamStyled index={index} color="var(--bs-gray-600)">
              <SeedNameLabel style={{ width: "100%", textAlign: "center" }}>
                {team?.name || <React.Fragment>&lt;not have participant&gt;</React.Fragment>}
              </SeedNameLabel>
            </SeedTeamStyled>
          );
        })}
      </SeedItem>

      <SeedTime>{seed.date}</SeedTime>
    </Seed>
  );
};

const genderOptions = [
  { id: "male", label: "Laki-laki" },
  { id: "female", label: "Perempuan" },
]

function Stages() {
  const [eventDetail, setEventDetail] = useState({});
  const [elimination, setElimination] = useState({});
  const { slug } = useParams();

  const dispatch = useDispatch()
  const { category, gender } = useSelector(getEliminationStagesStore)
  const setCategory = (payload) => dispatch(selectCategory(payload))
  const setGender = (payload) => dispatch(selectGender(payload))

  const getEvent = async () =>{
    const { data, errors, success, message } = await EventsService.getEventBySlug(
        {slug}
    );
    if (success) {
      if (data) {
        setEventDetail(data);
      }
    } else {
        console.log(message, errors);
    }
}

    const getElimination = async () => {
      const {message, errors, data } = await Elimination.getEventElimination({
        "event_id":eventDetail.id,
        "match_type" : "1",
        "gender" : gender.id,
        "event_category_id" : category.id,
        "elimination_member_count" : "16"
      })

      if (!errors) {
        if (data) {
          console.log(data)
          setElimination(data)
          console.log(message)
        }
      } else {
        console.log(errors)
        console.log(message)
      }
    }

    useEffect(() => {
      if (eventDetail.id == undefined) {
        getEvent();
      }
      getElimination();
    }, [eventDetail.id, gender, category]);

    console.log(elimination)
    const path = window.location.pathname;
    let { isLoggedIn } = useSelector(getAuthenticationStore);
    return (
        <React.Fragment>
            <MetaTags>
            <title>MyArchery | Stages</title>
            </MetaTags>
            <div className="px-4 py-1 sticky-top bg-light d-flex justify-content-between">
          {/* <Row>
            <Col md={6}> */}
              <Link to="/archer/dashboard">
              <div>
                <img src={logomyarchery} width="91" />
              </div>
              </Link>
            {/* </Col>
            <Col md={6}> */}
              { isLoggedIn ? (
                <div>
                  <ProfileMenuArcher color="black" />
                </div>
              ) : (
                  <div>
                    <Link style={{padding:"20px"}} to={"/archer/login?path="+path}>
                    <Button className="float-end" color="outline-dark">Masuk</Button>
                </Link>
                    <Link>
                        <Button className="me-2" color='primary'>Daftar</Button>
                    </Link>
                </div>
                )
              }
            {/* </Col>
          </Row> */}
        </div>
        <Container>
            <Card>
                <CardBody>
                    <div className="text-center">
                        <h3>Match Play {'"'+eventDetail.eventName+'"'}</h3>
                    </div>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <Row>
                      <Col md={6}>
                        <div>
                          <SelectInput label ={"kategori"} options={eventDetail.categories} value={category} placeholder="select" onChange={(e)=>{setCategory(e.value)}} />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div>
                          <SelectInput label ={"jenis kelamin"} options={genderOptions} value={gender} placeholder="select" onChange={(e)=>{setGender(e.value)}} />
                        </div>
                      </Col>
                    </Row>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <Bracket rounds={elimination.rounds ? elimination.rounds : []} renderSeedComponent={CustomSeed} />
                </CardBody>
            </Card>
        </Container>
        </React.Fragment>
    )
}

const SeedTeamStyled = styled(SeedTeam)`
  overflow: hidden;
  align-items: stretch;
  padding: 0;
  ${({ index }) => index === 0 ? "margin-bottom: 2px;" : ""}
  color: ${({ color }) => color ? color : "inherit"};
  background-color: ${({ bgColor }) => bgColor ? bgColor : "none"};
`;

const SeedNameLabel = styled.div`
  overflow: hidden;
  padding: 0.3rem 0.5rem;
  text-align: left;
`;

const SeedScoreLabel = styled.div`
  min-width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.3rem 0.5rem;
  background-color: white;
  color: var(--bs-gray);
  font-weight: bold;
`;

export default Stages
