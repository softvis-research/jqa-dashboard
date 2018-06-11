import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DashboardAbstract, { neo4jSession, databaseCredentialsProvided } from '../../AbstractDashboardComponent';
import {Row, Col, Card, CardHeader, CardBody, Button, Popover, PopoverHeader, PopoverBody} from 'reactstrap';
import DynamicBreadcrumb from '../../../../components/Breadcrumb/DynamicBreadcrumb';
import SimpleBar from 'SimpleBar';
import tinygradient from 'tinygradient';

var AppDispatcher = require('../../../../AppDispatcher');

import {ResponsiveBubbleHtml} from '@nivo/circle-packing';
import HotspotModel from '../../../../api/models/Hotspots';

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
            var hotspotModel = new HotspotModel();
            hotspotModel.readHotspots(IDENTIFIER_PROJECT_NAME).then(function(data) {
                thisBackup.setDataToState(data);
            });
        }
    }

    setDataToState(data) {
        this.setState({
            hotSpotData: data.hierarchicalData,
            commitsData: data.commitsData,
        });

        maxCommits = data.maxCommits;
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
