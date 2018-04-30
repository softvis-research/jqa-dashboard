import React, { Component } from 'react';

import DashboardAbstract, {databaseCredentialsProvided, neo4jSession} from './AbstractDashboardComponent';

import {Badge, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText} from 'reactstrap';

class Dashboard extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            architectureMetrics: {
                "classes": "loading",
                "interfaces": "loading",
                "enums": "loading",
                "annotations": "loading",
                "methods": "loading",
                "loc": "loading",
                "fields": "loading"
            },
            relationMetrics: {
                "dependencies": "loading",
                "extends": "loading",
                "implements": "loading",
                "invocations": "loading",
                "reads": "loading",
                "writes": "loading"
            },
            resourceManagementMetrics: {
                "authors": "loading",
                "commitsWithoutMerges": "loading",
                "commitsWithMerges": "loading"
            },
            qualityManagementMetrics: {
                "violations": "loading"
            }
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (databaseCredentialsProvided) {
            this.readArchitectureMetrics();
            this.readRelationMetrics();
            this.readResourceManagementMetrics();
            this.readQualityManagementMetrics();
        }
    }

    readArchitectureMetrics() {
        var architectureMetrics = [];
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

        neo4jSession.run(
            // architecture metrics (table 1)
            // number of classes
            'OPTIONAL MATCH (t:Type:Class)-[:HAS_SOURCE]->(:File) ' +
            'WITH count(t) as classes ' +
            // number of interfaces
            'OPTIONAL MATCH (t:Type:Interface)-[:HAS_SOURCE]->(:File) ' +
            'WITH classes, count(t) as interfaces ' +
            // number of enums
            'OPTIONAL MATCH (t:Type:Enum)-[:HAS_SOURCE]->(:File) ' +
            'WITH classes, interfaces, count(t) as enums ' +
            // number of annotations
            'OPTIONAL MATCH (t:Type:Enum)-[:HAS_SOURCE]->(:File) ' +
            'WITH  classes, interfaces, enums, count(t) as annotations ' +
            // number of methods and lines of code
            'OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[:DECLARES]->(m:Method) ' +
            'WITH classes, interfaces, enums, annotations, count(m) as methods, sum(m.effectiveLineCount) as loc ' +
            // number of fields
            'OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[:DECLARES]->(f:Field) ' +
            'RETURN classes, interfaces, enums, annotations, methods, loc, count(f) as fields'
        ).then(function (result) {
            result.records.forEach(function (record) {

                architectureMetrics = {
                    "classes": record.get(0).low,
                    "interfaces": record.get(1).low,
                    "enums": record.get(2).low,
                    "annotations": record.get(3).low,
                    "methods": record.get(4).low,
                    "loc": record.get(5).low,
                    "fields": record.get(6).low
                };

                console.log(architectureMetrics);
            });
        }).then( function(context) {
            thisBackup.setState({architectureMetrics: architectureMetrics});
        }).catch(function (error) {
            console.log(error);
        });
    }

    readRelationMetrics() {
        var relationMetrics = [];
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

        neo4jSession.run(
            // relation metrics (table 2)
            // dependencies
            'OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[d:DEPENDS_ON]->(:Type) ' +
            'WITH count(d) as dependencies ' +
            // extends
            'OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[e:EXTENDS]->(superType:Type) ' +
            'WHERE superType.name <> "Object" ' +
            'WITH dependencies, count(e) as extends ' +
            // implements
            'OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[i:IMPLEMENTS]->(:Type) ' +
            'WITH dependencies, extends, count(i) as implements ' +
            // calls
            'OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[:DECLARES]->(m:Method)-[i:INVOKES]->(:Method) ' +
            'WITH dependencies, extends, implements, count(i) as invocations ' +
            // reads
            'OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[:DECLARES]->(m:Method)-[r:READS]->(:Field) ' +
            'WITH dependencies, extends, implements, invocations, count(r) as reads ' +
            // writes
            'OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[:DECLARES]->(m:Method)-[w:WRITES]->(:Field) ' +
            'RETURN dependencies, extends, implements, invocations, reads, count(w) as writes'
        ).then(function (result) {
            result.records.forEach(function (record) {

                relationMetrics = {
                    "dependencies": record.get(0).low,
                    "extends": record.get(1).low,
                    "implements": record.get(2).low,
                    "invocations": record.get(3).low,
                    "reads": record.get(4).low,
                    "writes": record.get(5).low
                };

                console.log(relationMetrics);
            });
        }).then( function(context) {
            thisBackup.setState({relationMetrics: relationMetrics});
        }).catch(function (error) {
            console.log(error);
        });
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

    readQualityManagementMetrics() {
        var qualityManagementMetrics = [];
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

        neo4jSession.run(
            // number of violations
            'MATCH (:Report)-[:HAS_FILES]->(file:File:Pmd)-[:HAS_VIOLATIONS]->(violation:Violation) RETURN count(violation)'
        ).then(function (result) {
            result.records.forEach(function (record) {

                qualityManagementMetrics = {
                    "violations": record.get(0).low
                };

                console.log(qualityManagementMetrics);
            });
        }).then( function(context) {
            thisBackup.setState({qualityManagementMetrics: qualityManagementMetrics});
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
                        <a href="#/architecture/structure">
                            <Card>
                                <CardHeader>
                                    Architecture
                                </CardHeader>
                                <CardBody>
                                    <strong>Architecture metrics</strong>
                                    <ListGroup className="margin-bottom">
                                        {Object.keys(this.state.architectureMetrics).map(function(key) {

                                            var label = key
                                            // insert a space before all caps
                                                .replace(/([A-Z])/g, ' $1')
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str){ return str.toUpperCase(); });

                                            return <ListGroupItem key={key} className="justify-content-between">{label} <div className="float-right">{this.state.architectureMetrics[key]}</div></ListGroupItem>;
                                        }, this)}
                                    </ListGroup>

                                    <strong>Relation metrics</strong>
                                    <ListGroup>
                                        {Object.keys(this.state.relationMetrics).map(function(key) {

                                            var label = key
                                            // insert a space before all caps
                                                .replace(/([A-Z])/g, ' $1')
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str){ return str.toUpperCase(); });

                                            return <ListGroupItem key={key} className="justify-content-between">{label} <div className="float-right">{this.state.relationMetrics[key]}</div></ListGroupItem>;
                                        }, this)}
                                    </ListGroup>
                                </CardBody>
                            </Card>
                        </a>
                    </Col>
                    <Col xs="12" sm="6" md="3">
                        <a href="#/resource-management/activity">
                            <Card>
                                <CardHeader>
                                    Resource Management
                                </CardHeader>
                                <CardBody>
                                    <strong>Activity metrics</strong>
                                    <ListGroup>
                                        {Object.keys(this.state.resourceManagementMetrics).map(function(key) {

                                            var label = key
                                                // insert a space before all caps
                                                .replace(/([A-Z])/g, ' $1')
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str){ return str.toUpperCase(); });

                                            return <ListGroupItem key={key} className="justify-content-between">{label} <div className="float-right">{this.state.resourceManagementMetrics[key]}</div></ListGroupItem>;
                                        }, this)}
                                    </ListGroup>
                                </CardBody>
                            </Card>
                        </a>
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
                        <a href="#/quality-management/pmd">
                            <Card>
                                <CardHeader>
                                    Quality Management
                                </CardHeader>
                                <CardBody>
                                    <strong>PMD</strong>
                                    <ListGroup>
                                        {Object.keys(this.state.qualityManagementMetrics).map(function(key) {

                                            var label = key
                                            // insert a space before all caps
                                                .replace(/([A-Z])/g, ' $1')
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str){ return str.toUpperCase(); });

                                            return <ListGroupItem key={key} className="justify-content-between">{label} <div className="float-right">{this.state.qualityManagementMetrics[key]}</div></ListGroupItem>;
                                        }, this)}
                                    </ListGroup>
                                </CardBody>
                            </Card>
                        </a>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Dashboard;
