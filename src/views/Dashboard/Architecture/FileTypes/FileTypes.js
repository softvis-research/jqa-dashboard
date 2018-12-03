import React from "react";
import DashboardAbstract from "../../AbstractDashboardComponent";
import CustomCardHeader from "../../CustomCardHeader/CustomCardHeader";
import FileType from "./visualizations/FileType";
import { CypherEditor } from "graph-app-kit/components/Editor";
import { Button, Row, Col, Card, CardBody } from "reactstrap";

var AppDispatcher = require("../../../../AppDispatcher");

class ArchitectureFileTypes extends DashboardAbstract {
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
            query: localStorage.getItem("filetype_expert_query")
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    clear(event) {
        localStorage.setItem(
            "filetype_expert_query",
            localStorage.getItem("filetype_original_query")
        );
        this.sendQuery(this);
    }

    sendQuery(event) {
        this.setState({
            query: localStorage.getItem("filetype_expert_query")
        });

        AppDispatcher.handleAction({
            actionType: "EXPERT_QUERY",
            data: {
                queryString: localStorage.getItem("filetype_expert_query")
            }
        });
    }

    updateStateQuery(event) {
        localStorage.setItem("filetype_expert_query", event);
    }

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
            return redirect;
        }

        return (
            <div>
                {redirect}
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CustomCardHeader
                                cardHeaderText={"Number of files per file type"}
                                showExpertMode={true}
                                placement={"bottom"}
                                target={"Popover1"}
                                popoverHeaderText={
                                    "Number of files per file type"
                                }
                                popoverBody={
                                    "The pie chart shows all file types of the project with the number of corresponding files."
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
                                <FileType />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ArchitectureFileTypes;
