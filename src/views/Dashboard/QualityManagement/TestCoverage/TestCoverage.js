import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DashboardAbstract, { neo4jSession, databaseCredentialsProvided } from '../../AbstractDashboardComponent';
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap';
import SimpleBar from 'SimpleBar';

var AppDispatcher = require('../../../../AppDispatcher');

import {ResponsiveTreeMap} from '@nivo/treemap';
import * as d3 from "d3";

var IDENTIFIER_PROJECT_NAME = "projectName";

class QualityManagementTestCoverage extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            testCoverageData: {}
        };

    }

    componentWillMount() {
        super.componentWillMount();
    }

    componentDidMount() {
        super.componentDidMount();

        if (databaseCredentialsProvided) {
            this.readTestCoverage();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    readTestCoverage() {

        var flatData = [];
        var hierarchicalData = [];
        var projectName = localStorage.getItem(IDENTIFIER_PROJECT_NAME); // "PROJECTNAME"; // acts as root as there are multiple root packages in some cases
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state
        var collectedNames = [];

        neo4jSession.run(
            "MATCH (c:Jacoco:Class)-[:HAS_METHODS]->(m:Method:Jacoco)-[:HAS_COUNTERS]->(t:Counter) " +
            "WHERE t.type='INSTRUCTION' " +
            "RETURN c.fqn as fqn, m.signature as signature,(t.covered*100)/(t.covered+t.missed) as coverage")
        .then(function (result) {
            var idCounter = 1;
            // collect results
            result.records.forEach(function (record) {
                var name = record.get("fqn");

                //add signature as element
                var recordConverted = {
                    "id": idCounter,
                    "name": record.get("signature"),
                    "fqn": name,
                    "coverage": record.get("coverage").low,
                    "level": name.split(".").length + 1
                };
                flatData.push(recordConverted);

                //add current fqn to elements
                if (!collectedNames[name]) {
                    idCounter++;
                    collectedNames[name] = idCounter;
                    flatData.push({
                        "id": idCounter,
                        "name": name,
                        "coverage": 0,
                        "level": name.split(".").length
                    });
                }

                //fill packages to allow stratify()
                var level = 0;
                while (name.lastIndexOf(".") !== -1) {
                    idCounter++;
                    level = name.split(".").length - 1;
                    name = name.substring(0, name.lastIndexOf("."));
                    if (!collectedNames[name]) {
                        collectedNames[name] = idCounter;
                        flatData.push({
                            "id": idCounter,
                            "name": name,
                            "coverage": 0,
                            "level": level
                        });
                    }
                }
                idCounter++;
            });

            var stratify = d3.stratify()
                .id(function (d) {
                    return d.id;
                })
                .parentId(function (d) {
                    if (d.fqn) {
                        return collectedNames[d.fqn];
                    }

                    if (d.name.lastIndexOf(".") !== -1) { // classes and subpackes
                        return collectedNames[d.name.substring(0, d.name.lastIndexOf("."))];
                    }

                    if (d.name !== projectName) { // a root package
                        return collectedNames[projectName];
                    } else { // project name as root
                        return undefined;
                    }
                });

            // add projectname as root
            try {
                hierarchicalData = stratify(flatData);
            } catch (e) {
                var root = {
                    "id": 0,
                    "name": projectName,
                    "coverage": 0,
                    "level": 0
                };
                flatData.push(root);
                collectedNames[projectName] = 0;
                hierarchicalData = stratify(flatData);
            }

            //normalize recursively all childs (move information from .data to the element's root where nivo expects it)
            var normalize = function(hierarchicalData) {
                for (var i = 0; i < hierarchicalData.children.length; i++) {
                    hierarchicalData.children[i].key = hierarchicalData.children[i].data.id;
                    hierarchicalData.children[i].coverage = hierarchicalData.children[i].data.coverage;

                    if (!hierarchicalData.children[i].data.fqn) {
                        var lastDot = hierarchicalData.children[i].data.name.lastIndexOf(".");
                        hierarchicalData.children[i].name = hierarchicalData.children[i].data.name.substring(lastDot + 1);
                    } else {
                        hierarchicalData.children[i].name = hierarchicalData.children[i].data.name;
                    }

                    if (hierarchicalData.children[i].children) {
                        normalize(hierarchicalData.children[i]);
                    }
                }
            };

            normalize(hierarchicalData);
            //normalize the root element
            hierarchicalData.key = hierarchicalData.data.id;
            hierarchicalData.name = hierarchicalData.data.name;
            hierarchicalData.coverage = hierarchicalData.data.coverage;

            neo4jSession.close();
        }).then( function(context) {
            thisBackup.setState({testCoverageData: hierarchicalData});
//            console.log(hierarchicalData);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
            return(redirect);
        }

        if (!this.state.testCoverageData.name) {
            return '';
        }
//        console.log(this.state.testCoverageData);

        return (
            <div>
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CardHeader>
                                Test Coverage
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xs="12" sm="12" md="12">
                                        <div className={'test-coverage'} style={{height: "500px"}}>
                                            <ResponsiveTreeMap
                                                root={this.state.testCoverageData}
                                                identity="name"
                                                value="coverage"
                                                innerPadding={10}
                                                outerPadding={10}
                                                margin={{
                                                    "top": 10,
                                                    "right": 10,
                                                    "bottom": 10,
                                                    "left": 10
                                                }}
                                                label="coverage"
                                                labelFormat=".0s"
                                                labelSkipSize={12}
                                                labelTextColor="inherit:darker(1.2)"
                                                colors="nivo"
                                                colorBy="depth"
                                                borderColor="inherit:darker(0.3)"
                                                animate={true}
                                                motionStiffness={90}
                                                motionDamping={11}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default QualityManagementTestCoverage;
