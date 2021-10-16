import React, { Component } from "react"
import { Row, Col, Card, CardBody } from "reactstrap"
import { EventsService } from "services";
import ModalParticipantMemberProfile  from "../../../../components/Common/ModalParticipanMemberProfile";
// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider from 'react-bootstrap-table2-toolkit';

//Import Breadcrumb
import './sass/datatables.scss'


class TableEliminasi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      sizePerPage: 10,
      productData: this.props.members,
      modal: false,
      member_id_for_pop_up: 0,
      users: [],
      user: [],
    }

  }

  render() {
    const getMemberProfile = async(id) =>{
      let u = [];
      u = await this.state.users;
      if(u[id]) {
        this.setState({modal: true, user: this.state.users[id]});
        return;
      }

      const { data, errors, success, message } = await EventsService.getEventMemberProfile(
        {"member_id":id}
      );
    if (success) {
        if (data) {
          u[id] = data;
          this.setState({modal: true, user: data, users:u})
        }
    } else {
        console.log(message, errors);
    }
    }

    const toggle = () =>{
      this.setState({modal: !this.state.modal})
    } 
    
    const columns = [{
      dataField: 'id',
      text: 'Id',
      sort: true,
    }, {
      dataField: 'name',
      text: 'Name',
      sort: true,
      formatter: (cell, row) => {
        return(
          <>
            <span onClick={() => {
              getMemberProfile(row.id);
            }
            }><p style={{color:"blue"}}>{row.name}</p></span>
          </>
        )
      }
    }, {
      dataField: 'email',
      text: 'Email',
      sort: true
    }, {
      dataField: 'telepon',
      text: 'Telepon',
      sort: true
    }, {
      dataField: 'club',
      text: 'Club',
      sort: true
    }, {
      dataField: 'age',
      text: 'Usia',
    }, {
      dataField: 'gender',
      text: 'Gender',
    }, {
      dataField: 'status',
      text: 'Status',
      formatter: (cell, row) => {
        return (
          <div>
            <span className={`${row.status == 1 ? "bg-success" : row.status == 2 ? "bg-danger" : row.status == 4 ? "bg-info" : "bg-warning"} text-white rounded-3 px-2`}>{row.statusLabel ? row.statusLabel : "Pending"}</span>
          </div>
        )
      }
    }
];

    const defaultSorted = [{
      dataField: 'id',
      order: 'asc'
    }];

    const pageOptions = {
      sizePerPage: 500,
      totalSize: this.props.members.length, // replace later with size(customers),
      custom: true,
    }

    // Custom Pagination Toggle
    // const sizePerPageList = [
    //   { text: '5', value: 5 },
    //   { text: '10', value: 10 },
    //   { text: '15', value: 15 },
    //   { text: '20', value: 20 },
    //   { text: '25', value: 25 },
    //   { text: 'All', value: (this.state.productData).length }];

  
    // Select All Button operation
    const selectRow = {
      mode: 'checkbox'
    }

    // const { SearchBar } = Search;

    return (
      <React.Fragment>
        <div>
          <ModalParticipantMemberProfile isOpen={this.state.modal} toggle={toggle} participant={this.state.user} />
          <div>
            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField='id'
                      columns={columns}
                      data={this.props.members}
                    >
                      {({paginationTableProps }) => (
                        <ToolkitProvider
                          keyField='id'
                          columns={columns}
                          data={this.props.members}
                          search
                        >
                          {toolkitProps => (
                            <React.Fragment>

                              <Row className="mb-2">
                                <Col md="4">
                                  <div className="search-box me-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      {/* <SearchBar
                                        {...toolkitProps.searchProps}
                                      /> */}
                                      {/* <i className="bx bx-search-alt search-icon" /> */}
                                    </div>
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      keyField={"id"}
                                      responsive
                                      bordered={false}
                                      striped={false}
                                      defaultSorted={defaultSorted}
                                      selectRow={selectRow}
                                      classes={
                                        "table align-middle table-nowrap"
                                      }
                                      headerWrapperClasses={"thead-light"}
                                      {...toolkitProps.baseProps}
                                      {...paginationTableProps}
                                    />

                                  </div>
                                </Col>
                              </Row>
                            </React.Fragment>
                          )
                          }
                        </ToolkitProvider>
                      )
                      }</PaginationProvider>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default TableEliminasi
