import React, {useState, useEffect} from "react"
import MetaTags from 'react-meta-tags';
import Footer from "layouts/landingpage/Footer";
import HeaderForm from "layouts/landingpage/HeaderForm";
import { Container, Row, Col,  Card, CardBody, Button} from "reactstrap";
import styled from 'styled-components';
import TableSchedule from "./components/TableSchedule";
import CardInfo from "./components/CardInfo";
import { ScheduleMemberService } from "services";
import { useParams } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { LoadingScreen } from "components"


const Label = styled.label`
  font-size: 12px;
  line-height: 15px;
  font-weight: 400;
  color: #495057;
  display: ruby;
  font-style: italic;
`;

const ScheduleMarathon = () => {
    const [list, setList] = useState([]);
    const [mySchedule, setMySchedule] = useState([]);
    const [participant, setParticipant] = useState({});
    const [event, setEvent] = useState({});
    const [payload, setPayload] = useState({});
    const { member_id } = useParams();
    const [confirm, setConfirm] = useState(false);
    const [error, setError] = useState("");
    const [errorSet, setErrorSet] = useState("");
    const [date, setDate] = useState("");
    const [dateEnable, setDateEnable] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getSchedule()
      }, []);
    
    const getSchedule = async() =>{
        setLoading(true)
        const { data, errors, message, success } = await ScheduleMemberService.get({
            "participant_member_id":member_id,
        });
        if (success) {
          if (data) {
                let de = [];
                data.schedules.map((s)=>{
                    de.push(s.date);
                })
                setList(data.schedules)
                setDateEnable(de)
                setMySchedule(data.mySchedule)
                setParticipant(data.participant)
                if(date == "")
                    setDate(data.schedules[0].date)
                setEvent(data.event)
                setLoading(false)
          }
        } else {
            console.error(message, errors);
        }
    } 

    const setSchedule = async (schedule) => {
        setErrorSet("");
        setLoading(true)
        const { success, message } = await ScheduleMemberService.set(schedule);
        if (success) {
            getSchedule()
        }else{
            setErrorSet("*"+message);
        }
        setLoading(false)

      };
    
    const unsetSchedule = async (schedule) => {
        setError("");
        setLoading(true)
        const { message, success } = await ScheduleMemberService.unset(schedule);
        if (success) {
            getSchedule()
        }else{
            setError(message);
        }
        setLoading(false)
      };
  return (
    <React.Fragment>
      <MetaTags>
        <title>Marathon | MyAchery</title>
      </MetaTags>
      {/* import navbar */}
      <HeaderForm />
 
        <Container fluid className="px-5 p-2">
            <LoadingScreen loading={loading} />
                <CardInfo info={participant}/>
                <Card>
                    <CardBody>
                        <Label>Kualifikasi dapat dilakukan sesuai dengan jadwal yang ditentukan peserta, Anda dapat memilih maksimal 3 sesi pengambilan nilai kualifikasi.</Label>
            <Row>
                            <div className="d-md-flex mt-3">
                                    <Col md={8} sm={12}>
                                        <TableSchedule dateEnable={dateEnable} setDate={setDate} date={date} eventDetail={event} errorMessage={errorSet} setSchedule={setSchedule} list={list} member_id={member_id} myschedule={mySchedule}/>
                                    </Col>

                                    <Col md={4} sm={12}>

                                        <Card style={{backgroundColor: "#FAFAFA"}}>
                                            <CardBody>
                                                
                                                        <label>Kategori Lomba terdaftar</label>
                                                        <p>{participant.categoryLabel}</p>
                                                    
                                            </CardBody>
                                        </Card>
                                        <Card style={{backgroundColor: "#FAFAFA"}}>
                                            <CardBody>
                                                        <div>
                                                            <label>Jadwal Anda</label>
                                                        </div>

                                                        <div>
                                                          {mySchedule.length < 1 ? <div><br /><p style={{textAlign:"center"}}>belum ada jadwal yang dipilih</p></div> : mySchedule.map((s,k) => (
                                                            <tr key={k}>
                                                                <td>*</td>
                                                                <td>
                                                                    <p>{s.dayLabel} {s.dateLabel} - Sesi {k+1} ({s.session.startTime}-{s.session.endTime})</p>
                                                                </td>
                                                                <td>
                                                                {confirm ? (
                                                                    <SweetAlert
                                                                        title="Apakah anda yakin?"
                                                                        warning
                                                                        showCancel
                                                                        confirmButtonText="Ya"
                                                                        cancelBtnText="Tidak"
                                                                        confirmBtnBsStyle="success"
                                                                        cancelBtnBsStyle="danger"
                                                                        onConfirm={() => {
                                                                        setConfirm(false);
                                                                        unsetSchedule(payload);
                                                                        }}
                                                                        onCancel={() => setConfirm(false)}
                                                                        ></SweetAlert>
                                                                    ) : null}
                                                                    <Button
                                                                        className="btn-danger btn btn-secondary"
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setConfirm(true);setPayload({
                                                                                "schedule_id": s.myScheduleId
                                                                            })
                                                                          }}
                                                                        >
                                                                        batalkan
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                          ))}
                                                          <p style={{color:"red"}}>{error}</p>
                                                        </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </div>
            </Row>
                    </CardBody>
                </Card>
        </Container>

      <Footer />

    </React.Fragment>
  )
}

export default ScheduleMarathon
