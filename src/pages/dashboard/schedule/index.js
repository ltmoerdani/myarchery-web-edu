/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useRef} from 'react'
import { MetaTags } from 'react-meta-tags'
import {
    Container,
    Button,
    Col,
    Row,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import TableSchedule from './components/TableSchedule'
import { DateInput } from "components"
import { ScheduleMemberService } from "services";
import { useParams } from "react-router";
import { LoadingScreen } from "components"

import { Preview, print } from "react-html2pdf"

function ListMember() {

    const { event_id } = useParams();
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false)
    const [member, setMember] = useState([])
    const [dateEnable, setDateEnable] = useState([]);
    const [list, setList] = useState([]);
    const [event, setEvent] = useState({});
    
    useEffect(() => {
        getSchedule()
      }, []);
    
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

    const pdfExportComponent = useRef(null);

    const handleExportWithComponent = event => {
        pdfExportComponent.current.save();
      };


    return (
        <React.Fragment>
            <LoadingScreen loading={loading} />
            <div className="page-content">
                <MetaTags>
                    <title>Dashboard | List - Member</title>
                </MetaTags>
                <Container fluid>
                    <Button onClick={() => print('a', 'jsx-template')}>EXPORT PDF</Button>
      <Preview id={'jsx-template'}>
          <div>
          <div className="row">
                    <div className="col-6">
                        <h1>PAGE 1</h1>
                    </div>
                    <div className="col-6">
                    <h1>PAGE 2</h1>
                    </div>
                </div>
          </div>
      </Preview>
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
                <TableSchedule member={member} getMemberSchedule={getMemberSchedule} event={event} date={date} list={list} />
                </Container>
            </div>
        </React.Fragment>
    )
}

export default ListMember
