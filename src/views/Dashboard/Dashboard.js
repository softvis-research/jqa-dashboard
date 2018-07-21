import React, { Component } from "react";

import DashboardAbstract, {
    databaseCredentialsProvided
} from "./AbstractDashboardComponent";

import {
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    ListGroup,
    ListGroupItem,
    Popover,
    PopoverHeader,
    PopoverBody
} from "reactstrap";
import DashboardModel from "../../api/models/Dashboard";

import $ from "jquery";

class PopoverItem extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false,
            infoText: {
                Architecture:
                    "Common architecture and dependency metrics provide an overview of the project, e.g., number of classes, LOC, number of dependencies, and field reads.",
                "Resource Management":
                    "Resource management provides an overview of development activities, authors, and their commits.",
                "Risk Management":
                    "Risk management helps to identify hotspots of the project.",
                "Quality Management":
                    "Quality management supports quality monitoring with regard to static code analysis results and test coverage."
            }
        };
    }

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        return (
            <span>
                <a
                    className="mr-1"
                    color="secondary"
                    id={"Popover-" + this.props.id}
                    onClick={this.toggle}
                >
                    <i className="text-muted fa fa-question-circle" />
                </a>
                <Popover
                    placement={"bottom"}
                    isOpen={this.state.popoverOpen}
                    target={"Popover-" + this.props.id}
                    toggle={this.toggle}
                >
                    <PopoverHeader>{this.props.type}</PopoverHeader>
                    <PopoverBody>
                        {this.state.infoText[this.props.type]}
                    </PopoverBody>
                </Popover>
            </span>
        );
    }
}

class Dashboard extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            structureMetrics: {
                classes: "loading",
                interfaces: "loading",
                enums: "loading",
                annotations: "loading",
                methods: "loading",
                loc: "loading",
                fields: "loading"
            },
            dependencyMetrics: {
                dependencies: "loading",
                extends: "loading",
                implements: "loading",
                invocations: "loading",
                reads: "loading",
                writes: "loading"
            },
            activityMetrics: {
                authors: "loading",
                commitsWithoutMerges: "loading",
                commitsWithMerges: "loading"
            },
            hotspotMetrics: {
                commitHotspots: "loading"
            },
            staticCodeAnalysisPMDMetrics: {
                violations: "loading"
            },
            testCoverageMetrics: {
                overallTestCoverage: "loading"
            }
        };

        this.toggleInfo = this.toggleInfo.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        if (databaseCredentialsProvided) {
            var dashboardModel = new DashboardModel();
            dashboardModel.readStructureMetrics(this);
            dashboardModel.readDependencyMetrics(this);
            dashboardModel.readActivityMetrics(this);
            dashboardModel.readStaticCodeAnalysisPMDMetrics(this);
            dashboardModel.readHotspotMetrics(this);
            dashboardModel.readTestCoverageMetrics(this);
        }

        $(document).ready(function() {
            // Select and loop all card-body elements
            $(".card-body").each(function() {
                // Cache the highest
                var highestBox = 0;

                // If this box is higher than the cached highest then store it
                if ($(this).height() > highestBox) {
                    highestBox = $(this).height();
                }

                // Set the height of all those children to whichever was highest
                $(".card-body").height(highestBox);
            });
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

        return (
            <div className="animated fadeIn dashboard">
                <Row>
                    <Col xs="12" sm="6" md="3">
                        <Card>
                            <CardHeader>
                                Architecture
                                <div className="card-actions">
                                    <PopoverItem
                                        key={"Architecture"}
                                        type={"Architecture"}
                                        id={"Architecture"}
                                    />
                                </div>
                            </CardHeader>
                            <CardBody>
                                <a href="#/architecture/structure">
                                    <strong>Structure metrics</strong>
                                    <ListGroup className="margin-bottom">
                                        {Object.keys(
                                            this.state.structureMetrics
                                        ).map(function(key) {
                                            var label = key
                                                // insert a space before all caps
                                                .replace(/([A-Z])/g, " $1")
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str) {
                                                    return str.toUpperCase();
                                                });

                                            return (
                                                <ListGroupItem
                                                    key={key}
                                                    className="justify-content-between"
                                                >
                                                    {label}{" "}
                                                    <div className="float-right">
                                                        {
                                                            this.state
                                                                .structureMetrics[
                                                                key
                                                            ]
                                                        }
                                                    </div>
                                                </ListGroupItem>
                                            );
                                        }, this)}
                                    </ListGroup>
                                </a>

                                <a href="#/architecture/dependencies">
                                    <strong>Dependency metrics</strong>
                                    <ListGroup>
                                        {Object.keys(
                                            this.state.dependencyMetrics
                                        ).map(function(key) {
                                            var label = key
                                                // insert a space before all caps
                                                .replace(/([A-Z])/g, " $1")
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str) {
                                                    return str.toUpperCase();
                                                });

                                            return (
                                                <ListGroupItem
                                                    key={key}
                                                    className="justify-content-between"
                                                >
                                                    {label}{" "}
                                                    <div className="float-right">
                                                        {
                                                            this.state
                                                                .dependencyMetrics[
                                                                key
                                                            ]
                                                        }
                                                    </div>
                                                </ListGroupItem>
                                            );
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
                                <div className="card-actions">
                                    <PopoverItem
                                        key={"ResourceManagement"}
                                        type={"Resource Management"}
                                        id={"ResourceManagement"}
                                    />
                                </div>
                            </CardHeader>
                            <CardBody>
                                <a href="#/resource-management/activity">
                                    <strong>Activity metrics</strong>
                                    <ListGroup>
                                        {Object.keys(
                                            this.state.activityMetrics
                                        ).map(function(key) {
                                            var label = key
                                                // insert a space before all caps
                                                .replace(/([A-Z])/g, " $1")
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str) {
                                                    return str.toUpperCase();
                                                });

                                            return (
                                                <ListGroupItem
                                                    key={key}
                                                    className="justify-content-between"
                                                >
                                                    {label}{" "}
                                                    <div className="float-right">
                                                        {
                                                            this.state
                                                                .activityMetrics[
                                                                key
                                                            ]
                                                        }
                                                    </div>
                                                </ListGroupItem>
                                            );
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
                                <div className="card-actions">
                                    <PopoverItem
                                        key={"RiskManagement"}
                                        type={"Risk Management"}
                                        id={"RiskManagement"}
                                    />
                                </div>
                            </CardHeader>
                            <CardBody>
                                <a href="#/risk-management/hotspots">
                                    <strong>Hotspot metrics</strong>
                                    <ListGroup className="margin-bottom">
                                        {Object.keys(
                                            this.state.hotspotMetrics
                                        ).map(function(key) {
                                            var label = key
                                                // insert a space before all caps
                                                .replace(/([A-Z])/g, " $1")
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str) {
                                                    return str.toUpperCase();
                                                });

                                            return (
                                                <ListGroupItem
                                                    key={key}
                                                    className="justify-content-between"
                                                >
                                                    {label}{" "}
                                                    <div className="float-right">
                                                        {
                                                            this.state
                                                                .hotspotMetrics[
                                                                key
                                                            ]
                                                        }
                                                    </div>
                                                </ListGroupItem>
                                            );
                                        }, this)}
                                    </ListGroup>
                                </a>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" md="3">
                        <Card>
                            <CardHeader>
                                Quality Management
                                <div className="card-actions">
                                    <PopoverItem
                                        key={"QualityManagement"}
                                        type={"Quality Management"}
                                        id={"QualityManagement"}
                                    />
                                </div>
                            </CardHeader>
                            <CardBody>
                                <a href="#/quality-management/static-code-analysis/pmd">
                                    <strong>Static Code Analysis (PMD)</strong>
                                    <ListGroup className="margin-bottom">
                                        {Object.keys(
                                            this.state
                                                .staticCodeAnalysisPMDMetrics
                                        ).map(function(key) {
                                            var label = key
                                                // insert a space before all caps
                                                .replace(/([A-Z])/g, " $1")
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str) {
                                                    return str.toUpperCase();
                                                });

                                            return (
                                                <ListGroupItem
                                                    key={key}
                                                    className="justify-content-between"
                                                >
                                                    {label}{" "}
                                                    <div className="float-right">
                                                        {
                                                            this.state
                                                                .staticCodeAnalysisPMDMetrics[
                                                                key
                                                            ]
                                                        }
                                                    </div>
                                                </ListGroupItem>
                                            );
                                        }, this)}
                                    </ListGroup>
                                </a>

                                <a href="#/quality-management/test-coverage">
                                    <strong>Test Coverage</strong>
                                    <ListGroup>
                                        {Object.keys(
                                            this.state.testCoverageMetrics
                                        ).map(function(key) {
                                            var label = key
                                                // insert a space before all caps
                                                .replace(/([A-Z])/g, " $1")
                                                .toLowerCase()
                                                // uppercase the first character
                                                .replace(/^./, function(str) {
                                                    return str.toUpperCase();
                                                });

                                            return (
                                                <ListGroupItem
                                                    key={key}
                                                    className="justify-content-between"
                                                >
                                                    {label}{" "}
                                                    <div className="float-right">
                                                        {
                                                            this.state
                                                                .testCoverageMetrics[
                                                                key
                                                            ]
                                                        }%
                                                    </div>
                                                </ListGroupItem>
                                            );
                                        }, this)}
                                    </ListGroup>
                                </a>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Dashboard;
