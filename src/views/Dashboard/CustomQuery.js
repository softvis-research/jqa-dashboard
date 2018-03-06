import React, { Component } from 'react';
import DashboardAbstract, { neo4jSession } from './Abstract';
var AppDispatcher = require('../../AppDispatcher');

import "semantic-ui-css/semantic.min.css";
import { Cypher } from "graph-app-kit/components/Cypher";
import { DriverProvider } from "graph-app-kit/components/DriverProvider";
import { Render } from "graph-app-kit/components/Render";
import { Chart } from "graph-app-kit/components/Chart";
import { CypherEditor } from "graph-app-kit/components/Editor";

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
                    Header: "Hint",
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
        return (
            <div>
                <h2>Type Cypher query here:</h2>
                <CypherEditor
                    value={this.state.query}
                    options={{
                        mode: "cypher",
                        theme: "cypher",
                        lineNumberFormatter: line => line
                    }}
                    onValueChange={this.updateStateQuery.bind(this)}
                />
                <button onClick={this.sendQuery.bind(this)}>Send</button>

                <ReactTable
                    data = {this.state.readData}
                    columns = {this.state.headerData}
                    defaultPageSize = {20}
                    className = "-striped -highlight"
                    minRows = {1}
                />

            </div>
        )
    }
}

export default CustomQuery;
