import React, {useEffect, useState} from 'react'
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime } from 'react-brackets'
import { Container, Card, CardBody, Button, Row, Col } from 'reactstrap'
import MetaTags from "react-meta-tags";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import logomyarchery from "../../../assets/images/myachery/myachery.png"
import { getAuthenticationStore } from "store/slice/authentication";
import ProfileMenuArcher from "components/TopbarDropdown/ProfileMenuArcher";
import { Elimination, EventsService } from "services"
import { useParams } from "react-router-dom";
import { SelectInput } from "components"
  
const CustomSeed = ({seed, breakpoint}) => {
  // breakpoint passed to Bracket component
  // to check if mobile view is triggered or not

  // mobileBreakpoint is required to be passed down to a seed
  return (
    <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
      <SeedItem>
        <div>
            {
                seed.teams.map((team) => {
                  return(
                      team.win != undefined ? 
                      team.win == 1 ? 
                      <SeedTeam style={{ borderBottom: "2px solid black", color: "white", background: "#BC8B2C" }}>{team?.name || "<not have participant>"}</SeedTeam> 
                      :
                      <SeedTeam style={{ borderBottom: "2px solid black", color: "#757575", background: "#E2E2E2"}}>{team?.name || "<not have participant>"}</SeedTeam>
                      :   
                      <SeedTeam style={{ borderBottom: "2px solid white"}}>{team?.name || '<not have participant>'}</SeedTeam>
                  )
                })
            }
        </div>
      </SeedItem>
      <SeedTime>{seed.date}</SeedTime>
    </Seed>
  );
};

function Stages() {
  const [eventDetail, setEventDetail] = useState({});
  const [elimination, setElimination] = useState({});
  const { slug } = useParams();
  const [category, setCategory] = useState(0)
  const genderOptions = [
    { id: "male", label: "Laki-laki" }, 
    { id: "female", label: "Perempuan" }, 
  ]
  const [gender, setGender] = useState(genderOptions[0]);

  const getEvent = async () =>{
    const { data, errors, success, message } = await EventsService.getEventBySlug(
        {slug}
    );
    if (success) {
        if (data) {
            setCategory(data.categories[0]);
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
      if(eventDetail.id == undefined)
        getEvent();
      getElimination();
    }, [gender, category])
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

export default Stages
