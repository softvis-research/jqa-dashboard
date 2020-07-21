import React from "react";
import DashboardAbstract from "../../AbstractDashboardComponent";
import CustomCardHeader from "../../CustomCardHeader/CustomCardHeader";
import { Card, CardBody, Col, Row } from "reactstrap";
import LayersVisualization from "./visualizations/LayersVisualization";

class Layers extends DashboardAbstract {
    render() {
        return (
            <div>
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CustomCardHeader
                                cardHeaderText={"Layers"}
                                placement={"bottom"}
                                target={"Popover1"}
                                popoverHeaderText={"Layers"}
                                popoverBody={
                                    "The dependency analysis view helps to assess the coupling and cohesion of a software system. Packages are arranged radially around a circle and the dependencies are drawn as arcs."
                                }
                            />
                            <CardBody>
                                <div className="visualization-wrapper">
                                    <div style={{ height: "700px" }}>
                                        <LayersVisualization />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Layers;
