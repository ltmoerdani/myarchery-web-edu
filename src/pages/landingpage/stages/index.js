import React, {useEffect, useState} from 'react'
import { Bracket, Seed, SeedItem, SeedTeam } from 'react-brackets'
import { Container, Card, CardBody, Button } from 'reactstrap'
import MetaTags from "react-meta-tags";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import logomyarchery from "../../../assets/images/myachery/myachery.png"
import { getAuthenticationStore } from "store/slice/authentication";
import ProfileMenuArcher from "components/TopbarDropdown/ProfileMenuArcher";
import { Elimination, EventsService } from "services"
import { useParams } from "react-router-dom";

// const rounds = [
//     {
//       title: 'Round one',
//       seeds: [
//         {
//           id: 1,
//           date: new Date().toDateString(),
//           teams: [{ name: 'Team A', lose: 2 }, { name: 'Team B', lose: 1 }],
//         },
//         {
//           id: 2,
//           date: new Date().toDateString(),
//           teams: [{ name: 'Team C', lose: 1 }, { name: 'Team D', lose : 2 }],
//         },
//         {
//           id: 3,
//           date: new Date().toDateString(),
//           teams: [{ name: 'Team E', lose: 0 }, { name: 'Team F', lose: 0 }],
//         },
//         {
//           id: 4,
//           date: new Date().toDateString(),
//           teams: [{ name: 'Team G', lose: 0 }, { name: 'Team H', lose: 0 }],
//         },
//       ],
//     },
//     {
//       title: 'Round two',
//       seeds: [
//         {
//           id: 5,
//           date: new Date().toDateString(),
//           teams: [{ name: 'Team A' }, { name: 'Team D' }],
//         },
//         {
//           id: 6,
//           date: new Date().toDateString(),
//           teams: [{ name: 'Team E' }, { name: 'Team H' }],
//         },
//       ],
//     },
//     {
//         title: 'Round Three',
//         seeds: [
//             {
//                 id: 6,
//                 date: new Date().toDateString(),
//                 teams: [{ name: 'Team A', lose: 2}, { name: 'Team H', lose: 1}],
//             },
//         ],
//     },
//   ];
  
  const CustomSeed = ({seed, breakpoint}) => {
    // breakpoint passed to Bracket component
    // to check if mobile view is triggered or not
  
    // mobileBreakpoint is required to be passed down to a seed
    return (
      <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
        <SeedItem>
          <div>
            { seed.teams[0].lose && seed.teams[1].lose ?
            (
              <div>
                <SeedTeam style={{ color: `${seed.teams[0].lose == 1 ? "#757575" : "white"}`, background: `${seed.teams[0].lose == 1 ? "#E2E2E2" : "#BC8B2C"}` }}>{seed.teams[0]?.name || 'NO TEAM '}</SeedTeam>
                <SeedTeam style={{ color: `${seed.teams[1].lose == 2 ? "white" : "#757575"}`, background: `${seed.teams[1].lose == 2 ? "#BC8B2C" : "#E2E2E2"}`}}>{seed.teams[1]?.name || 'NO TEAM '}</SeedTeam>
              </div>
            ):(
              <div>
              <SeedTeam>{seed.teams[0]?.name || 'NO TEAM '}</SeedTeam>
              <SeedTeam>{seed.teams[1]?.name || 'NO TEAM '}</SeedTeam>
              </div>
            )
            }
          </div>
        </SeedItem>
      </Seed>
    );
  };

function Stages() {
  const [eventDetail, setEventDetail] = useState({});
  const [elimination, setElimination] = useState({});
  const { slug } = useParams();


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

    const getElimination = async (event_id) => {
      const {message, errors, data } = await Elimination.getEventElimination({"event_id":event_id})
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
      getEvent(eventDetail.id);
      getElimination();
    }, [eventDetail])
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
                        <h3>Match Play</h3>
                    </div>
                    <Bracket rounds={elimination.rounds ? elimination.rounds : []} renderSeedComponent={CustomSeed} />
                </CardBody>
            </Card>
        </Container>
        </React.Fragment>
    )
}

export default Stages
