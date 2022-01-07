import React, { useState, useEffect, useRef } from 'react'
import MetaTags from "react-meta-tags";
import { SelectInput } from '../../../components'
import {
  Container,
  Row,
  Col,
  Button
} from "reactstrap";
import "./components/sass/displayscore.scss"
import TableScore from './components/TableScore';
import { EventsService } from "services";
import { useParams } from "react-router-dom";

function DisplayScore() {
    const { slug } = useParams();
    const [memberScoringMale, setMemberScoringMale] = useState([]);
    const [memberScoringFemale, setMemberScoringFemale] = useState([]);
    const [eventDetail, setEventDetail] = useState({});
    const [category, setCategory] = useState({});
    const [gender, setGender] = useState(null);
    const memberScoringOld = useRef({male:[],female:[],animationDuration:"flashing"})
    const memberScoring = useRef({male:[],female:[]})
    useEffect(() => {
          if(eventDetail.id == undefined){
            getEvent()
          }

          filterScoringGender();
          const interval = setInterval(
            () => {filterScoringGender()},
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
                    id: `${data?.flatCategories[0]?.teamCategoryId}.${data?.flatCategories[0]?.ageCategoryId}.${data?.flatCategories[0]?.competitionCategoryId}.${data?.flatCategories[0]?.distanceId}`,
                    "label":data?.flatCategories[0]?.archeryEventCategoryLabel}
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
                let condition = "";
                let pos = i+1;
                let oldPos = i+1;
                if(gender == "male" && memberScoringOld.current.male[d.member.id] != undefined){
                  oldPos = memberScoringOld.current.male[d.member.id].pos; 
                }
                if(gender == "female" && memberScoringOld.current.female[d.member.id] != undefined){
                  oldPos = memberScoringOld.current.female[d.member.id].pos; 
                }
                if(oldPos < pos){
                  condition = <label style={{color:"red"}} className="dripicons-arrow-thin-down"></label>;
                }
                if(oldPos > pos){
                  condition = <label style={{color:"green"}} className="dripicons-arrow-thin-up"></label>;
                }
                m[d.member.id] = {"id": d.member.id,
                  "pos": pos,
                  "pos_condition":condition,
                  "athlete": d.member.name,
                  "club": d.member.club,
                  "session_one": d.sessions[1].total,
                  "session_two": d.sessions[2].total,
                  "total": d.total,//i==4 ? new Date().getUTCMilliseconds() : d.total,
                  "10+x": d.totalXPlusTen,
                  "x":d.totalX
                }}
              )
                if (gender == "male") {
                  memberScoringOld.current.male = memberScoring.current.male;                
                  memberScoringOld.current.animationDuration = memberScoringOld.current.animationDuration == "flashing" ? "flashing-2": "flashing";                
                  memberScoring.current.male = m;
                  setMemberScoringMale(m);                  
                }
                if (gender == "female") {
                  memberScoringOld.current.female = memberScoring.current.female;                
                  memberScoring.current.female = m;
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
    return (
        <React.Fragment>
            <MetaTags>
            <title>{eventDetail.eventName}</title>
            </MetaTags>
        <Container>
            {/* Detail header about live scoring */}
            <div>
                <div className="d-flex justify-content-between pt-4">
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
                  <TableScore title={{style:{color:"blue"},label:"Laki-laki"}} member={memberScoringMale} animationDuration={memberScoringOld.current.animationDuration} memberOld={memberScoringOld.current.male} />
                :null}
                {gender == "female" || gender == null ? 
                  <TableScore title={{style:{color:"#e12c4b"},label:"Perempuan"}} member={memberScoringFemale} animationDuration={memberScoringOld.current.animationDuration} memberOld={memberScoringOld.current.female} />
                :null}
        </Container>
        </React.Fragment>
    )
}

export default DisplayScore
