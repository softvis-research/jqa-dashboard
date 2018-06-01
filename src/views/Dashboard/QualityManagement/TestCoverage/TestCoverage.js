import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DashboardAbstract, { neo4jSession, databaseCredentialsProvided } from '../../AbstractDashboardComponent';
import {Row, Col, Card, CardHeader, CardBody, Button, Popover, PopoverHeader, PopoverBody} from 'reactstrap';
import tinygradient from 'tinygradient';

var AppDispatcher = require('../../../../AppDispatcher');

import {ResponsiveTreeMapHtml} from '@nivo/treemap';
import * as d3 from "d3";

var IDENTIFIER_PROJECT_NAME = "projectName";
var gradient = tinygradient('red', 'green');

class QualityManagementTestCoverage extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            testCoverageData: {},
            popoverOpen: false,
            popovers: [
                {
                    placement: 'bottom',
                    text: 'Bottom'
                }
            ]
        };

        this.toggleInfo = this.toggleInfo.bind(this);
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

    findCoverageByNode(hoveredNode) {
        var hoveredNodeId = hoveredNode.data.data.id;

        //normalize recursively all childs (move information from .data to the element's root where nivo expects it)
        var findIdInHierarchicalData = function(hierarchicalData, idToFind) {
            for (var i = 0; i < hierarchicalData.children.length; i++) {
                if (hierarchicalData.children[i].data.id == idToFind) {
                    return hierarchicalData.children[i];
                }
                if (hierarchicalData.children[i].children) {
                    var found = findIdInHierarchicalData(hierarchicalData.children[i], idToFind);
                    if (found) {
                        return found;
                    }
                }
            }
        };

        var foundElement = findIdInHierarchicalData(this.state.testCoverageData, hoveredNodeId);

        if (!foundElement) {
            if (this.state.testCoverageData.id == hoveredNodeId) {
                foundElement = this.state.testCoverageData;
            }
        }

        if (typeof(foundElement) === 'object' && typeof(foundElement.coverage) !== 'undefined') {
            return foundElement.coverage;
        }
    }

    reversePathForDisplay(node) {
        var path = node.path;
        path = path.substr( node.id.length );

        if (path.length > 0) {
            path = path.substr(1)  //+1 to cut first "." away
        }
        var pathParts = path.split('.');
        var correctPath = "";
        for (var i = pathParts.length - 1; i > -1; i--) {
            correctPath += '.' + pathParts[i];
        }

        if (correctPath.length > 0) {
            correctPath = correctPath.substr(1); //remove first "." added in loop
        }

        return correctPath;
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
            /*
            "MATCH (c:Jacoco:Class)-[:HAS_METHODS]->(m:Method:Jacoco)-[:HAS_COUNTERS]->(t:Counter) " +
            "WHERE t.type='INSTRUCTION' " +
            "RETURN c.fqn as fqn, m.signature as signature,(t.covered*100)/(t.covered+t.missed) as coverage")
            */
            "MATCH (c:Jacoco:Class)-[:HAS_METHODS]->(m:Method:Jacoco)-[:HAS_COUNTERS]->(cnt:Counter) " +
            "WHERE cnt.type='INSTRUCTION' " +
            "RETURN  c.fqn as fqn, m.signature as signature,(cnt.covered*100)/(cnt.covered+cnt.missed) as coverage, cnt.covered+cnt.missed as loc " +
            "ORDER BY fqn, signature ASCENDING"
        )
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
                    "loc": record.get("loc").low,
                    "level": name.split(".").length + 1,
                    "role": "leaf"
                };
                flatData.push(recordConverted);

                //add current fqn to elements
                if (!collectedNames[name]) {
                    idCounter++;
                    collectedNames[name] = idCounter;
                    flatData.push({
                        "id": idCounter,
                        "name": name,
                        "coverage": -1,
                        "loc": 0,
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
                            "coverage": -1,
                            "loc": 0,
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
                    "coverage": -1,
                    "loc": 0,
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
                    hierarchicalData.children[i].loc = hierarchicalData.children[i].data.loc;

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
            hierarchicalData.loc = hierarchicalData.data.loc;

            neo4jSession.close();
        }).then( function(context) {
            thisBackup.setState({testCoverageData: hierarchicalData});
            //console.log(hierarchicalData);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    toggleInfo() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
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

        var thisBackup = this;

        return (
            <div>
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CardHeader>
                                Test Coverage
                                <div className="card-actions">
                                    <a href="javascript: void(0)" onClick={this.toggleInfo} id="Popover1">
                                        <i className="text-muted fa fa-question-circle"></i>
                                    </a>
                                    <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggleInfo}>
                                        <PopoverHeader>Test Coverage</PopoverHeader>
                                        <PopoverBody>
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                            aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                            culpa qui officia deserunt mollit anim id est laborum.                                        </PopoverBody>
                                    </Popover>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xs="12" sm="12" md="12">
                                        <div className={'test-coverage'} style={{height: "800px"}}>
                                            <ResponsiveTreeMapHtml
                                                root={this.state.testCoverageData}
                                                identity="name"
                                                value="loc"
                                                innerPadding={2}
                                                outerPadding={2}
                                                margin={{
                                                    "top": 10,
                                                    "right": 10,
                                                    "bottom": 10,
                                                    "left": 10
                                                }}
                                                enableLabel={false}
                                                colors="nivo"
                                                colorBy={ function (e) {

                                                    var data = e.data;

                                                    var role = "undefined";
                                                    if (data && data.role) {
                                                        role = data.role;
                                                    }

                                                    if (data && role === "leaf") {
                                                        var coverage = data.coverage / 100;
                                                        var rgbObject = tinygradient('red', 'green').rgbAt(coverage);
                                                        var r = Math.round(rgbObject._r);
                                                        var g = Math.round(rgbObject._g);
                                                        var b = Math.round(rgbObject._b);
                                                        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
                                                    } else if (data) {
                                                        var level = data.level;
                                                        var r = 228 - (11 * level * 2);
                                                        var g = 242 - (6 * level * 2);
                                                        var b = 243 - (6 * level * 2);
                                                        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
                                                    }

                                                } }
                                                borderColor="inherit:darker(0.3)"
                                                animate={true}
                                                motionStiffness={90}
                                                motionDamping={11}
                                                tooltip={({ id, value, color, node }) => (
                                                    <div style={{whiteSpace: 'pre', display: 'flex', alignItems: 'center'}}>
                                                        <span style={{display: 'block', height: '12px', width: '12px', marginRight: '7px', backgroundColor: color}}></span>
                                                        <span>
                                                            <strong>
                                                                {id}
                                                                <span className={'additional'}>
                                                                    Fqn: {thisBackup.reversePathForDisplay(node)}
                                                                </span>
                                                                <span className={'additional'}>
                                                                    LOC: {value}{
                                                                        thisBackup.findCoverageByNode(node) > -1 ?
                                                                            ', Test coverage: ' + thisBackup.findCoverageByNode(node) + '%':
                                                                            ''
                                                                    }
                                                                </span>
                                                            </strong>
                                                        </span>
                                                    </div>
                                                )}
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
