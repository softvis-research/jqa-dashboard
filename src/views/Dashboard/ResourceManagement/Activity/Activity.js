import React, { Component } from "react";
import DashboardAbstract from "../../AbstractDashboardComponent";
import CustomCardHeader from "../../CustomCardHeader/CustomCardHeader";
import CommitsPerAuthor from "./visualizations/CommitsPerAuthor";
import FilesPerAuthor from "./visualizations/FilesPerAuthor";
import CommitsTimescale from "./visualizations/CommitsTimescale";
import LatestCommits from "./visualizations/LatestCommits";
import { CypherEditor } from "graph-app-kit/components/Editor";

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

var AppDispatcher = require("../../../../AppDispatcher");

class PopoverItem extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false,
            infoText: {
                "Commits per author":
                    "The bar chart shows the number of commits for each author.",
                "Files per author":
                    "The bar chart shows the number of files for each author.",
                "Commits over time":
                    "The calendar shows the number of commits per day. The darker the color is, the more commits were made.",
                "Latest 20 commits":
                    "The table shows the author, the date, and the commit message of the latest 20 commits."
            }
        };
    }

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        return (
            <span>
                <button
                    className="mr-1"
                    color="secondary"
                    id={"Popover-" + this.props.id}
                    onClick={this.toggle}
                >
                    <i className="text-muted fa fa-question-circle" />
                </button>
                <Popover
                    placement={"bottom"}
                    isOpen={this.state.popoverOpen}
                    target={"Popover-" + this.props.id}
                    toggle={this.toggle}
                >
                    <PopoverHeader>{this.props.type}</PopoverHeader>
                    <PopoverBody>
                        {this.state.infoText[this.props.type]}
                    </PopoverBody>
                </Popover>
            </span>
        );
    }
}

class ResourceManagementActivity extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            queryCommitsPerAuthor: "",
            queryFilesPerAuthor: "",
            queryCommitsTimescale: ""
        };

        this.toggleInfo = this.toggleInfo.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();

        this.setState({
            queryCommitsPerAuthor: localStorage.getItem(
                "commits_per_author_expert_query"
            ),
            queryFilesPerAuthor: localStorage.getItem(
                "files_per_author_expert_query"
            ),
            queryCommitsTimescale: localStorage.getItem(
                "commits_timescale_expert_query"
            )
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    clearCommitsPerAuthor(event) {
        localStorage.setItem(
            "commits_per_author_expert_query",
            localStorage.getItem("commits_per_author_original_query")
        );
        this.sendQuery(this);
    }

    clearFilesPerAuthor(event) {
        localStorage.setItem(
            "files_per_author_expert_query",
            localStorage.getItem("files_per_author_original_query")
        );
        this.sendQuery(this);
    }

    clearCommitsTimescale(event) {
        localStorage.setItem(
            "commits_timescale_expert_query",
            localStorage.getItem("commits_timescale_original_query")
        );
        this.sendQuery(this);
    }

    sendQuery(event) {
        this.setState({
            queryCommitsPerAuthor: localStorage.getItem(
                "commits_per_author_expert_query"
            ),
            queryFilesPerAuthor: localStorage.getItem(
                "files_per_author_expert_query"
            ),
            queryCommitsTimescale: localStorage.getItem(
                "commits_timescale_expert_query"
            )
        });

        AppDispatcher.handleAction({
            actionType: "EXPERT_QUERY",
            data: {
                queryStringCommitsPerAuthor: localStorage.getItem(
                    "commits_per_author_expert_query"
                ),
                queryStringFilesPerAuthor: localStorage.getItem(
                    "files_per_author_expert_query"
                ),
                queryCommitsTimescale: localStorage.getItem(
                    "commits_timescale_expert_query"
                )
            }
        });
    }

    updateStateQueryCommitsPerAuthor(event) {
        localStorage.setItem("commits_per_author_expert_query", event);
    }

    updateStateQueryFilesPerAuthor(event) {
        localStorage.setItem("files_per_author_expert_query", event);
    }

    updateStateQueryCommitsTimescale(event) {
        localStorage.setItem("commits_timescale_expert_query", event);
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
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="6" md="6">
                        <Card>
                            <CustomCardHeader
                                cardHeaderText={"Commits per author"}
                                showExpertMode={true}
                                placement={"bottom"}
                                target={"Popover1"}
                                popoverHeaderText={"Commits per author"}
                                popoverBody={
                                    "The bar chart shows the number of commits for each author."
                                }
                            />
                            <CardBody>
                                <div
                                    className={
                                        "expert-mode-editor hide-expert-mode commits-per-author"
                                    }
                                >
                                    <CypherEditor
                                        className="cypheredit"
                                        value={this.state.queryCommitsPerAuthor}
                                        options={{
                                            mode: "cypher",
                                            theme: "cypher"
                                        }}
                                        onValueChange={this.updateStateQueryCommitsPerAuthor.bind(
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
                                        onClick={this.clearCommitsPerAuthor.bind(
                                            this
                                        )}
                                        className="btn btn-success send-query float-right margin-right"
                                        color="danger"
                                        id="reset"
                                    >
                                        Reset
                                    </Button>
                                </div>
                                <CommitsPerAuthor />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" md="6">
                        <Card>
                            <CustomCardHeader
                                cardHeaderText={"Files per author"}
                                showExpertMode={true}
                                placement={"bottom"}
                                target={"Popover2"}
                                popoverHeaderText={"Files per author"}
                                popoverBody={
                                    "The bar chart shows the number of files for each author."
                                }
                            />
                            <CardBody>
                                <div
                                    className={
                                        "expert-mode-editor hide-expert-mode files-per-author"
                                    }
                                >
                                    <CypherEditor
                                        className="cypheredit"
                                        value={this.state.queryFilesPerAuthor}
                                        options={{
                                            mode: "cypher",
                                            theme: "cypher"
                                        }}
                                        onValueChange={this.updateStateQueryFilesPerAuthor.bind(
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
                                        onClick={this.clearFilesPerAuthor.bind(
                                            this
                                        )}
                                        className="btn btn-success send-query float-right margin-right"
                                        color="danger"
                                        id="reset"
                                    >
                                        Reset
                                    </Button>
                                </div>
                                <FilesPerAuthor />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="12" md="6">
                        <Card className="commit-calendar">
                            <CustomCardHeader
                                cardHeaderText={"Commits over time"}
                                showExpertMode={true}
                                placement={"bottom"}
                                target={"Popover3"}
                                popoverHeaderText={"Commits over time"}
                                popoverBody={
                                    "The calendar shows the number of commits per day. The darker the color is, the more commits were made."
                                }
                            />
                            <CardBody>
                                <div
                                    className={
                                        "expert-mode-editor hide-expert-mode commits-over-time"
                                    }
                                >
                                    <CypherEditor
                                        className="cypheredit"
                                        value={this.state.queryCommitsTimescale}
                                        options={{
                                            mode: "cypher",
                                            theme: "cypher"
                                        }}
                                        onValueChange={this.updateStateQueryCommitsTimescale.bind(
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
                                        onClick={this.clearCommitsTimescale.bind(
                                            this
                                        )}
                                        className="btn btn-success send-query float-right margin-right"
                                        color="danger"
                                        id="reset"
                                    >
                                        Reset
                                    </Button>
                                </div>
                                <CommitsTimescale />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="12" md="6">
                        <Card>
                            <CardHeader>
                                Latest 20 commits
                                <div className="card-actions">
                                    <PopoverItem
                                        key={"Latest20commits"}
                                        type={"Latest 20 commits"}
                                        id={"Latest20commits"}
                                    />
                                </div>
                            </CardHeader>
                            <CardBody>
                                <LatestCommits />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ResourceManagementActivity;
