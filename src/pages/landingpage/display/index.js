import React, { useState, useEffect } from 'react'
import MetaTags from "react-meta-tags";
import { SelectInput } from '../../../components'
import {
  Container,
  Row,
  Col,
//   Card,
//   CardBody,
//   CardHeader,
  Button
} from "reactstrap";
import { Link } from "react-router-dom"
import ProfileMenuArcher from "components/TopbarDropdown/ProfileMenuArcher";
import logomyarchery from "../../../assets/images/myachery/myachery.png"
import { useSelector } from "react-redux";
import { getAuthenticationStore } from "store/slice/authentication";
import Footer from "layouts/landingpage/Footer";
import "./components/sass/displayscore.scss"
import TableScore from './components/TableScore';
import { EventsService } from "services";
import { useParams } from "react-router-dom";

function DisplayScore() {
    const path = window.location.pathname;
    const { slug } = useParams();
    const [memberScoringMale, setMemberScoringMale] = useState([]);
    const [memberScoringFemale, setMemberScoringFemale] = useState([]);
    const [eventDetail, setEventDetail] = useState({});
    const [category, setCategory] = useState({});
    const [gender, setGender] = useState(null);
    useEffect(() => {
          if(eventDetail.id == undefined){
            getEvent()
          }

          filterScoringGender();
          const interval = setInterval(
            () => filterScoringGender(),
            5000
          );

          return () => {
            clearInterval(interval);
          };

      }, [category,gender]);

      const getEvent = async () =>{
          const { data, errors, success, message } = await EventsService.getEventBySlug(
              {slug}
          );
          if (success) {
              if (data) {
                  setEventDetail(data);
                  let cat = {...data.flatCategories[0],
                    id: `${data.flatCategories[0].teamCategoryId}.${data.flatCategories[0].ageCategoryId}.${data.flatCategories[0].competitionCategoryId}.${data.flatCategories[0].distanceId}`,
                    "label":data.flatCategories[0].archeryEventCategoryLabel}
                  setCategory(cat);
              }
          } else {
              console.log(message, errors);
          }
      }

      const getScoring = async (event_id,category,gender = null) => {
        const { data, errors, success, message } = await EventsService.getEventMemberScoring(
          {
            "event_id":event_id,
            "type":1,
            "gender":gender,
            ...category
          }
        );
        if (success) {
            if (data) {
              let m =[];
              data.map((d,i)=>{
                m.push({"id": d.member.id,
                  "pos": i+1,
                  "athlete": d.member.name,
                  "club": d.member.club,
                  "session_one": d.sessions[1].total,
                  "session_two": d.sessions[2].total,
                  "total": d.total,
                  "10+x": d.totalXPlusTen,
                  "x":d.totalX
                })}
              )
                if (gender == "male") {
                  setMemberScoringMale(m);                  
                }
                if (gender == "female") {
                  setMemberScoringFemale(m);                  
                }
              }
        } else {
            console.log(message, errors);
        }
      }

      const filterScoringGender = async () => {
        if (gender == null) {
          await getScoring(eventDetail.id,category,"male")        
          await getScoring(eventDetail.id,category,"female")        
        }else{
          await getScoring(eventDetail.id,category,gender)
        }
      }
    let { isLoggedIn } = useSelector(getAuthenticationStore);
    return (
        <React.Fragment>
            <MetaTags>
            <title>{eventDetail.eventName}</title>
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
            {/* Detail header about live scoring */}
            <div>
                <div className="d-flex justify-content-between">
                    <div className="d-flex">
                        <span className="header-detail pt-1 pe-2"></span>
                        <span>
                        Live Score
                        </span>
                        <span className="ms-2">
                            Babak Kualifikasi
                        </span>
                        <span className="ms-2">
                            {/* <span>Last Update: 23 September 2021 | 13.00 WIB</span> */}
                        </span>
                    </div>
                        <div>
                            {/* <span className="float-end">Lihat Jadwal Lengkap<a className="text-success ms-1">ke myachery.id/TheHuB</a></span> */}
                        </div>
                    </div>
            </div>
            <div className="text-center">
                <h1 className="text-primary py-4">{eventDetail.eventName}</h1>
            </div>
            <div className="mb-4">
                <Row>
                <Col md={4} sm={12}>
                                {/* <div className="d-block d-md-flex justify-content-between"> */}
                                    <SelectInput
                                        name='jenis'
                                        onChange={(v) => {setCategory(v.value)}}
                                        options={
                                            eventDetail?.flatCategories?.map((option) => {
                                              return {
                                                ...option,
                                                id: `${option.teamCategoryId}.${option.ageCategoryId}.${option.competitionCategoryId}.${option.distanceId}`,
                                                label: option.archeryEventCategoryLabel,
                                              };
                                            }) || []
                                          }
                                          value={category.label != undefined ? category:null}
                                        />
                  </Col>
                  <Col md={4} sm={12}>
                      <div className="d-block d-md-flex mt-md-0 mt-3">
                        <Button onClick={()=>setGender(null)} color={gender == null ? "dark" : "outline-dark"}>Semua</Button>
                        <Button onClick={()=>setGender("male")} color={gender == "male" ? "dark" : "outline-dark"}>Laki Laki</Button>
                        <Button onClick={()=>setGender("female")} color={gender == "female" ? "dark" : "outline-dark"}>Perempuan</Button>
                      </div>
                  </Col>
                </Row>
                <hr />
                </div>
                {gender == "male" || gender == null ? 
                  <TableScore title={{style:{color:"blue"},label:"Laki-laki"}} member={memberScoringMale} />
                :null}
                {gender == "female" || gender == null ? 
                  <TableScore title={{style:{color:"#e12c4b"},label:"Perempuan"}} member={memberScoringFemale} />
                :null}
        </Container>
        <Footer />
        </React.Fragment>
    )
}

export default DisplayScore
