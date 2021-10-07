import React, {useEffect} from "react"

import { Row,
  Col, 
  Card, 
  CardBody, 
  Table} from "reactstrap";

const TableSchedule = ({event,date, errorMessage,list, member,showScorebox, getMemberSchedule}) => {
  useEffect(() => {
    console.log("event",event);
    console.log("list",list);
    console.log("date",date);
  }, []);

return (
      <React.Fragment>
        <Row>
                <Col sm={12}>
                <p style={{color:"red"}}>{errorMessage}</p>
                    <Card style={{maxHeight:"500px",overflow:"auto"}}>
                        <CardBody>
                                {list.length > 0 ? list.map((i) => (
                                    i.date == date ?
                                    <div style={{marginBottom:"20px",borderRadius:"10px"}} key={i.id}>
                                    <CardBody>
                                        <Row>
                                            <Col md={3} sm={12}>
                                                <div className="w-75 mx-auto">
                                                    <span>
                                                        <h5>{i.dayLabel}<br></br>{i.dateLabel}</h5>
                                                    </span>
                                                </div>
                                            </Col>
                                            <Col md={9} sm={12}>
                                                <div>
                                                <Table borderless={true} style={{borderCollapse: "collapse"}} responsive="true">
                                                  <tr>
                                                    <td align="center" style={{paddingRight:"10px",paddingLeft:"10px"}}><h6>sesi</h6></td>
                                                    <td align="center" style={{paddingRight:"10px",paddingLeft:"10px"}}><h6>waktu</h6></td>
                                                    <td align="center" style={{paddingRight:"10px",paddingLeft:"10px"}}><h6>quota</h6></td>
                                                    <td align="center" style={{paddingRight:"10px",paddingLeft:"10px"}}><h6>peserta</h6></td>
                                                  </tr>
                                                  {i.session.map((s,k) => (
                                                    <tr style={{borderBottom: "1px solid black"}} key={s.id}>
                                                      <td align="center">{k+1}</td>
                                                      <td align="center">{s.startTime+" - "+s.endTime}</td>
                                                      <td align="center">{s.totalBooking+"/"+s.quota}</td>
                                                      <td>
                                                        {s.totalBooking > 0 ?
                                                          member[i.date+"-"+s.id] ?
                                                          member[i.date+"-"+s.id].map((m,i)=>(
                                                            <div key={i.date+"-"+s.id}>
                                                                <p>{i+1}. {m.member.name} ({m.categoryLabel}) 
                                                                  {m.isScoring == 0 ?
                                                                  <button onClick={()=>{showScorebox(m)}}>set score</button>
                                                                    : null  
                                                                }
                                                                </p>
                                                            </div>
                                                          )) : 
                                                          <p style={{textAlign:"center"}}>
                                                            <button onClick={()=>{getMemberSchedule(i.date, s.id)}}>lihat list</button>
                                                          </p>
                                                          :null}
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </Table>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                    </div> : <></>
                                    )):null}
                        </CardBody>
                    </Card>
                </Col>
               
            </Row>
      </React.Fragment>
     );
    };
    
    export default TableSchedule;
