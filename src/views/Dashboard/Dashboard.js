import React from "react";
import DashboardAbstract, {
    databaseCredentialsProvided
} from "./AbstractDashboardComponent";
import CustomCardHeader from "./CustomCardHeader/CustomCardHeader";
import { CypherEditor } from "graph-app-kit/components/Editor";
import {
    Button,
    Row,
    Col,
    Card,
    CardBody,
    ListGroup,
    ListGroupItem
} from "reactstrap";
import DashboardModel from "../../api/models/Dashboard";
import $ from "jquery";

var AppDispatcher = require("../../AppDispatcher");

class Dashboard extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            queryStructure: "",
            queryDependencies: "",
            queryActivity: "",
            queryHotspot: "",
            queryPMD: "",
            queryTestCoverage: "",
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

            this.setState({
                queryStructure: localStorage.getItem(
                    "dashboard_structure_expert_query"
                ),
                queryDependencies: localStorage.getItem(
                    "dashboard_dependencies_expert_query"
                ),
                queryActivity: localStorage.getItem(
                    "dashboard_activity_expert_query"
                ),
                queryHotspot: localStorage.getItem(
                    "dashboard_hotspot_expert_query"
                ),
                queryPMD: localStorage.getItem("dashboard_pmd_expert_query"),
                queryTestCoverage: localStorage.getItem(
                    "dashboard_test_coverage_expert_query"
                )
            });
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

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    handleAction(event) {
        var action = event.action;
        switch (action.actionType) {
            case "EXPERT_QUERY":
                if (databaseCredentialsProvided) {
                    var dashboardModel = new DashboardModel();
                    dashboardModel.readStructureMetrics(this);
                    dashboardModel.readDependencyMetrics(this);
                    dashboardModel.readActivityMetrics(this);
                    dashboardModel.readStaticCodeAnalysisPMDMetrics(this);
                    dashboardModel.readHotspotMetrics(this);
                    dashboardModel.readTestCoverageMetrics(this);
                }
                break;
            default:
                return true;
        }
    }

    clearStructure(event) {
        localStorage.setItem(
            "dashboard_structure_expert_query",
            localStorage.getItem("dashboard_structure_original_query")
        );
        this.sendQuery(this);
    }

    clearDependencies(event) {
        localStorage.setItem(
            "dashboard_dependencies_expert_query",
            localStorage.getItem("dashboard_dependencies_original_query")
        );
        this.sendQuery(this);
    }

    clearActivity(event) {
        localStorage.setItem(
            "dashboard_activity_expert_query",
            localStorage.getItem("dashboard_activity_original_query")
        );
        this.sendQuery(this);
    }

    clearHotspot(event) {
        localStorage.setItem(
            "dashboard_hotspot_expert_query",
            localStorage.getItem("dashboard_hotspot_original_query")
        );
        this.sendQuery(this);
    }

    clearPMD(event) {
        localStorage.setItem(
            "dashboard_pmd_expert_query",
            localStorage.getItem("dashboard_pmd_original_query")
        );
        this.sendQuery(this);
    }

    clearTestCoverage(event) {
        localStorage.setItem(
            "dashboard_test_coverage_expert_query",
            localStorage.getItem("dashboard_test_coverage_original_query")
        );
        this.sendQuery(this);
    }

    sendQuery(event) {
        this.setState({
            queryStructure: localStorage.getItem(
                "dashboard_structure_expert_query"
            ),
            queryDependencies: localStorage.getItem(
                "dashboard_dependencies_expert_query"
            ),
            queryActivity: localStorage.getItem(
                "dashboard_activity_expert_query"
            ),
            queryHotspot: localStorage.getItem(
                "dashboard_hotspot_expert_query"
            ),
            queryPMD: localStorage.getItem("dashboard_pmd_expert_query"),
            queryTestCoverage: localStorage.getItem(
                "dashboard_test_coverage_expert_query"
            )
        });

        AppDispatcher.handleAction({
            actionType: "EXPERT_QUERY",
            data: {
                queryStringStructure: localStorage.getItem(
                    "dashboard_structure_expert_query"
                ),
                queryStringDependencies: localStorage.getItem(
                    "dashboard_dependencies_expert_query"
                ),
                queryStringActivity: localStorage.getItem(
                    "dashboard_activity_expert_query"
                ),
                queryStringHotspot: localStorage.getItem(
                    "dashboard_hotspot_expert_query"
                ),
                queryStringPMD: localStorage.getItem(
                    "dashboard_pmd_expert_query"
                ),
                queryStringTestCoverage: localStorage.getItem(
                    "dashboard_test_coverage_expert_query"
                )
            }
        });
    }

    updateStateQueryStructure(event) {
        localStorage.setItem("dashboard_structure_expert_query", event);
    }

    updateStateQueryDependencies(event) {
        localStorage.setItem("dashboard_dependencies_expert_query", event);
    }

    updateStateQueryActivity(event) {
        localStorage.setItem("dashboard_activity_expert_query", event);
    }

    updateStateQueryHotspot(event) {
        localStorage.setItem("dashboard_hotspot_expert_query", event);
    }

    updateStateQueryPMD(event) {
        localStorage.setItem("dashboard_pmd_expert_query", event);
    }

    updateStateQueryTestCoverage(event) {
        localStorage.setItem("dashboard_test_coverage_expert_query", event);
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
                            <CustomCardHeader
                                cardHeaderText={"Architecture"}
                                showExpertMode={true}
                                placement={"bottom"}
                                target={"Popover1"}
                                popoverHeaderText={"Architecture"}
                                popoverBody={
                                    "Common architecture and dependency metrics provide an overview of the project, e.g., number of classes, LOC, number of dependencies, and field reads."
                                }
                            />
                            <CardBody>
                                <div
                                    className={
                                        "expert-mode-editor hide-expert-mode architecture"
                                    }
                                >
                                    <CypherEditor
                                        className="cypheredit"
                                        value={this.state.queryStructure}
                                        options={{
                                            mode: "cypher",
                                            theme: "cypher"
                                        }}
                                        onValueChange={this.updateStateQueryStructure.bind(
                                            this
                                        )}
                                    />
                                    <Button
                                        onClick={this.sendQuery.bind(this)}
                                        className="btn btn-success send-query float-right"
                                        color="success"
                                        id="send"
                                    >
                                        Send
                                    </Button>
                                    <Button
                                        onClick={this.clearStructure.bind(this)}
                                        className="btn btn-success send-query float-right margin-right"
                                        color="danger"
                                        id="reset"
                                    >
                                        Reset
                                    </Button>
                                </div>
                                <a
                                    href="#/architecture/structure"
                                    className={"display-block clear"}
                                >
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

                                <div
                                    className={
                                        "expert-mode-editor hide-expert-mode architecture"
                                    }
                                >
                                    <CypherEditor
                                        className="cypheredit"
                                        value={this.state.queryDependencies}
                                        options={{
                                            mode: "cypher",
                                            theme: "cypher"
                                        }}
                                        onValueChange={this.updateStateQueryDependencies.bind(
                                            this
                                        )}
                                    />
                                    <Button
                                        onClick={this.sendQuery.bind(this)}
                                        className="btn btn-success send-query float-right"
                                        color="success"
                                        id="send"
                                    >
                                        Send
                                    </Button>
                                    <Button
                                        onClick={this.clearDependencies.bind(
                                            this
                                        )}
                                        className="btn btn-success send-query float-right margin-right"
                                        color="danger"
                                        id="reset"
                                    >
                                        Reset
                                    </Button>
                                </div>

                                <a
                                    href="#/architecture/dependencies"
                                    className={"display-block clear"}
                                >
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
                            <CustomCardHeader
                                cardHeaderText={"Resource Management"}
                                showExpertMode={true}
                                placement={"bottom"}
                                target={"Popover2"}
                                popoverHeaderText={"Resource Management"}
                                popoverBody={
                                    "Resource management provides an overview of development activities, authors, and their commits."
                                }
                            />
                            <CardBody>
                                <div
                                    className={
                                        "expert-mode-editor hide-expert-mode resourcemanagement"
                                    }
                                >
                                    <CypherEditor
                                        className="cypheredit"
                                        value={this.state.queryActivity}
                                        options={{
                                            mode: "cypher",
                                            theme: "cypher"
                                        }}
                                        onValueChange={this.updateStateQueryActivity.bind(
                                            this
                                        )}
                                    />
                                    <Button
                                        onClick={this.sendQuery.bind(this)}
                                        className="btn btn-success send-query float-right"
                                        color="success"
                                        id="send"
                                    >
                                        Send
                                    </Button>
                                    <Button
                                        onClick={this.clearActivity.bind(this)}
                                        className="btn btn-success send-query float-right margin-right"
                                        color="danger"
                                        id="reset"
                                    >
                                        Reset
                                    </Button>
                                </div>
                                <a
                                    href="#/resource-management/activity"
                                    className={"display-block clear"}
                                >
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
                            <CustomCardHeader
                                cardHeaderText={"Risk Management"}
                                showExpertMode={true}
                                placement={"bottom"}
                                target={"Popover3"}
                                popoverHeaderText={"Risk Management"}
                                popoverBody={
                                    "Risk management helps to identify hotspots of the project."
                                }
                            />
                            <CardBody>
                                <div
                                    className={
                                        "expert-mode-editor hide-expert-mode riskmanagement"
                                    }
                                >
                                    <CypherEditor
                                        className="cypheredit"
                                        value={this.state.queryHotspot}
                                        options={{
                                            mode: "cypher",
                                            theme: "cypher"
                                        }}
                                        onValueChange={this.updateStateQueryHotspot.bind(
                                            this
                                        )}
                                    />
                                    <Button
                                        onClick={this.sendQuery.bind(this)}
                                        className="btn btn-success send-query float-right"
                                        color="success"
                                        id="send"
                                    >
                                        Send
                                    </Button>
                                    <Button
                                        onClick={this.clearHotspot.bind(this)}
                                        className="btn btn-success send-query float-right margin-right"
                                        color="danger"
                                        id="reset"
                                    >
                                        Reset
                                    </Button>
                                </div>
                                <a
                                    href="#/risk-management/hotspots"
                                    className={"display-block clear"}
                                >
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
                            <CustomCardHeader
                                cardHeaderText={"Quality Management"}
                                showExpertMode={true}
                                placement={"bottom"}
                                target={"Popover4"}
                                popoverHeaderText={"Quality Management"}
                                popoverBody={
                                    "Quality management supports quality monitoring with regard to static code analysis results and test coverage."
                                }
                            />
                            <CardBody>
                                <div
                                    className={
                                        "expert-mode-editor hide-expert-mode qualitymanagement"
                                    }
                                >
                                    <CypherEditor
                                        className="cypheredit"
                                        value={this.state.queryPMD}
                                        options={{
                                            mode: "cypher",
                                            theme: "cypher"
                                        }}
                                        onValueChange={this.updateStateQueryPMD.bind(
                                            this
                                        )}
                                    />
                                    <Button
                                        onClick={this.sendQuery.bind(this)}
                                        className="btn btn-success send-query float-right"
                                        color="success"
                                        id="send"
                                    >
                                        Send
                                    </Button>
                                    <Button
                                        onClick={this.clearPMD.bind(this)}
                                        className="btn btn-success send-query float-right margin-right"
                                        color="danger"
                                        id="reset"
                                    >
                                        Reset
                                    </Button>
                                </div>
                                <a
                                    href="#/quality-management/static-code-analysis/pmd"
                                    className={"display-block clear"}
                                >
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

                                <div
                                    className={
                                        "expert-mode-editor hide-expert-mode qualitymanagement"
                                    }
                                >
                                    <CypherEditor
                                        className="cypheredit"
                                        value={this.state.queryTestCoverage}
                                        options={{
                                            mode: "cypher",
                                            theme: "cypher"
                                        }}
                                        onValueChange={this.updateStateQueryTestCoverage.bind(
                                            this
                                        )}
                                    />
                                    <Button
                                        onClick={this.sendQuery.bind(this)}
                                        className="btn btn-success send-query float-right"
                                        color="success"
                                        id="send"
                                    >
                                        Send
                                    </Button>
                                    <Button
                                        onClick={this.clearTestCoverage.bind(
                                            this
                                        )}
                                        className="btn btn-success send-query float-right margin-right"
                                        color="danger"
                                        id="reset"
                                    >
                                        Reset
                                    </Button>
                                </div>
                                <a
                                    href="#/quality-management/test-coverage"
                                    className={"display-block clear"}
                                >
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
                                                        }
                                                        %
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
