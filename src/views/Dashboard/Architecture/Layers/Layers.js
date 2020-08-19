import React from "react";
import DashboardAbstract, {
    databaseCredentialsProvided
} from "../../AbstractDashboardComponent";
import { Row, Col, Card, CardBody } from "reactstrap";
import { ResponsiveBubbleHtml } from "@nivo/circle-packing";
import LayersModel from "../../../../api/models/LayersModel";
import { Treebeard, decorators } from "react-treebeard";
import CustomHeader from "./CustomHeader";

const treebeardCustomTheme = require("./TreebeardCustomTheme");

class Layers extends DashboardAbstract {
    constructor(props) {
        super(props);
        this.state = {
            visualizationData: {},
            treeData: {},
            dependencies: []
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
        if (this.state.cursor) {
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        this.setState(() => ({
            cursor: node
        }));
    }

    render() {
        if (!this.state.visualizationData.name) {
            return "Loading...";
        }

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
                                                    decorators={{
                                                        ...decorators,
                                                        Header: CustomHeader
                                                    }}
                                                />
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col xs="12" sm="6" md="8">
                                        <Card>
                                            <CardBody>
                                                <div
                                                    className={
                                                        "structure-component"
                                                    }
                                                    style={{ height: "600px" }}
                                                >
                                                    <ResponsiveBubbleHtml
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
                                                        borderWidth={2}
                                                        tooltip={({ id }) => (
                                                            <div>
                                                                <span>
                                                                    {id}
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
        );
    }
}

export default Layers;
