import React from "react";

import DashboardAbstract from "../../AbstractDashboardComponent";
import CustomCardHeader from "../../CustomCardHeader/CustomCardHeader";
import FilesPerFiletypePerAuthor from "./visualizations/FilesPerFiletypePerAuthor";
import { CypherEditor } from "graph-app-kit/components/Editor";
import { Button, Row, Col, Card, CardBody } from "reactstrap";

var AppDispatcher = require("../../../../AppDispatcher");

class ResourceManagementKnowledgeDistribution extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            query: ""
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.setState({
            query: localStorage.getItem("knowledge_distribution_expert_query")
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    clear(event) {
        localStorage.setItem(
            "knowledge_distribution_expert_query",
            localStorage.getItem("knowledge_distribution_original_query")
        );
        this.sendQuery(this);
    }

    sendQuery(event) {
        this.setState({
            query: localStorage.getItem("knowledge_distribution_expert_query")
        });

        AppDispatcher.handleAction({
            actionType: "EXPERT_QUERY",
            data: {
                queryString: localStorage.getItem(
                    "knowledge_distribution_expert_query"
                )
            }
        });
    }

    updateStateQuery(event) {
        localStorage.setItem("knowledge_distribution_expert_query", event);
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
                                cardHeaderText={
                                    "Number of files per file type per author"
                                }
                                showExpertMode={true}
                                placement={"bottom"}
                                target={"Popover1"}
                                popoverHeaderText={
                                    "Number of files per file type per author"
                                }
                                popoverBody={
                                    "The stacked bar chart shows the number of files per file type each author has added to the repository."
                                }
                            />
                            <CardBody>
                                <div
                                    className={
                                        "expert-mode-editor hide-expert-mode knowledge-distribution"
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
                                <FilesPerFiletypePerAuthor />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ResourceManagementKnowledgeDistribution;
