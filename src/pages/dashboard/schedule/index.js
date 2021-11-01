import React, {useState, useEffect} from 'react'
import { MetaTags } from 'react-meta-tags'
import {
    Container,
    Button,
    Col,
    Row,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import TableSchedule from './components/TableSchedule'
import { DateInput, BoxSetScoring } from "components"
import { ScheduleMemberService } from "services";
import { useParams } from "react-router-dom";
import { LoadingScreen } from "components"

function ListMember() {
    const scoreSeries = [
        {"color":"white","background":"#8c8cbb none repeat scroll 0% 0%","seri":1},
        {"color":"white","background":"#0c8cbb none repeat scroll 0% 0%","seri":2},
        {"color":"white","background":"#47733e none repeat scroll 0% 0%","seri":3},
        {"color":"white","background":"rgb(187, 140, 162) none repeat scroll 0% 0%","seri":4},
        {"color":"white","background":"rgb(160, 78, 206) none repeat scroll 0% 0%","seri":5},
        {"color":"white","background":"rgb(206, 150, 78) none repeat scroll 0% 0%","seri":6},
    ];
    const shot_per_seri = [1,2,3,4,5,6];
    const score = [
      {"label":"m","value":"m"},
      {"label":"1","value":"1"},
      {"label":"2","value":"2"},
      {"label":"3","value":"3"},
      {"label":"4","value":"4"},
      {"label":"5","value":"5"},
      {"label":"6","value":"6"},
      {"label":"7","value":"7"},
      {"label":"8","value":"8"},
      {"label":"9","value":"9"},
      {"label":"10","value":"10"},
      {"label":"x","value":"x"}
    ];

    const { event_id } = useParams();
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false)
    const [member, setMember] = useState([])
    const [dateEnable, setDateEnable] = useState([]);
    const [list, setList] = useState([]);
    const [totalPerSeri, setTotalPerSeri] = useState({});
    const [event, setEvent] = useState({});
    const [memberScore, setMemberScore] = useState({});
    
    useEffect(() => {
        getSchedule()
      }, []);
    
    const showScorebox = (memberDetail)=>{
        let ms = [];
        let ts = [];
        scoreSeries.map((ss)=>{
            let scorePerSesi = [];
            shot_per_seri.map((sps)=>{
                scorePerSesi[sps] = score[0]
            })
            ts[ss.seri] = 0;
            ms[ss.seri] = scorePerSesi;
        })
        setTotalPerSeri(ts);
        setMemberScore({no_target:"",participant:memberDetail,scors:ms});
    }

    const getSchedule = async() =>{
        setLoading(true)
        const { data, errors, message, success } = await ScheduleMemberService.getEventSchedule({
            "event_id":event_id,
        });
        if (success) {
          if (data) {
                let de = [];
                data.schedules.map((s)=>{
                    de.push(s.date);
                })
                setList(data.schedules)
                setDateEnable(de)
                if(date == "")
                    setDate(data.schedules[0].date)
                setEvent(data.event)
          }
        } else {
            console.error(message, errors);
        }
        setLoading(false)
    }
    
    const getMemberSchedule = async(date_schedule, session_id) =>{
        setLoading(true)
        const { data, errors, message, success } = await ScheduleMemberService.getEventMemberSchedule({
            "date":date_schedule,
            "session_id":session_id,
            "event_id":event_id,
        });
        if (success) {
          if (data) {
                let m = member;
                m[date_schedule+"-"+session_id] = data; 
                setMember(m);
          }
        } else {
            console.error(message, errors);
        }
        setLoading(false)
    }

    return (
        <React.Fragment>
            <LoadingScreen loading={loading} />
            <div className="page-content">
                <MetaTags>
                    <title>Dashboard | Schedule</title>
                </MetaTags>
                <Container fluid>
                <Link to="/dashboard/events">
                    <Button color="outline-dark">{'<-'}</Button>
                </Link>
                <span style={{marginLeft: '0.5rem'}}>Kembali ke List Event</span>
                <div className="mb-3 d-flex justify-content-around w-50 mt-md-0 mt-3 mx-auto">
                    <h3 style={{letterSpacing: '2px'}}>Jadwal Kualifikasi</h3>
                </div>
                <div className="mb-4">
                    <h6>Pilih Jadwal</h6>
                    <div>
                        <Row>
                        <Col md={3} sm={12}>
                            <DateInput
                                onChange={(e)=>{setDate(e.value)}}
                                value={date}
                                options={{enable:dateEnable,maxDate : dateEnable[dateEnable.length - 1], minDate: dateEnable[0]}}
                            />
                        </Col>
                        </Row>
                    </div>
                </div>
                <div className="mb-4">
                    <hr />
                </div>
                {Object.keys(memberScore).length == 0 ?
                    <TableSchedule member={member} getMemberSchedule={getMemberSchedule} showScorebox={showScorebox} event={event} date={date} list={list} />
                    :
                    <BoxSetScoring setTotalPerSeri={setTotalPerSeri} totalPerSeri={totalPerSeri} memberScore={memberScore} shot_per_seri={shot_per_seri} score={score} setMemberScore={setMemberScore} scoreSeries={scoreSeries}/>
                }
                </Container>
            </div>
        </React.Fragment>
    )
}

export default ListMember
