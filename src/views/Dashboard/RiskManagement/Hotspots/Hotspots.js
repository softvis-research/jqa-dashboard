import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DashboardAbstract, { neo4jSession, databaseCredentialsProvided } from '../../AbstractDashboardComponent';
import {Row, Col, Card, CardHeader, CardBody, Button, Popover, PopoverHeader, PopoverBody} from 'reactstrap';
import DynamicBreadcrumb from '../../../../components/Breadcrumb/DynamicBreadcrumb';
import SimpleBar from 'SimpleBar';
import tinygradient from 'tinygradient';

var AppDispatcher = require('../../../../AppDispatcher');

import {ResponsiveBubbleHtml} from '@nivo/circle-packing';
import * as d3 from "d3";

import {Treebeard} from 'react-treebeard';
var treebeardCustomTheme = require('./TreebeardCustomTheme');
// from here: https://github.com/alexcurtis/react-treebeard
// TODO: add search input from example: https://github.com/alexcurtis/react-treebeard/tree/master/example
// demo: http://alexcurtis.github.io/react-treebeard/

var IDENTIFIER_PROJECT_NAME = "projectName";
var dynamicBreadcrumbSeparator = " > ";
var stringToColour = require('string-to-color');
var maxCommits = 0;

class RiskManagementHotspots extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            hotSpotData: {},
            treeViewData: {},
            breadCrumbData: [''],
            popoverOpen: false,
            popovers: [
                {
                    placement: 'bottom',
                    text: 'Bottom'
                }
            ]
        };

        this.onToggle = this.onToggle.bind(this);
        this.getCommits = this.getCommits.bind(this);
        this.toggleInfo = this.toggleInfo.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
    }

    componentDidMount() {
        var thisBackup = this;
        super.componentDidMount();

        if (databaseCredentialsProvided) {
            this.readHotspots();
        }

        // add LOC to tooltip
        /*
        $(document).on('mouseover', '.hotspot-component > div > div > div > div > div',  function () {
            var hoveredNode = $(this).prop('id');
            //set timeout because tooltip is dynamically added to the DOM by nivo
            setTimeout(function () {
                thisBackup.setState({ hoveredNode: hoveredNode });

                var tooltipElement = $(".hotspot-component strong").parent();
                var locLabelElement = $(".hotspots-loc-label");

                if (locLabelElement.length === 0) {
                    // use append because innerHTML sadly removes all listeners
                    tooltipElement.append("<span class='hotspots-loc-label'> LOC</span>");
                }

                // clean commits label
                if ($('.hotspots-commits-label').length !== 0) {
                    $('#hotspots-commits-label').remove();
                }

                var commits = thisBackup.getCommits(thisBackup.state.hoveredNode);
                if (typeof(commits) !== 'undefined') {
                    locLabelElement.append("<span id='hotspots-commits-label' class='hotspots-commits-label'>, " + commits + " Commits</span>");
                }

            }, 20);
        });*/
    }

    getCommits(name) {
        //console.log('huhu');
        var result = _.find(this.state.commitsData, function(data) {
            return data.name === name;
        });

        if (typeof(result) === 'object' && typeof(result.commits) !== 'undefined') {
            return result.commits;
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    readHotspots() {

        var flatData = [];
        var commitsData = [];
        var hierarchicalData = [];
        var projectName = localStorage.getItem(IDENTIFIER_PROJECT_NAME); // "PROJECTNAME"; // acts as root as there are multiple root packages in some cases
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

        neo4jSession.run(
            "MATCH\n" +
            " (c:Commit)-[:CONTAINS_CHANGE]->()-[:MODIFIES]->(f:File)\n" +
            "WHERE NOT\n" +
            " c:Merge\n" +
            "WITH\n" +
            " f, count(c) as commits\n" +
            "MATCH\n" +
            " (t:Type)-[:HAS_SOURCE]->(f),\n" +
            " (t)-[:DECLARES]->(m:Method)\n" +
            "WHERE\n" +
            " f.relativePath STARTS WITH 'src'\n" +
            "RETURN\n" +
            " t.fqn as fqn, sum(commits) as commits, sum(m.cyclomaticComplexity) as complexity, sum(m.effectiveLineCount) as loc ORDER BY fqn ASCENDING"
        ).then(function (result) {
            var collectedNames = [];

            maxCommits = 0; //reset value

            // collect results
            result.records.forEach(function (record) {
                var name = record.get("fqn");
                var currentCommmits = record.get("commits").low;

                if (currentCommmits > maxCommits) {
                    maxCommits = currentCommmits;
                }

                if (collectedNames[name]) { //if name already present add complexity and loc
                    for (var i = 0; i < flatData.length; i++) {
                        if (flatData[i].name === name) {
                            //console.log("----");
                            //console.log(flatData[i]);
                            flatData[i].complexity += record.get("complexity").low;
                            flatData[i].loc += record.get("loc").low;
                            flatData[i].commits += currentCommmits;
                            //console.log(flatData[i]);
                        }
                    }

                    return; //continue in forEach
                }
                collectedNames[name] = 1;
                var leafLevel = name.split(".").length;

                var recordConverted = {
                    "name": name,
                    "complexity": record.get("complexity").low,
                    "loc": record.get("loc").low,
                    "commits": currentCommmits,
                    "level": leafLevel,
                    "role": "leaf"
                };

                flatData.push(recordConverted);
                commitsData.push(
                    {
                        name: recordConverted.name.replace(/[^\w]/gi, '-'),
                        commits: recordConverted.commits
                    }
                );

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
                            "loc": 0,
                            "commits": 0,
                            "level": level,
                            "role": "node"
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

            try {
                hierarchicalData = stratify(flatData);
            } catch (e) {
                // add projectname as root
                var root = {
                    "name": projectName,
                    "complexity": 0,
                    "loc": 1, // at least 1 to make it visible
                    "commits": 0,
                    "level": 0,
                    "role": "node"
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
                    hierarchicalData.children[i].loc = hierarchicalData.children[i].data.loc;
                    hierarchicalData.children[i].complexity = hierarchicalData.children[i].data.complexity;
                    if (hierarchicalData.children[i].children) {
                        normalize(hierarchicalData.children[i]);
                    }
                }
            };

            normalize(hierarchicalData);

            neo4jSession.close();

            //normalize the root element
            hierarchicalData.name = hierarchicalData.id;
            hierarchicalData.loc = hierarchicalData.data.loc;
            hierarchicalData.complexity = hierarchicalData.data.complexity;
            hierarchicalData.commits = hierarchicalData.data.commits;
        }).then( function(context) {
            thisBackup.setState({hotSpotData: hierarchicalData});
            thisBackup.setState({commitsData: commitsData});
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

        var el = new SimpleBar(document.getElementById('treebeard-component'));
        el.recalculate()
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
                };
                markSelectedPackageAsActive(hotspotClone);

                var markAllPackagesAsUntoggled = function(hierarchicalData) {
                    for (var i = 0; i < hierarchicalData.children.length; i++) {
                        hierarchicalData.children[i].toggled = false;

                        if (hierarchicalData.children[i].children) {
                            markAllPackagesAsUntoggled(hierarchicalData.children[i]);
                        }
                    }
                };

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
                };

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
                };
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

        if (!this.state.hotSpotData.name) {
            return '';
        }

        var thisBackup = this;

        return (
            <div>
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CardHeader>
                                Hotspots
                                <div className="card-actions">
                                    <a href="javascript: void(0)" onClick={this.toggleInfo} id="Popover1">
                                        <i className="text-muted fa fa-question-circle"></i>
                                    </a>
                                    <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggleInfo}>
                                        <PopoverHeader>Hotspots</PopoverHeader>
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
                                        <Card>
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
                                    <Col xs="12" sm="6" md="4">
                                        <Card id="treebeard-component" data-simplebar style={{height: "635px", overflow: "hidden"}}>
                                            <CardBody>
                                                <Treebeard
                                                    data={this.state.hotSpotData}
                                                    onToggle={this.onToggle}
                                                    style={treebeardCustomTheme.default}
                                                />
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col xs="12" sm="6" md="8">
                                        <Card id="hotspot-component">
                                            <CardBody>
                                                <div className={'hotspot-component'} style={{height: "600px"}}>
                                                    <ResponsiveBubbleHtml
                                                        onClick={ function(event) {
                                                            AppDispatcher.handleAction({
                                                                actionType: 'SELECT_HOTSPOT_PACKAGE',
                                                                data: event
                                                            });
                                                        } }
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
                                                        colorBy={ function (e) {

                                                            //TODO: clean up this code :)

                                                            var data = e.data;

                                                            var role = "undefined";
                                                            if (data && data.role) {
                                                                role = data.role;
                                                            }

                                                            if (data && data.commits && data.commits > 0 && role === "leaf") {

                                                                var level = data.level;
                                                                var r = 228 - (11 * level * 2);
                                                                var g = 242 - (6 * level * 2);
                                                                var b = 243 - (6 * level * 2);

                                                                var saturation = data.commits / maxCommits;

                                                                var rgbObject = tinygradient('rgb(' + r + ', ' + g + ', ' + b + ')', 'red').rgbAt(saturation);
                                                                //var rgbObject = tinygradient('rgb(5, 5, 5)', 'red').rgbAt(saturation);

                                                                r = Math.round(rgbObject._r);
                                                                g = Math.round(rgbObject._g);
                                                                b = Math.round(rgbObject._b);
                                                                return 'rgb(' + r + ', ' + g + ', ' + b + ')';
                                                            } else if (data) {
                                                                var level = data.level;
                                                                var r = 228 - (11 * level * 2);
                                                                var g = 242 - (6 * level * 2);
                                                                var b = 243 - (6 * level * 2);
                                                                return 'rgb(' + r + ', ' + g + ', ' + b + ')';
                                                            }
                                                        } }
                                                        padding={2}
                                                        enableLabel={false}
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
                                                        tooltip={({ id, value, color, node }) => (
                                                            <div style={{whiteSpace: 'pre', display: 'flex', alignItems: 'center'}}>
                                                                <span style={{display: 'block', height: '12px', width: '12px', marginRight: '7px', backgroundColor: color}}></span>
                                                                <span>
                                                                    <strong>
                                                                        {id}, LOC: {value}{thisBackup.getCommits((node.data.data.name).replace(/[^\w]/gi, '-')) ? ', Commits: ' + thisBackup.getCommits((node.data.data.name).replace(/[^\w]/gi, '-')) : ''}
                                                                    </strong>
                                                                </span>
                                                            </div>
                                                        )}
                                                    />
                                                </div>
                                            </CardBody>
                                        </Card>
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

export default RiskManagementHotspots;
