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
import DependencyChord from "./visualizations/DependencyChord";

class ArchitectureDependencies extends DashboardAbstract {
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

    componentDidMount() {
        super.componentDidMount();
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
                                Dependencies
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
                                            Dependencies
                                        </PopoverHeader>
                                        <PopoverBody>
                                            The dependency analysis view helps
                                            to assess the coupling and cohesion
                                            of a software system. Packages are
                                            arranged radially around a circle
                                            and the dependencies are drawn as
                                            arcs.
                                        </PopoverBody>
                                    </Popover>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <DependencyChord />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ArchitectureDependencies;
