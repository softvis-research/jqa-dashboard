import React, { Component } from 'react';

import DashboardAbstract, {databaseCredentialsProvided, neo4jSession} from './AbstractDashboardComponent';

import {Badge, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText} from 'reactstrap';

class Dashboard extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            resourceManagementMetrics: {
                "authors": "loading",
                "commitsWithoutMerges": "loading",
                "commitsWithMerges": "loading"
            }
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (databaseCredentialsProvided) {
            this.readResourceManagementMetrics();
        }
    }

    readResourceManagementMetrics() {
        var resourceManagementMetrics = [];
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

        neo4jSession.run(
            // activity metrics (table)
            // number of authors
            'OPTIONAL MATCH (a:Author) ' +
            'WITH count(a) as authors ' +
            // number of commits (without merges)
            'OPTIONAL MATCH (c:Commit)-[:CONTAINS_CHANGE]->()-[:MODIFIES]->(f:File) ' +
            'WHERE NOT c:Merge ' +
            'WITH authors, count(c) as commitsWithoutMerges ' +
            // number of commits (including merges)
            'OPTIONAL MATCH (c:Commit)-[:CONTAINS_CHANGE]->()-[:MODIFIES]->(f:File) ' +
            'RETURN authors, commitsWithoutMerges, count(c) as commitsWithMerges'
        ).then(function (result) {
            result.records.forEach(function (record) {

                resourceManagementMetrics = {
                    "authors": record.get(0).low,
                    "commitsWithoutMerges": record.get(1).low,
                    "commitsWithMerges": record.get(2).low
                };

                console.log(resourceManagementMetrics);
            });
        }).then( function(context) {
            thisBackup.setState({resourceManagementMetrics: resourceManagementMetrics});
        }).catch(function (error) {
            console.log(error);
        });
    }

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
            return(redirect);
        }

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="6" md="3">
                        <Card>
                            <CardHeader>
                                Architecture
                            </CardHeader>
                            <CardBody>
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                                laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                                ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" md="3">
                        <Card>
                            <CardHeader>
                                Resource Management
                            </CardHeader>
                            <CardBody>
                                <ListGroup>
                                    {Object.keys(this.state.resourceManagementMetrics).map(function(key) {
                                        return <ListGroupItem key={key} className="justify-content-between">{key} <div className="float-right">{this.state.resourceManagementMetrics[key]}</div></ListGroupItem>;
                                    }, this)}
                                </ListGroup>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" md="3">
                        <Card>
                            <CardHeader>
                                Risk Management
                            </CardHeader>
                            <CardBody>
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                                laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                                ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" md="3">
                        <Card>
                            <CardHeader>
                                Quality Management
                            </CardHeader>
                            <CardBody>
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                                laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                                ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Dashboard;
