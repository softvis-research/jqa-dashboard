import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DashboardAbstract, { neo4jSession, databaseCredentialsProvided } from '../../AbstractDashboardComponent';
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap';
import DynamicBreadcrumb from '../../../../components/Breadcrumb/DynamicBreadcrumb';

var AppDispatcher = require('../../../../AppDispatcher');

import {ResponsiveBubbleHtml} from 'nivo';
import * as d3 from "d3";

import {Treebeard} from 'react-treebeard';
var treebeardCustomTheme = require('./TreebeardCustomTheme');
// from here: https://github.com/alexcurtis/react-treebeard
// TODO: add search input from example: https://github.com/alexcurtis/react-treebeard/tree/master/example
// demo: http://alexcurtis.github.io/react-treebeard/

var dynamicBreadcrumbSeparator = " > ";

class RiskManagementHotspots extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            hotSpotData:
                { 
                    "name": "nivo",
                    "test": "testval",
                    "children": [
                        {
                            "name": "dummy",
                            "loc": 1
                        }
                    ]
                },
            treeViewData:
                {
                    name: 'root',
                    toggled: true,
                    children: [
                        {
                            name: 'parent',
                            children: [
                                { name: 'child1' },
                                { name: 'child2' }
                            ]
                        },
                        {
                            name: 'parent',
                            children: [
                                {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
            breadCrumbData: ['']
        };

        this.onToggle = this.onToggle.bind(this);
//        this.breadcrumbClicked = this.breadcrumbClicked.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
    }

    componentDidMount() {
        super.componentDidMount();

        if (databaseCredentialsProvided) {
            this.readStructure();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    readStructure() {
        var flatData = [];
        var hierarchicalData = [];
        var projectName = "PROJECTNAME"; // acts as root as there are multiple root packages in some cases
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state
        neo4jSession.run("MATCH (package:Package) RETURN package.fqn as fqn, 0 as complexity, 1 as loc UNION MATCH (package)-[:CONTAINS]->(class:Type), (class)-[:DECLARES]->(method:Method) RETURN class.fqn as fqn, sum(method.cyclomaticComplexity) as complexity, sum(method.effectiveLineCount) as loc")
            .then(function (result) {
                // collect results
                result.records.forEach(function (record) {
                    var recordConverted = {
                        "name": record.get("fqn"),
                        "complexity": record.get("complexity").low,
                        "loc": record.get("loc").low
                    };
                    flatData.push(recordConverted);
                });

                // add projectname as root
                var root = {
                    "name": projectName,
                    "complexity": 0,
                    "loc": 1 // at least 1 to make it visible
                };
                flatData.push(root);

                // turn flat json into hierarchical json
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
                hierarchicalData = stratify(flatData);

                //normalize recursively all childs (move information from .data to the element's root where nivo expects it)
                var normalize = function(hierarchicalData) {
                    for (var i = 0; i < hierarchicalData.children.length; i++) {
                        var lastDot = hierarchicalData.children[i].data.name.lastIndexOf(".");
                        hierarchicalData.children[i].name = hierarchicalData.children[i].data.name.substring(lastDot + 1);
                        hierarchicalData.children[i].loc = hierarchicalData.children[i].data.loc;
                        hierarchicalData.children[i].complexity = hierarchicalData.children[i].data.complexity;
                        if (hierarchicalData.children[i].children) {
                            normalize(hierarchicalData.children[i]);
                        }
                    }
                }

                normalize(hierarchicalData);

                neo4jSession.close();

                //normalize the root element
                hierarchicalData.name = hierarchicalData.id;
                hierarchicalData.loc = hierarchicalData.data.loc;
                hierarchicalData.complexity = hierarchicalData.data.complexity;
            }).then( function(context) {
                thisBackup.setState({hotSpotData: hierarchicalData});
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    triggerClickOnNode(node) {
        var nodeId = node.id.replace(/[^\w]/gi, '-');
        if (node.id) {
            var bubbleBelongingToNode = document.querySelectorAll('div#' + nodeId);
            if (bubbleBelongingToNode && bubbleBelongingToNode.length == 1) {
                bubbleBelongingToNode[0].click();
            } else if (bubbleBelongingToNode.length > 1) {
                console.log("Found more than one candidate to click on, to prevent a mess nothing has been clicked. ");
                console.log(bubbleBelongingToNode);
            }
        }
    }

    // tree view toggle
    onToggle(node, toggled) {
        this.triggerClickOnNode(node);

        if (this.state.cursor) {
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        this.setState({ cursor: node });
    }

    handleAction(event) {
        var PROJECTNAME = 'PROJECTNAME';

        var action = event.action;
        switch (action.actionType) {
          // Respond to CART_ADD action
          case 'SELECT_HOTSPOT_PACKAGE':
            var selectedPackage = event.action.data.data.id;

            var hotspotClone = this.state.hotSpotData;

            var markSelectedPackageAsActive = function(hierarchicalData) {
                for (var i = 0; i < hierarchicalData.children.length; i++) {
                    if (hierarchicalData.children[i].id === selectedPackage) {
                        hierarchicalData.children[i].active = true;
                    } else {
                        hierarchicalData.children[i].active = false;
                    }

                    if (hierarchicalData.children[i].children) {
                        markSelectedPackageAsActive(hierarchicalData.children[i]);
                    }
                }
            }
            markSelectedPackageAsActive(hotspotClone);

            var markAllPackagesAsUntoggled = function(hierarchicalData) {
                for (var i = 0; i < hierarchicalData.children.length; i++) {
                    hierarchicalData.children[i].toggled = false;

                    if (hierarchicalData.children[i].children) {
                        markAllPackagesAsUntoggled(hierarchicalData.children[i]);
                    }
                }
            }

            markAllPackagesAsUntoggled(hotspotClone);

            var markSelectedPackageAsToggled = function(hierarchicalData, targetElementName) {
                for (var i = 0; i < hierarchicalData.children.length; i++) {
                    if (hierarchicalData.children[i].id === targetElementName) {
                        hierarchicalData.children[i].toggled = true;
                    }

                    if (hierarchicalData.children[i].children) {
                        markSelectedPackageAsToggled(hierarchicalData.children[i], targetElementName);
                    }
                }
            }

            var elementToDoList = selectedPackage.split(".");
            var currentName = "";
            for (var i = 0; i < elementToDoList.length; i++) {
                if (i > 0 ) {
                    currentName += '.' + elementToDoList[i];
                } else {
                    currentName = elementToDoList[i];
                }
                markSelectedPackageAsToggled(hotspotClone, currentName);
            }
            hotspotClone.toggled = true;

            this.setState({
                hotSpotData: hotspotClone,
                breadCrumbData: selectedPackage.split(".")
            });

            break;
          case 'SELECT_HOTSPOT_PACKAGE_FROM_BREADCRUMB':
            var elementName = event.action.data;
            var findNodeByName = function(hierarchicalData) {
                for (var i = 0; i < hierarchicalData.children.length; i++) {
                    if (hierarchicalData.children[i].id === elementName) {
                        return hierarchicalData.children[i];
                    } else {
                        if (hierarchicalData.children[i].children) {
                            var node = findNodeByName(hierarchicalData.children[i]);
                            if (typeof node !== 'undefined') {
                                return node;
                            }
                        }
                    }
                }
            }
            var node = findNodeByName(this.state.hotSpotData);
            //setTimeout to prevent "Cannot dispatch in the middle of a dispatch"
            // when the !!time is out!! the dispatch is completed and the next click can be handled
            setTimeout(function() { this.triggerClickOnNode(node) }.bind(this), 50);
          break;
          default:
            return true;
        }
    }

    breadcrumbClicked(clickEvent) {
        var element = clickEvent.target;
        var elementName = (element.id + "").replace(new RegExp(dynamicBreadcrumbSeparator, 'g'), '.');
        
        //var clickedPackage = element.id; //e.g. org.junit.tests.experimental...
        AppDispatcher.handleAction({
            actionType: 'SELECT_HOTSPOT_PACKAGE_FROM_BREADCRUMB',
            data: elementName
        });
    }

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
          return(redirect);
        }

        return (
            <div>
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CardHeader>
                                Breadcrumb
                            </CardHeader>
                            <CardBody>
                                <DynamicBreadcrumb
                                    items={this.state.breadCrumbData}
                                    onClickHandler={this.breadcrumbClicked}
                                    separator={dynamicBreadcrumbSeparator}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6" md="8">
                        <Card>
                            <CardHeader>
                                Hotspots
                            </CardHeader>
                            <CardBody className={'hotspot-component'}>
                                <div style={{height: "600px"}}>
                                    <ResponsiveBubbleHtml
                                        onClick={ function(event) {
                                            AppDispatcher.handleAction({
                                                actionType: 'SELECT_HOTSPOT_PACKAGE',
                                                data: event
                                            });
                                        }
                                        }
                                        root={this.state.hotSpotData}
                                        margin={{
                                            "top": 20,
                                            "right": 20,
                                            "bottom": 20,
                                            "left": 20
                                        }}
                                        identity="name"
                                        value="loc"
                                        colors="nivo"
                                        colorBy="depth"
                                        padding={6}
                                        labelTextColor="inherit:darker(0.8)"
                                        borderWidth={2}
                                        defs={[
                                            {
                                                "id": "lines",
                                                "type": "patternLines",
                                                "background": "none",
                                                "color": "inherit",
                                                "rotation": -45,
                                                "lineWidth": 5,
                                                "spacing": 8
                                            }
                                        ]}
                                        fill={[
                                            {
                                                "match": {
                                                    "depth": 1
                                                },
                                                "id": "lines"
                                            }
                                        ]}
                                        animate={false}
                                        motionStiffness={90}
                                        motionDamping={12}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" md="4">
                        <Card>
                            <CardHeader>
                                Package Explorer
                            </CardHeader>
                            <CardBody>
                                <Treebeard
                                    data={this.state.hotSpotData}
                                    onToggle={this.onToggle}
                                    style={treebeardCustomTheme.default}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default RiskManagementHotspots;
