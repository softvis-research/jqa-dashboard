import React from "react";
import DashboardAbstract from "../../AbstractDashboardComponent";
import CustomCardHeader from "../../CustomCardHeader/CustomCardHeader";
import DependencyChord from "./visualizations/DependencyChord";
import { CypherEditor } from "graph-app-kit/components/Editor";
import { Button, Row, Col, Card, CardBody } from "reactstrap";

var AppDispatcher = require("../../../../AppDispatcher");

class ArchitectureDependencies extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            query: ""
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.setState({
            query: localStorage.getItem("dependencies_expert_query")
        });
    }

    clear(event) {
        localStorage.setItem(
            "dependencies_expert_query",
            localStorage.getItem("dependencies_original_query")
        );
        this.sendQuery(this);
    }

    sendQuery(event) {
        this.setState({
            query: localStorage.getItem("dependencies_expert_query")
        });

        AppDispatcher.handleAction({
            actionType: "EXPERT_QUERY",
            data: {
                queryString: localStorage.getItem("dependencies_expert_query")
            }
        });
    }

    updateStateQuery(event) {
        localStorage.setItem("dependencies_expert_query", event);
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
                                cardHeaderText={"Dependencies"}
                                showExpertMode={true}
                                placement={"bottom"}
                                target={"Popover1"}
                                popoverHeaderText={"Dependencies"}
                                popoverBody={
                                    "The dependency analysis view helps to assess the coupling and cohesion of a software system. Packages are arranged radially around a circle and the dependencies are drawn as arcs."
                                }
                            />
                            <CardBody>
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
                                        onClick={this.sendQuery.bind(this)}
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
