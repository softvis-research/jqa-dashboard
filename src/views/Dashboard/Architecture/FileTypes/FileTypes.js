import React from "react";

import DashboardAbstract from "../../AbstractDashboardComponent";
import FileType from "./visualizations/FileType";
import { CypherEditor } from "graph-app-kit/components/Editor";
import { AppSwitch } from "@coreui/react";
import {
    Button,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Popover,
    PopoverHeader,
    PopoverBody
} from "reactstrap";
import $ from "jquery";

var AppDispatcher = require("../../../../AppDispatcher");

class ArchitectureFileTypes extends DashboardAbstract {
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

    componentWillMount() {
        super.componentWillMount();
    }

    componentDidMount() {
        super.componentDidMount();

        $(".expert-mode").on("change", function() {
            var editor = $(".expert-mode-editor");
            if (editor.css("opacity") === "0") {
                editor.css("opacity", "1");
            } else {
                editor.css("opacity", "0");
            }
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    clear(event) {
        this.setState({
            query: ""
        });
    }

    sendQuery(event) {
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
                {redirect}
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CardHeader>
                                Number of files per file type
                                <div className="card-actions">
                                    <div className={"float-left"}>
                                        <div
                                            className={
                                                "float-left expert-label"
                                            }
                                        >
                                            Expert mode
                                        </div>
                                        <AppSwitch
                                            className={
                                                "mx-1 float-right display-block expert-mode"
                                            }
                                            color={"secondary"}
                                            size={"sm"}
                                        />
                                    </div>

                                    <button
                                        onClick={this.toggleInfo}
                                        id="Popover1"
                                    >
                                        <i className="text-muted fa fa-question-circle" />
                                    </button>
                                    <Popover
                                        placement="bottom"
                                        isOpen={this.state.popoverOpen}
                                        target="Popover1"
                                        toggle={this.toggleInfo}
                                    >
                                        <PopoverHeader>
                                            Number of files per file type
                                        </PopoverHeader>
                                        <PopoverBody>
                                            The pie chart shows all file types
                                            of the project with the number of
                                            corresponding files.
                                        </PopoverBody>
                                    </Popover>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div
                                    className={"expert-mode-editor"}
                                    style={{ opacity: "0" }}
                                >
                                    <CypherEditor
                                        className="cypheredit"
                                        value={localStorage.getItem(
                                            "filetype_expert_query"
                                        )}
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
