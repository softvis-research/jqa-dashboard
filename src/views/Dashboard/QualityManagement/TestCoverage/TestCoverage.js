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
            testCoverageData: {
                "name": "nivo",
                "children": [
                    {
                        "name": "viz",
                        "children": [
                            {
                                "name": "stack",
                                "children": [
                                    {
                                        "name": "chart",
                                        "color": "hsl(81, 70%, 50%)",
                                        "coverage": 44805
                                    }
                                ]
                            },
                            {
                                "name": "pie",
                                "color": "hsl(238, 70%, 50%)",
                                "children": [
                                    {
                                        "name": "chart",
                                        "color": "hsl(91, 70%, 50%)",
                                        "children": [
                                            {
                                                "name": "pie",
                                                "color": "hsl(343, 70%, 50%)",
                                                "children": [
                                                    {
                                                        "name": "outline",
                                                        "coverage": 177607
                                                    },
                                                    {
                                                        "name": "slices",
                                                        "coverage": 69099
                                                    },
                                                    {
                                                        "name": "bbox",
                                                        "coverage": 29706
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "donut",
                                                "coverage": 47826
                                            },
                                            {
                                                "name": "gauge",
                                                "coverage": 182543
                                            }
                                        ]
                                    },
                                    {
                                        "name": "legends",
                                        "coverage": 117658
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "colors",
                        "children": [
                            {
                                "name": "rgb",
                                "coverage": 27772
                            },
                            {
                                "name": "hsl",
                                "coverage": 173717
                            }
                        ]
                    },
                    {
                        "name": "utils",
                        "children": [
                            {
                                "name": "randomize",
                                "coverage": 125645
                            },
                            {
                                "name": "resetClock",
                                "coverage": 38590
                            },
                            {
                                "name": "noop",
                                "coverage": 74833
                            }
                        ]
                    },
                    {
                        "name": "generators",
                        "color": "hsl(49, 70%, 50%)",
                        "children": [
                            {
                                "name": "address",
                                "coverage": 79920
                            }
                        ]
                    },
                    {
                        "name": "set",
                        "color": "hsl(147, 70%, 50%)",
                        "children": [
                            {
                                "name": "clone",
                                "coverage": 50094
                            },
                            {
                                "name": "intersect",
                                "coverage": 74340
                            }
                        ]
                    },
                    {
                        "name": "text",
                        "children": [
                            {
                                "name": "trim",
                                "coverage": 122660
                            }
                        ]
                    },
                    {
                        "name": "misc",
                        "color": "hsl(18, 70%, 50%)",
                        "children": [
                            {
                                "name": "whatever",
                                "color": "hsl(270, 70%, 50%)",
                                "children": [
                                    {
                                        "name": "hey",
                                        "color": "hsl(191, 70%, 50%)",
                                        "coverage": 32524
                                    },
                                    {
                                        "name": "WTF",
                                        "color": "hsl(222, 70%, 50%)",
                                        "coverage": 16215
                                    }
                                ]
                            },
                            {
                                "name": "other",
                                "coverage": 118451
                            },
                            {
                                "name": "crap",
                                "children": [
                                    {
                                        "name": "crapA",
                                        "coverage": 38672
                                    },
                                    {
                                        "name": "crapB",
                                        "children": [
                                            {
                                                "name": "crapB1",
                                                "coverage": 101748
                                            },
                                            {
                                                "name": "crapB2",
                                                "coverage": 56027
                                            }
                                        ]
                                    },
                                    {
                                        "name": "crapC",
                                        "children": [
                                            {
                                                "name": "crapC1",
                                                "coverage": 101089
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
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
        neo4jSession.run(
            "MATCH (c:Jacoco:Class)-[:HAS_METHODS]->(m:Method:Jacoco)-[:HAS_COUNTERS]->(t:Counter) " +
            "WHERE t.type='INSTRUCTION' " +
            "RETURN c.fqn as fqn, m.signature as signature,(t.covered*100)/(t.covered+t.missed) as coverage")
            .then(function (result) {
                var collectedNames = [];

                // collect results
                result.records.forEach(function (record) {
                    var name = record.get("fqn");

                    var recordConverted = {
                        "name": name,
                        "signature": record.get("signature"),
                        "coverage": record.get("coverage").low,
                        "level": name.split(".").length
                    };
                    flatData.push(recordConverted);

                    //fill packages to allow stratify()
                    var level = 0;
                    while (name.lastIndexOf(".") !== -1) {
                        level = name.split(".").length - 1;
                        name = name.substring(0, name.lastIndexOf("."));
                        if (!collectedNames[name]) {
                            collectedNames[name] = 1;
                            flatData.push({
                                "name": name,
                                "complexity": 0,
                                "coverage": 0,
                                "level": level
                            });
                        }
                    }
                });

                var stratify = d3.stratify()
                    .id(function (d) {
                        return d.name;
                    })
                    .parentId(function (d) {
                        if (d.name.lastIndexOf(".") != -1) { // classes and subpackes
                            return d.name.substring(0, d.name.lastIndexOf("."));
                        } else if (d.name != projectName) { // a root package
                            return projectName;
                        } else { // project name as root
                            return "";
                        }
                    });

                // add projectname as root
                try {
                    hierarchicalData = stratify(flatData);
                } catch (e) {
                    var root = {
                        "name": projectName,
                        "level": 0
                    };
                    flatData.push(root);
                    hierarchicalData = stratify(flatData);
                }

                // turn flat json into hierarchical json


                //normalize recursively all childs (move information from .data to the element's root where nivo expects it)
                var normalize = function(hierarchicalData) {
                    for (var i = 0; i < hierarchicalData.children.length; i++) {
                        var lastDot = hierarchicalData.children[i].data.name.lastIndexOf(".");
                        hierarchicalData.children[i].name = hierarchicalData.children[i].data.name.substring(lastDot + 1);
                        //hierarchicalData.children[i].signature = hierarchicalData.children[i].data.signature;
                        hierarchicalData.children[i].coverage = hierarchicalData.children[i].data.coverage;
                        if (hierarchicalData.children[i].children) {
                            normalize(hierarchicalData.children[i]);
                        }
                    }
                }

                normalize(hierarchicalData);

                neo4jSession.close();

                //normalize the root element
                hierarchicalData.name = hierarchicalData.id;
                //hierarchicalData.loc = hierarchicalData.data.loc;
                //hierarchicalData.complexity = hierarchicalData.data.complexity;
            }).then( function(context) {
            //thisBackup.setState({testCoverageData: hierarchicalData});
            console.log(hierarchicalData);
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
        console.log(this.state.testCoverageData);

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
                                                innerPadding={3}
                                                outerPadding={3}
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
