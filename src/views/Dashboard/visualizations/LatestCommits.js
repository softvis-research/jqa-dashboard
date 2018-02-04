import React, { Component } from 'react';
import DashboardAbstract, { neo4jSession } from '../Abstract';

import ReactTable from 'react-table';
import "react-table/react-table.css";

class LatestCommits extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            latestCommits: [
                {
                    "author": "Dummy",
                    "date": '2018-01-01',
                    "message": 'Dummy'
                }
            ]
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.readLatestCommits();
    }

    readLatestCommits() {
        var aggregatedData = [];
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

        neo4jSession.run(
            'MATCH (a:Author)-[:COMMITTED]->(c:Commit) ' +
            'RETURN a.name, c.date, c.message ' +
            'ORDER BY c.date desc ' +
            'LIMIT 20'
        ).then(function (result) {
            result.records.forEach(function (record) {
                var recordConverted = {
                    "author": record.get(0),
                    "date": record.get(1),
                    "message": record.get(2)
                };

                aggregatedData.push(recordConverted);
            });
        }).then( function(context) {
            //console.log(aggregatedData);
            thisBackup.setState({latestCommits: aggregatedData}); //reverse reverses the order of the array (because the chart is flipped this is neccesary)
        }).catch(function (error) {
            console.log(error);
        });
    }

    render() {
        return (
            <div>
                <h2>latest 20 commits</h2>
                <div>
                    <ReactTable
                        data = {this.state.latestCommits}
                        columns = {[
                            {
                                Header: "Author",
                                accessor: "author"
                            },
                            {
                                Header: "Date",
                                accessor: "date"
                            },
                            {
                                Header: "Message",
                                accessor: "message"
                            }
                        ]}
                        defaultPageSize = {20}
                        className = "-striped -highlight"
                    />
                </div>
            </div>
        )
    }
}

export default LatestCommits;
