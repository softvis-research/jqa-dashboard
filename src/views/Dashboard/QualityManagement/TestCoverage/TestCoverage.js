import React from "react";
import DashboardAbstract from "../../AbstractDashboardComponent";
import CustomCardHeader from "../../CustomCardHeader/CustomCardHeader";
import { Button, Row, Col, Card, CardBody } from "reactstrap";

import TestCoverageTreeMap from "./visualizations/TestCoverageTreeMap";
import { CypherEditor } from "graph-app-kit/components/Editor";

var AppDispatcher = require("../../../../AppDispatcher");

class QualityManagementTestCoverage extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            query: ""
        };
    }

    componentWillMount() {
        super.componentWillMount();
    }

    componentDidMount() {
        super.componentDidMount();

        this.setState({
            query: localStorage.getItem("test_coverage_expert_query")
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    clear(event) {
        localStorage.setItem(
            "test_coverage_expert_query",
            localStorage.getItem("test_coverage_original_query")
        );
        this.sendQuery(this);
    }

    sendQuery(event) {
        this.setState({
            query: localStorage.getItem("test_coverage_expert_query")
        });

        AppDispatcher.handleAction({
            actionType: "EXPERT_QUERY",
            data: {
                queryString: localStorage.getItem("test_coverage_expert_query")
            }
        });
    }

    updateStateQuery(event) {
        localStorage.setItem("test_coverage_expert_query", event);
    }

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
            return redirect;
        }

        return (
            <div>
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CustomCardHeader
                                cardHeaderText={"Test Coverage"}
                                showExpertMode={true}
                                placement={"bottom"}
                                target={"Popover1"}
                                popoverHeaderText={"Test Coverage"}
                                popoverBody={
                                    "The test coverage view highlights untested code with a colored treemap. Packages, types, and methods are mapped to nested rectangles where the LOC define the size and the test coverage defines the color of a rectangle."
                                }
                            />
                            <CardBody>
                                <Row>
                                    <Col xs="12" sm="12" md="12">
                                        <div
                                            className={
                                                "expert-mode-editor hide-expert-mode"
                                            }
                                        >
                                            <CypherEditor
                                                className="cypheredit"
                                                value={this.state.query}
                                                options={{
                                                    mode: "cypher",
                                                    theme: "cypher"
                                                }}
                                                onValueChange={this.updateStateQuery.bind(
                                                    this
                                                )}
                                            />
                                            <Button
                                                onClick={this.sendQuery.bind(
                                                    this
                                                )}
                                                className="btn btn-success send-query float-right"
                                                color="success"
                                                id="send"
                                            >
                                                Send
                                            </Button>
                                            <Button
                                                onClick={this.clear.bind(this)}
                                                className="btn btn-success send-query float-right margin-right"
                                                color="danger"
                                                id="reset"
                                            >
                                                Reset
                                            </Button>
                                        </div>
                                        <TestCoverageTreeMap />
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

export default QualityManagementTestCoverage;
