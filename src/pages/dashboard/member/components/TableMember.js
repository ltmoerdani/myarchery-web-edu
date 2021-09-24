import React, { Component } from "react"
import { Row, Col, Card, CardBody, Modal, ModalBody, Button } from "reactstrap"

// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider from 'react-bootstrap-table2-toolkit';

// Data for dummy
import { dummyConstants } from '../../../../constants'

//Import Breadcrumb
import './sass/datatables.scss'

import Avatar from "../../../../assets/images/users/avatar-man.png"

class TableMember extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      sizePerPage: 10,
      productData: dummyConstants.members,
      modal: false,
      user: {},
    }

  }

  render() {
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
              this.setState({modal: true, user: row})}
            }>{row.name}</span>
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
            <span className={`${row.status ? "bg-success" : "bg-warning"} text-white rounded-3 px-2`}>{row.status ? "Completed" : "Pending"}</span>
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
      sizePerPage: 10,
      totalSize: dummyConstants.members.length, // replace later with size(customers),
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
        <Modal isOpen={this.state.modal} fade={false} toggle={toggle}>
        <ModalBody>
          <Row>
            <Col md={2}>
              <img
                  src={Avatar}
                  alt=""
                  className="avatar-md rounded-circle img-thumbnail"
                  style={{height: 'auto'}}
              />
            </Col>
            <Col md={4}>
              <h4>
                {this.state.user?.name}
              </h4>
              <span>{this.state.user?.club}</span>
              <div>
                <h3>No. Ponsel</h3>
                <span>{this.state?.user?.telepon}</span>
              </div>
              <div>
                <h3>Email</h3>
                <span>{this.state?.user?.email}</span>
              </div>
            </Col>
            <Col md={6}>
            <div>
                <h3>Usia</h3>
                <span>{this.state.user?.age}</span>
              </div>
            <div>
                <h3>Jadwal Kualifikasi:</h3>
                <p>Sesi 1 - 12 September 2021</p>
                <p>Sesi 2 - 13 September 2021</p>
                <p>Sesi 3 - 1 September 2021</p>
              </div>
            </Col>
          </Row>
          <div className="float-end">
            <Button color="secondary" onClick={toggle}>Ok</Button>
          </div>
        </ModalBody>
      </Modal>
          <div>
            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField='id'
                      columns={columns}
                      data={this.state.productData}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField='id'
                          columns={columns}
                          data={this.state.productData}
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

                              <Row className="align-items-md-center mt-30">
                                <Col className="inner-custom-pagination d-flex">
                                  <div className="d-inline">
                                    <SizePerPageDropdownStandalone
                                      {...paginationProps}
                                    />
                                  </div>
                                  <div className="text-md-right ms-auto">
                                    <PaginationListStandalone
                                      {...paginationProps}
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

export default TableMember
