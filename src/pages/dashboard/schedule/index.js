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
import jsPDF from "jspdf"
import pdfMake from "pdfmake/build/pdfmake"
import pdfFont from "pdfmake/build/vfs_fonts"
function ListMember() {

    const { event_id } = useParams();
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false)
    const [member, setMember] = useState([])
    const [dateEnable, setDateEnable] = useState([]);
    const [list, setList] = useState([]);
    const [event, setEvent] = useState({});

    pdfMake.vfs = pdfFont.pdfMake.vfs
    
    useEffect(() => {
        getSchedule()
      }, []);

      const generatePDF = () => {
          let dd = {
              pageOrientation: 'landscape',
              content: [
                  {text: "The Hub Scoring 2021", alignment: 'center', bold: true, fontSize: 24, margin: [0, 0, 0, 16]},
                  
                  {
                      columns: [
                          {text: "Order ID:\t11111\nName:\t\tPutra\nJarak:\t\t50m\nDevisi:\t\tBarebow\nNo Target:\t2\t(A)\t(B)\nTanggal:\t28/8", bold: true, margin: [0, 0, 0, 16]},
                          {text: "Order ID:\t11111\nName:\t\tPutra\nJarak:\t\t50m\nDevisi:\t\tBarebow\nNo Target:\t2\t(A)\t(B)\nTanggal:\t28/8", bold: true, margin: [0, 0, 0, 16]},

                      ]
                  },
                  {
                    columns: [
                        {
                            
                            alignment: 'center',
                            table: {
                                heights: [20, 20, 20, 20, 20, 20, 20, 20],
                                widths: [50, 0, 30, 30, 30, 30, 30, 30],
                                body: 
                                [
                                    ['Seri', '', '', 'SCORE', '','','T2S',''],
                                    ['1', '', '', '', '', '', '', '    '],
                                    ['', '', '', '', '', '', '', '    '],
                                    ['2', '', '', '', '', '', '', '    '],
                                    ['', '', '', '', '', '', '', '    '],
                                    ['3', '', '', '', '', '', '', '    '],
                                    ['', '', '', '', '', '', '', '    '],
                                    ['4', '', '', '', '', '', '', '    '],
                                    ['', '', '', '', '', '', '', '    '],
                                    ['5', '', '', '', '', '', '', '    '],
                                    ['', '', '', '', '', '', '', '    '],
                                    ['6', '', '', '', '', '', '', '    '],
                                    ['', '', '', '', '', '', '', '    '],
                                    [{text: "", colSpan: 5}, {}, {}, {}, {}, '', '', '    '],
                                ]
                            }
                        },
                        {
                            alignment: 'center',
                            table: {
                                heights: [20, 20, 20, 20, 20, 20, 20, 20],
                                widths: [50, 0, 30, 30, 30, 30, 30, 30],
                                body: 
                                [
                                    ['Seri', '', '', 'SCORE', '','','T2S',''],
                                    ['1', '', '', '', '', '', '', '    '],
                                    ['', '', '', '', '', '', '', '    '],
                                    ['2', '', '', '', '', '', '', '    '],
                                    ['', '', '', '', '', '', '', '    '],
                                    ['3', '', '', '', '', '', '', '    '],
                                    ['', '', '', '', '', '', '', '    '],
                                    ['4', '', '', '', '', '', '', '    '],
                                    ['', '', '', '', '', '', '', '    '],
                                    ['5', '', '', '', '', '', '', '    '],
                                    ['', '', '', '', '', '', '', '    '],
                                    ['6', '', '', '', '', '', '', '    '],
                                    ['', '', '', '', '', '', '', '    '],
                                    [{text: "", colSpan: 5}, {}, {}, {}, {}, '', '', '    '],
                                ]
                            }
                            
                        },

                    ]
                },
                {
                    columns: [
                        {qr: 'text in qr', fit: 50, margin: [0, 4, 0, 0]},
                        {qr: 'text in qr', fit: 50, margin: [0, 4, 0, 0]},
                    ]
                },
                  
              ]
          }
          pdfMake.createPdf(dd).download();
    
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
                <Link to="/dashboard/events">
                    <Button color="outline-dark">{'<-'}</Button>
                </Link>
                <span style={{marginLeft: '0.5rem'}}>Kembali ke List Event</span>
                <div className="mb-3 d-flex justify-content-around w-50 mt-md-0 mt-3 mx-auto">
                    <h3 style={{letterSpacing: '2px'}}>Jadwal Kualifikasi</h3>
                </div>
                <div className="mb-4">
                    <div className="d-flex justify-content-between">
                    <h6>Pilih Jadwal</h6>
                    <Button color="primary" onClick={generatePDF}>EXPORT PDF</Button>
                    </div>
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
