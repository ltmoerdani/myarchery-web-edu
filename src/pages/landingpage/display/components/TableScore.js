import React, { Component } from "react";
import { Row, Col } from "reactstrap";

// datatable related plugins
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider from "react-bootstrap-table2-toolkit";

//Import Breadcrumb
import "./sass/datatables.scss";
class TableScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      sizePerPage: this.props.member.length,
      productData: this.props.member,
    };
    this.tableScrol = React.createRef();
  }

  render() {
    const columns = [
      {
        dataField: "pos_condition",
        text: "",
        sort: false,
        style: {width:"1px"},
      },
      {
        dataField: "pos",
        text: "Pos",
        sort: true,
      },
      {
        dataField: "athlete",
        text: "Athlete",
        sort: false,
      },
      {
        dataField: "club",
        text: "Club",
        sort: false,
      },
      {
        dataField: "session_one",
        text: "Sesi-1",
        sort: false,
      },
      {
        dataField: "session_two",
        text: "Sesi-2",
        sort: false,
      },
      {
        dataField: "total",
        text: "Tot",
        sort: false,
      },
      {
        dataField: "10+x",
        text: "10+X",
        sort: false,
      },
      {
        dataField: "x",
        text: "X",
        sort: false,
      },
    ];

    const defaultSorted = [
      {
        dataField: "pos",
        order: "asc",
      },
    ];

    const pageOptions = {
      sizePerPage: this.props.member.length,
      totalSize: this.props.member.length, // replace later with size(customers),
      custom: true,
    };

    return (
      <React.Fragment>
        <div className="col-12">
          <h5 style={this.props.title.style}>{this.props.title.label}</h5>
          <PaginationProvider
            pagination={paginationFactory(pageOptions)}
            keyField="id"
            columns={columns}
            data={this.props.member}
          >
            {({ paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                columns={columns}
                data={this.props.member}
                search
              >
                {(toolkitProps) => (
                  <React.Fragment>
                    <Row>
                      <Col>
                        <div ref={this.tableScrol} className="table-responsive" style={{overflowY: 'auto', height: '200px'}}>
                          <BootstrapTable
                            keyField={"id"}
                            responsive
                            bordered={false}
                            rowStyle={(row, rowIndex) => {
                              // console.log("masuk", this.props.memberOld)
                              let style = {};
                              if(rowIndex == 0)
                                style = {background:"rgb(217, 156, 14) none repeat scroll 0% 0%", color:"white"};
                              if(rowIndex == 1)
                                style = {background:"rgb(198, 213, 207) none repeat scroll 0% 0%",color:"black"};
                              if(rowIndex == 2)
                                style = {background:"rgb(142, 102, 72) none repeat scroll 0% 0%",color:"white"};
                              if(rowIndex > 2 && rowIndex <= 10)
                                style = {background:"rgba(238, 236, 242, 0.44) none repeat scroll 0% 0%",color:"black"};
                            
                              if(this.props.memberOld[row.id] != undefined && ((this.props.memberOld[row.id].pos == row.pos && this.props.memberOld[row.id].total != row.total) || this.props.memberOld[row.id].pos != row.pos)){
                                console.log("masuk")
                                style = {...style,animationDuration: "2s",animationName: this.props.animationDuration}
                                return style;
                              }

                              return style;
                            }}
                            striped={false}
                            defaultSorted={defaultSorted}
                            classes={"table align-middle table-nowrap"}
                            headerWrapperClasses={"thead-light"}
                            {...toolkitProps.baseProps}
                            {...paginationTableProps}
                          />
                        </div>
                      </Col>
                    </Row>
                  </React.Fragment>
                )}
              </ToolkitProvider>
            )}
          </PaginationProvider>
        </div>
      </React.Fragment>
    );
  }
}

export default TableScore;
