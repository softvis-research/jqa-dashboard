import React, { Component } from 'react';
import DashboardAbstract, { neo4jSession } from '../AbstractDashboardComponent';
var AppDispatcher = require('../../../AppDispatcher');

import "semantic-ui-css/semantic.min.css";
import { Cypher } from "graph-app-kit/components/Cypher";
import { DriverProvider } from "graph-app-kit/components/DriverProvider";
import { Render } from "graph-app-kit/components/Render";
import { Chart } from "graph-app-kit/components/Chart";
import { CypherEditor } from "graph-app-kit/components/Editor";

import {Button, Badge, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input} from 'reactstrap';

import ReactTable from 'react-table';

class CustomQuery extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            readData: [{
                "aplaceholder": "Please tye a query and click \"Send\"",
            }],
            headerData: [
                {
                    Header: "Result",
                    accessor: "aplaceholder"
                }
            ],
            query: 'MATCH (a:Author)-[:COMMITTED]->(c:Commit) RETURN a.name, c.message ORDER BY c.date desc LIMIT 20'
        };
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

        //TODO: this function does in fact clear the query but the codeMirror does not show it. the reason is currently unknown
        //document.getElementById("cypheredit").value = '';
        var element = document.querySelector('.ReactCodeMirror textarea');
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            element.dispatchEvent(evt);
        } else {
            element.fireEvent("onchange");
        }

        this.setState({
            query: '',
            readData: [{
                "aplaceholder": "Please type a query and click \"Send\"",
            }],
            headerData: [
                {
                    Header: "Result",
                    accessor: "aplaceholder"
                }
            ],
        });
    }

    sendQuery(event) {
        var aggregatedData = [];
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

        var isFirst = true;

        neo4jSession.run(
            thisBackup.state.query
        ).then(function (result) {
            result.records.forEach(function (record) {
                var tmpHeader = [];
                var recordConverted = {};
                record.keys.forEach(function (key) {
                    var index = record._fieldLookup[key];
                    var value = record.get(index);
                    var isObject = false;

                    if (typeof value === 'object') {
                        value = JSON.stringify(value, null, 2);
                        isObject = true;
                    } else {
                        if (value.low) { //.low if datatype is numeric
                            value = vlue.low;
                        }
                    }

                    //set keys
                    if (isFirst && typeof key !== 'undefined' && typeof key !== 'object') {
                        var dataToSet = {
                            Header: key,
                            accessor: key.replace('.', '')
                        };
                        if (isObject) {
                            dataToSet['style'] = {
                                whiteSpace: 'pre'
                            }
                        }
                        tmpHeader.push(dataToSet);
                    }

                    recordConverted[key.replace('.', '')] = value;
                });

                if (isFirst) { //make fieldlist accessable
                    thisBackup.state.headerData = tmpHeader;
                }    
                isFirst = false;

                aggregatedData.push(recordConverted);
            });
        }).then( function(context) {
            //console.log(aggregatedData);
            thisBackup.setState({readData: aggregatedData}); //reverse reverses the order of the array (because the chart is flipped this is neccesary)
        }).catch(function (error) {
            console.log(error);
        });
    }

    updateStateQuery(event) {
        this.state.query = event;
    }

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
          return(redirect);
        }

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" md="12">
                        <Card>
                            <CardHeader>
                                Custom Cypher query
                            </CardHeader>
                            <CardBody>
                                <CypherEditor
                                    className="cypheredit"
                                    value={this.state.query}
                                    options={{
                                        mode: "cypher",
                                        theme: "cypher",
                                        lineNumberFormatter: line => line
                                    }}
                                    onValueChange={this.updateStateQuery.bind(this)}
                                />
                                <Button onClick={this.sendQuery.bind(this)} className="btn btn-success send-query float-right" color="success">Send</Button>
                                <Button onClick={this.clear.bind(this)} className="btn btn-success send-query float-right margin-right" color="danger">Reset</Button>

                                <ReactTable
                                    data = {this.state.readData}
                                    columns = {this.state.headerData}
                                    defaultPageSize = {20}
                                    className = "-striped -highlight clear"
                                    minRows = {1}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default CustomQuery;
