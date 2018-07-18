import React from "react";
import DashboardAbstract from "../../AbstractDashboardComponent";
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

import TestCoverageTreeMap from "./visualizations/TestCoverageTreeMap";

class QualityManagementTestCoverage extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            popoverOpen: false,
            popovers: [
                {
                    placement: "bottom",
                    text: "Bottom"
                }
            ]
        };

        this.toggleInfo = this.toggleInfo.bind(this);
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
            <div>
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CardHeader>
                                Test Coverage
                                <div className="card-actions">
                                    <a onClick={this.toggleInfo} id="Popover1">
                                        <i className="text-muted fa fa-question-circle" />
                                    </a>
                                    <Popover
                                        placement="bottom"
                                        isOpen={this.state.popoverOpen}
                                        target="Popover1"
                                        toggle={this.toggleInfo}
                                    >
                                        <PopoverHeader>
                                            Test Coverage
                                        </PopoverHeader>
                                        <PopoverBody>
                                            The test coverage view highlights
                                            untested code with a colored
                                            treemap. Packages, types, and
                                            methods are mapped to nested
                                            rectangles where the LOC define the
                                            size and the test coverage defines
                                            the color of a rectangle.
                                        </PopoverBody>
                                    </Popover>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xs="12" sm="12" md="12">
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
