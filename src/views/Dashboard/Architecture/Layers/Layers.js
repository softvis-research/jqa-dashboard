import React from "react";
import DashboardAbstract, {
    databaseCredentialsProvided
} from "../../AbstractDashboardComponent";
import { Col, Row, Card, CardBody } from "reactstrap";
import HotspotModel from "../../../../api/models/Hotspots";
import { Treebeard } from "react-treebeard";
import LayersModel from "../../../../api/models/LayersModel";
import { ResponsiveNetwork } from "@nivo/network";

const treebeardCustomTheme = require("./TreebeardCustomTheme");

class Layers extends DashboardAbstract {
    constructor(props) {
        super(props);
        this.state = {
            layersData: {},
            nodes: [],
            links: []
        };

        this.onToggle = this.onToggle.bind(this);
    }

    componentDidMount() {
        if (databaseCredentialsProvided) {
            let hotspotModel = new HotspotModel();
            hotspotModel.readHotspots("projectName").then(data => {
                this.setState({ layersData: data.hierarchicalData });
            });

            let layersModel = new LayersModel();
            layersModel.readLayers(this);
        }
    }

    onToggle(node, toggled) {
        if (this.state.cursor) {
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        this.setState({ cursor: node });
    }

    render() {
        console.log(this.state);

        if (this.state.nodes.length === 0) {
            return <p>Loading...</p>;
        }

        return (
            <div>
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
                                    data={this.state.layersData}
                                    onToggle={this.onToggle}
                                    style={treebeardCustomTheme.default}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" md="8">
                        <Card>
                            <CardBody>
                                <div className={"visualization-wrapper"}>
                                    <div style={{ height: "600px" }}>
                                        <ResponsiveNetwork
                                            nodes={this.state.nodes}
                                            links={this.state.links}
                                            repulsivity={100}
                                            iterations={120}
                                            nodeColor={t => {
                                                return t.color;
                                            }}
                                            nodeBorderWidth={2}
                                            nodeBorderColor={{
                                                from: "color",
                                                modifiers: [["darker", 1.2]]
                                            }}
                                            linkThickness={function(t) {
                                                return 2 * (2 - t.source.depth);
                                            }}
                                            motionStiffness={160}
                                            motionDamping={10}
                                        />
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
