import React, { Component } from 'react';

import DashboardAbstract, {databaseCredentialsProvided, neo4jSession} from './AbstractDashboardComponent';

import {Badge, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText} from 'reactstrap';

class Dashboard extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            structureMetrics: {
                "classes": "loading",
                "interfaces": "loading",
                "enums": "loading",
                "annotations": "loading",
                "methods": "loading",
                "loc": "loading",
                "fields": "loading"
            },
            dependencyMetrics: {
                "dependencies": "loading",
                "extends": "loading",
                "implements": "loading",
                "invocations": "loading",
                "reads": "loading",
                "writes": "loading"
            },
            activityMetrics: {
                "authors": "loading",
                "commitsWithoutMerges": "loading",
                "commitsWithMerges": "loading"
            },
            staticCodeAnalysisPMDMetrics: {
                "violations": "loading"
            },
            testCoverageMetrics: {
                "overallTestCoverage": "loading"
            }
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (databaseCredentialsProvided) {
            this.readStructureMetrics();
            this.readDependencyMetrics();
            this.readActivityMetrics();
            this.readStaticCodeAnalysisPMDMetrics();
            this.readTestCoverageMetrics();
        }
    }

    readStructureMetrics() {
        var structureMetrics = [];
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

                structureMetrics = {
                    "classes": record.get(0).low,
                    "interfaces": record.get(1).low,
                    "enums": record.get(2).low,
                    "annotations": record.get(3).low,
                    "methods": record.get(4).low,
                    "loc": record.get(5).low,
                    "fields": record.get(6).low
                };

                //console.log(structureMetrics);
            });
        }).then( function(context) {
            thisBackup.setState({structureMetrics: structureMetrics});
        }).catch(function (error) {
            console.log(error);
        });
    }

    readDependencyMetrics() {
        var dependencyMetrics = [];
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

                dependencyMetrics = {
                    "dependencies": record.get(0).low,
                    "extends": record.get(1).low,
                    "implements": record.get(2).low,
                    "invocations": record.get(3).low,
                    "reads": record.get(4).low,
                    "writes": record.get(5).low
                };

                //console.log(dependencyMetrics);
            });
        }).then( function(context) {
            thisBackup.setState({dependencyMetrics: dependencyMetrics});
        }).catch(function (error) {
            console.log(error);
        });
    }

    readActivityMetrics() {
        var activityMetrics = [];
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

                activityMetrics = {
                    "authors": record.get(0).low,
                    "commitsWithoutMerges": record.get(1).low,
                    "commitsWithMerges": record.get(2).low
                };

                //console.log(activityMetrics);
            });
        }).then( function(context) {
            thisBackup.setState({activityMetrics: activityMetrics});
        }).catch(function (error) {
            console.log(error);
        });
    }

    readStaticCodeAnalysisPMDMetrics() {
        var staticCodeAnalysisPMDMetrics = [];
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

        neo4jSession.run(
            // number of violations
            'MATCH (:Report)-[:HAS_FILES]->(file:File:Pmd)-[:HAS_VIOLATIONS]->(violation:Violation) RETURN count(violation)'
        ).then(function (result) {
            result.records.forEach(function (record) {

                staticCodeAnalysisPMDMetrics = {
                    "violations": record.get(0).low
                };

                //console.log(staticCodeAnalysisPMDMetrics);
            });
        }).then( function(context) {
            thisBackup.setState({staticCodeAnalysisPMDMetrics: staticCodeAnalysisPMDMetrics});
        }).catch(function (error) {
            console.log(error);
        });
    }

    readTestCoverageMetrics() {
        var testCoverageMetrics = [];
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

        neo4jSession.run(
            // number of violations
            "MATCH (c:Jacoco:Class)-[:HAS_METHODS]->(m:Method:Jacoco)-[:HAS_COUNTERS]->(t:Counter) WHERE t.type='INSTRUCTION'  RETURN (sum(t.covered)*100)/(sum(t.covered)+sum(t.missed)) as coverage"
        ).then(function (result) {
            result.records.forEach(function (record) {

                testCoverageMetrics = {
                    "overallTestCoverage": record.get(0).low
                };

                //console.log(testCoverageMetrics);
            });
        }).then( function(context) {
            thisBackup.setState({testCoverageMetrics: testCoverageMetrics});
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
            <div className="animated fadeIn dashboard">
                <Row>
                    <Col xs="12" sm="6" md="3">
                        <Card>
                            <CardHeader>
                                Architecture
                            </CardHeader>
                            <CardBody>
                                <a href="#/architecture/structure">
                                    <strong>Structure metrics</strong>
                                    <ListGroup className="margin-bottom">
                                        {Object.keys(this.state.structureMetrics).map(function(key) {

                                            var label = key
                                            // insert a space before all caps
                                                .replace(/([A-Z])/g, ' $1')
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str){ return str.toUpperCase(); });

                                            return <ListGroupItem key={key} className="justify-content-between">{label} <div className="float-right">{this.state.structureMetrics[key]}</div></ListGroupItem>;
                                        }, this)}
                                    </ListGroup>
                                </a>

                                <a href="#/architecture/dependencies">
                                    <strong>Dependency metrics</strong>
                                    <ListGroup>
                                        {Object.keys(this.state.dependencyMetrics).map(function(key) {

                                            var label = key
                                            // insert a space before all caps
                                                .replace(/([A-Z])/g, ' $1')
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str){ return str.toUpperCase(); });

                                            return <ListGroupItem key={key} className="justify-content-between">{label} <div className="float-right">{this.state.dependencyMetrics[key]}</div></ListGroupItem>;
                                        }, this)}
                                    </ListGroup>
                                </a>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" md="3">
                        <Card>
                            <CardHeader>
                                Resource Management
                            </CardHeader>
                            <CardBody>
                                <a href="#/resource-management/activity">
                                    <strong>Activity metrics</strong>
                                    <ListGroup>
                                        {Object.keys(this.state.activityMetrics).map(function(key) {

                                            var label = key
                                                // insert a space before all caps
                                                .replace(/([A-Z])/g, ' $1')
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str){ return str.toUpperCase(); });

                                            return <ListGroupItem key={key} className="justify-content-between">{label} <div className="float-right">{this.state.activityMetrics[key]}</div></ListGroupItem>;
                                        }, this)}
                                    </ListGroup>
                                </a>
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
                                <a href="#/quality-management/static-code-analysis/pmd">
                                    <strong>Static Code Analysis PMD metrics</strong>
                                    <ListGroup className="margin-bottom">
                                        {Object.keys(this.state.staticCodeAnalysisPMDMetrics).map(function(key) {

                                            var label = key
                                            // insert a space before all caps
                                                .replace(/([A-Z])/g, ' $1')
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str){ return str.toUpperCase(); });

                                            return <ListGroupItem key={key} className="justify-content-between">{label} <div className="float-right">{this.state.staticCodeAnalysisPMDMetrics[key]}</div></ListGroupItem>;
                                        }, this)}
                                    </ListGroup>
                                </a>

                                <a href="#/quality-management/test-coverage">
                                    <strong>Test Coverage metrics</strong>
                                    <ListGroup>
                                        {Object.keys(this.state.testCoverageMetrics).map(function(key) {

                                            var label = key
                                            // insert a space before all caps
                                                .replace(/([A-Z])/g, ' $1')
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str){ return str.toUpperCase(); });

                                            return <ListGroupItem key={key} className="justify-content-between">{label} <div className="float-right">{this.state.testCoverageMetrics[key]}%</div></ListGroupItem>;
                                        }, this)}
                                    </ListGroup>
                                </a>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Dashboard;
