import React from "react";
import DashboardAbstract, { neo4jSession } from "../AbstractDashboardComponent";

//import { Cypher } from "graph-app-kit/components/Cypher";
//import { DriverProvider } from "graph-app-kit/components/DriverProvider";
//import { Render } from "graph-app-kit/components/Render";
//import { Chart } from "graph-app-kit/components/Chart";
import { CypherEditor } from "graph-app-kit/components/Editor";

import {
    Button,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Popover,
    PopoverBody,
    PopoverHeader
} from "reactstrap";

import ReactTable from "react-table";

class CustomQuery extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            popoverOpen: false,
            popovers: [
                {
                    placement: "bottom",
                    text: "Bottom"
                }
            ]
        };

        this.state = {
            readData: [
                {
                    aplaceholder: 'Please type a query and click "Send"'
                }
            ],
            headerData: [
                {
                    Header: "Result",
                    accessor: "aplaceholder"
                }
            ],
            query:
                "MATCH (a:Author)-[:COMMITTED]->(c:Commit) RETURN a.name, c.message ORDER BY c.date desc LIMIT 20"
        };

        this.toggleInfo = this.toggleInfo.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
    }

    componentDidMount() {
        super.componentDidMount();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    clear(event) {
        this.setState({
            query: "",
            readData: [
                {
                    aplaceholder: 'Please type a query and click "Send"'
                }
            ],
            headerData: [
                {
                    Header: "Result",
                    accessor: "aplaceholder"
                }
            ]
        });
    }

    sendQuery(event) {
        var aggregatedData = [];
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

        var isFirst = true;

        neo4jSession
            .run(thisBackup.state.query)
            .then(function(result) {
                result.records.forEach(function(record) {
                    var tmpHeader = [];
                    var recordConverted = {};
                    record.keys.forEach(function(key) {
                        var index = record._fieldLookup[key];
                        var value = record.get(index);
                        var isObject = false;

                        if (typeof value === "object") {
                            value = JSON.stringify(value, null, 2);
                            isObject = true;
                        } else {
                            if (value.low) {
                                //.low if datatype is numeric
                                value = value.low;
                            }
                        }

                        //set keys
                        if (
                            isFirst &&
                            typeof key !== "undefined" &&
                            typeof key !== "object"
                        ) {
                            var dataToSet = {
                                Header: key,
                                accessor: key.replace(".", "")
                            };
                            if (isObject) {
                                dataToSet["style"] = {
                                    whiteSpace: "pre"
                                };
                            }
                            tmpHeader.push(dataToSet);
                        }

                        recordConverted[key.replace(".", "")] = value;
                    });

                    if (isFirst) {
                        //make fieldlist accessable
                        thisBackup.state.headerData = tmpHeader;
                    }
                    isFirst = false;

                    aggregatedData.push(recordConverted);
                });
            })
            .then(function(context) {
                //console.log(aggregatedData);
                thisBackup.setState({ readData: aggregatedData }); //reverse reverses the order of the array (because the chart is flipped this is neccesary)
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    updateStateQuery(event) {
        this.state.query = event;
    }

    toggleInfo() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
            return redirect;
        }

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" md="12">
                        <Card>
                            <CardHeader>
                                Custom Cypher query
                                <div className="card-actions">
                                    <button
                                        onClick={this.toggleInfo}
                                        id="Popover"
                                    >
                                        <i className="text-muted fa fa-question-circle" />
                                    </button>
                                    <Popover
                                        placement="bottom"
                                        isOpen={this.state.popoverOpen}
                                        target="Popover"
                                        toggle={this.toggleInfo}
                                    >
                                        <PopoverHeader>
                                            Custom Cypher query
                                        </PopoverHeader>
                                        <PopoverBody>
                                            The Cypher editor allows custom
                                            queries to the Neo4j database and
                                            returns tabular results.
                                        </PopoverBody>
                                    </Popover>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <CypherEditor
                                    className="cypheredit"
                                    value={this.state.query}
                                    options={{
                                        mode: "cypher",
                                        theme: "cypher"
                                    }}
                                    onValueChange={this.updateStateQuery.bind(
                                        this
                                    )}
                                />
                                <Button
                                    onClick={this.sendQuery.bind(this)}
                                    className="btn btn-success send-query float-right"
                                    color="success"
                                    id="send"
                                >
                                    Send
                                </Button>
                                <Button
                                    onClick={this.clear.bind(this)}
                                    className="btn btn-success send-query float-right margin-right"
                                    color="danger"
                                    id="reset"
                                >
                                    Reset
                                </Button>

                                <ReactTable
                                    data={this.state.readData}
                                    columns={this.state.headerData}
                                    defaultPageSize={20}
                                    className="-striped -highlight clear"
                                    minRows={1}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default CustomQuery;
