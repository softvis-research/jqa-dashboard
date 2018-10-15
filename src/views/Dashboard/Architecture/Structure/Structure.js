import React from "react";
import DashboardAbstract, {
    databaseCredentialsProvided
} from "../../AbstractDashboardComponent";
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Popover,
    PopoverHeader,
    PopoverBody
} from "reactstrap";
import DynamicBreadcrumb from "../../DynamicBreadcrumb/DynamicBreadcrumb";
import StructureBubble from "./visualization/StructureBubble";
import { Treebeard } from "react-treebeard";

import HotspotModel from "../../../../api/models/Hotspots";

var AppDispatcher = require("../../../../AppDispatcher");

var IDENTIFIER_PROJECT_NAME = "projectName";

var treebeardCustomTheme = require("./TreebeardCustomTheme");
// from here: https://github.com/alexcurtis/react-treebeard
// TODO: add search input from example: https://github.com/alexcurtis/react-treebeard/tree/master/example
// demo: http://alexcurtis.github.io/react-treebeard/

var dynamicBreadcrumbSeparator = " > ";

//eslint-disable-next-line
import SimpleBar from "simplebar";

class ArchitectureStructure extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            hotSpotData: {},
            treeViewData: {},
            breadCrumbData: [""],
            popoverOpen: false,
            popovers: [
                {
                    placement: "bottom",
                    text: "Bottom"
                }
            ]
        };

        this.onToggle = this.onToggle.bind(this);
        this.toggleInfo = this.toggleInfo.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
    }

    componentDidMount() {
        super.componentDidMount();

        var thisBackup = this;

        if (databaseCredentialsProvided) {
            var hotspotModel = new HotspotModel();
            hotspotModel
                .readHotspots(IDENTIFIER_PROJECT_NAME)
                .then(function(data) {
                    thisBackup.setState({ hotSpotData: data.hierarchicalData });
                });
            //this.readStructure();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    triggerClickOnNode(node) {
        var nodeId = node.id.replace(/[^\w]/gi, "-");
        if (node.id) {
            var bubbleBelongingToNode = document.querySelectorAll(
                "div#" + nodeId
            );
            if (bubbleBelongingToNode && bubbleBelongingToNode.length === 1) {
                bubbleBelongingToNode[0].click();
            } else if (bubbleBelongingToNode.length > 1) {
                console.log(
                    "Found more than one candidate to click on, to prevent a mess nothing has been clicked. "
                );
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
        var action = event.action;
        switch (action.actionType) {
            case "SELECT_HOTSPOT_PACKAGE":
                var selectedPackage = event.action.data.data.id;

                var hotspotClone = this.state.hotSpotData;

                var markSelectedPackageAsActive = function(hierarchicalData) {
                    for (var i = 0; i < hierarchicalData.children.length; i++) {
                        if (
                            hierarchicalData.children[i].id === selectedPackage
                        ) {
                            hierarchicalData.children[i].active = true;
                        } else {
                            hierarchicalData.children[i].active = false;
                        }

                        if (hierarchicalData.children[i].children) {
                            markSelectedPackageAsActive(
                                hierarchicalData.children[i]
                            );
                        }
                    }
                };

                markSelectedPackageAsActive(hotspotClone);

                var markAllPackagesAsUntoggled = function(hierarchicalData) {
                    for (var i = 0; i < hierarchicalData.children.length; i++) {
                        hierarchicalData.children[i].toggled = false;

                        if (hierarchicalData.children[i].children) {
                            markAllPackagesAsUntoggled(
                                hierarchicalData.children[i]
                            );
                        }
                    }
                };

                markAllPackagesAsUntoggled(hotspotClone);

                var markSelectedPackageAsToggled = function(
                    hierarchicalData,
                    targetElementName
                ) {
                    for (var i = 0; i < hierarchicalData.children.length; i++) {
                        if (
                            hierarchicalData.children[i].id ===
                            targetElementName
                        ) {
                            hierarchicalData.children[i].toggled = true;
                        }

                        if (hierarchicalData.children[i].children) {
                            markSelectedPackageAsToggled(
                                hierarchicalData.children[i],
                                targetElementName
                            );
                        }
                    }
                };

                var elementToDoList = selectedPackage.split(".");
                var currentName = "";
                for (var i = 0; i < elementToDoList.length; i++) {
                    if (i > 0) {
                        currentName += "." + elementToDoList[i];
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
            case "SELECT_HOTSPOT_PACKAGE_FROM_BREADCRUMB":
                var elementName = event.action.data;
                var findNodeByName = function(hierarchicalData) {
                    for (var i = 0; i < hierarchicalData.children.length; i++) {
                        if (hierarchicalData.children[i].id === elementName) {
                            return hierarchicalData.children[i];
                        } else {
                            if (hierarchicalData.children[i].children) {
                                var node = findNodeByName(
                                    hierarchicalData.children[i]
                                );
                                if (typeof node !== "undefined") {
                                    return node;
                                }
                            }
                        }
                    }
                };

                var node = findNodeByName(this.state.hotSpotData);
                //setTimeout to prevent "Cannot dispatch in the middle of a dispatch"
                // when the !!time is out!! the dispatch is completed and the next click can be handled
                setTimeout(
                    function() {
                        this.triggerClickOnNode(node);
                    }.bind(this),
                    50
                );
                break;
            default:
                return true;
        }
    }

    breadcrumbClicked(clickEvent) {
        var element = clickEvent.target;
        var elementName = (element.id + "").replace(
            new RegExp(dynamicBreadcrumbSeparator, "g"),
            "."
        );

        //var clickedPackage = element.id; //e.g. org.junit.tests.experimental...
        AppDispatcher.handleAction({
            actionType: "SELECT_HOTSPOT_PACKAGE_FROM_BREADCRUMB",
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
            return redirect;
        }

        if (!this.state.hotSpotData.name) {
            return "";
        }

        return (
            <div>
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CardHeader>
                                Structure
                                <div className="card-actions">
                                    <button
                                        onClick={this.toggleInfo}
                                        id="Popover2"
                                    >
                                        <i className="text-muted fa fa-question-circle" />
                                    </button>
                                    <Popover
                                        placement="bottom"
                                        isOpen={this.state.popoverOpen}
                                        target="Popover2"
                                        toggle={this.toggleInfo}
                                    >
                                        <PopoverHeader>Structure</PopoverHeader>
                                        <PopoverBody>
                                            The structure analysis view gives an
                                            overview of the project hierarchy.
                                            Packages and types are mapped to
                                            nested circles with LOC as their
                                            size.
                                        </PopoverBody>
                                    </Popover>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xs="12" sm="12" md="12">
                                        <Card>
                                            <CardBody>
                                                <DynamicBreadcrumb
                                                    items={
                                                        this.state
                                                            .breadCrumbData
                                                    }
                                                    onClickHandler={
                                                        this.breadcrumbClicked
                                                    }
                                                    separator={
                                                        dynamicBreadcrumbSeparator
                                                    }
                                                />
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="6" md="4">
                                        <Card
                                            id="treebeard-component"
                                            data-simplebar
                                            style={{
                                                height: "635px",
                                                overflow: "hidden"
                                            }}
                                        >
                                            <CardBody>
                                                <Treebeard
                                                    data={
                                                        this.state.hotSpotData
                                                    }
                                                    onToggle={this.onToggle}
                                                    style={
                                                        treebeardCustomTheme.default
                                                    }
                                                />
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col xs="12" sm="6" md="8">
                                        <Card id="structure-component">
                                            <CardBody>
                                                <div
                                                    className={
                                                        "structure-component"
                                                    }
                                                    style={{ height: "600px" }}
                                                >
                                                    <StructureBubble
                                                        data={
                                                            this.state
                                                                .hotSpotData
                                                        }
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
        );
    }
}

export default ArchitectureStructure;
