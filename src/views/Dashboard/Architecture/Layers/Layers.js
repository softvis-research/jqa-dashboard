import React from "react";
import DashboardAbstract, {
    databaseCredentialsProvided
} from "../../AbstractDashboardComponent";
import { Row, Col, Card, CardBody } from "reactstrap";
import { ResponsiveBubble } from "@nivo/circle-packing";
import LayersModel from "../../../../api/models/LayersModel";
import { Treebeard } from "react-treebeard";

const treebeardCustomTheme = require("./TreebeardCustomTheme");

class Layers extends DashboardAbstract {
    constructor(props) {
        super(props);
        this.state = {
            visualizationData: {},
            treeData: {}
        };

        this.onToggle = this.onToggle.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();

        if (databaseCredentialsProvided) {
            const layersModel = new LayersModel();
            layersModel.readLayers(this);
        }
    }

    onToggle(node, toggled) {
        const { cursor, treeData } = this.state;
        if (cursor) {
            this.setState(() => ({ cursor, active: false }));
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        this.setState(() => ({
            cursor: node,
            treeData: Object.assign({}, treeData)
        }));
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CardBody>
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
                                                    data={this.state.treeData}
                                                    onToggle={this.onToggle}
                                                    style={
                                                        treebeardCustomTheme.default
                                                    }
                                                />
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col xs="12" sm="6" md="8">
                                        <Card>
                                            <CardBody>
                                                <div
                                                    style={{ height: "600px" }}
                                                >
                                                    <ResponsiveBubble
                                                        root={
                                                            this.state
                                                                .visualizationData
                                                        }
                                                        margin={{
                                                            top: 20,
                                                            right: 20,
                                                            bottom: 20,
                                                            left: 20
                                                        }}
                                                        identity="id"
                                                        value="loc"
                                                        colorBy={node => {
                                                            return node.color;
                                                        }}
                                                        animate={true}
                                                        enableLabel={false}
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

export default Layers;
