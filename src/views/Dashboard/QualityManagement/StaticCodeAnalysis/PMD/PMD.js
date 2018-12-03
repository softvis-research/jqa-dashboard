import React, { Component } from "react";
import DashboardAbstract, {
    databaseCredentialsProvided
} from "../../../AbstractDashboardComponent";
import CustomCardHeader from "../../../CustomCardHeader/CustomCardHeader";
import { CypherEditor } from "graph-app-kit/components/Editor";
import {
    Alert,
    Button,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Popover,
    PopoverHeader,
    PopoverBody,
    Tooltip
} from "reactstrap";
import PMDModel from "../../../../../api/models/PMD";
import PmdRadar from "./visualization/PmdRadar";

//eslint-disable-next-line
import SimpleBar from "simplebar";

var arraySort = require("array-sort");
var convert = require("object-array-converter");
var AppDispatcher = require("../../../../../AppDispatcher");

class PopoverItem extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            tooltipOpen: [false, false],
            popoverOpen: false,
            infoText: {
                "Best Practices":
                    "Rules which enforce generally accepted best practices.",
                "Code Style": "Rules which enforce a specific coding style.",
                Design: "Rules that help you discover design issues.",
                Documentation: "Rules that are related to code documentation.",
                "Error Prone":
                    "Rules to detect constructs that are either broken, extremely confusing or prone to runtime errors.",
                Multithreading:
                    "Rules that flag issues when dealing with multiple threads of execution.",
                Performance: "Rules that flag suboptimal code."
            }
        };
    }

    toggleTooltip(i) {
        const newArray = this.state.tooltipOpen.map((element, index) => {
            return index === i ? !element : false;
        });
        this.setState({
            tooltipOpen: newArray
        });
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
                <Tooltip
                    placement="top"
                    isOpen={this.state.tooltipOpen[1]}
                    target={"Popover-" + this.props.id}
                    toggle={() => {
                        this.toggleTooltip(1);
                    }}
                >
                    Show details
                </Tooltip>
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

class QualityManagementStaticCodeAnalysisPMD extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            query: "",
            pmdData: {
                loading: [] //indicator for no data
            },
            alertColors: ["worstcase", "danger", "warning", "info", "secondary"]
        };

        this.toggleInfo = this.toggleInfo.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
    }

    componentDidMount() {
        super.componentDidMount();
        if (databaseCredentialsProvided) {
            var pmdModel = new PMDModel();
            pmdModel.readPmdData(this);
        }

        this.setState({
            query: localStorage.getItem("pmd_expert_query")
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    clear(event) {
        localStorage.setItem(
            "pmd_expert_query",
            localStorage.getItem("pmd_original_query")
        );
        this.sendQuery(this);
    }

    sendQuery(event) {
        this.setState({
            query: localStorage.getItem("pmd_expert_query")
        });

        AppDispatcher.handleAction({
            actionType: "EXPERT_QUERY",
            data: {
                queryString: localStorage.getItem("pmd_expert_query")
            }
        });
    }

    updateStateQuery(event) {
        localStorage.setItem("pmd_expert_query", event);
    }

    toggleInfo() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    handleAction(event) {
        var action = event.action;
        switch (action.actionType) {
            case "EXPERT_QUERY":
                if (databaseCredentialsProvided) {
                    // clear pmd data to prevent multiple rendering errors
                    this.setState({
                        pmdData: ""
                    });

                    var pmdModel = new PMDModel();
                    pmdModel.readPmdData(this);
                }
                break;
            default:
                return true;
        }
    }

    render() {
        var redirect = super.render();

        if (redirect.length > 0) {
            return redirect;
        }

        if (this.state.pmdData.loading) {
            return "";
        }

        var categoryData = [];

        Object.keys(this.state.pmdData).map(function(key, i) {
            var violation = {};
            violation[key] = this.state.pmdData[key];
            violation.violations = this.state.pmdData[key]
                ? this.state.pmdData[key].length
                : 0;
            return categoryData.push(violation);
        }, this);

        categoryData = arraySort(categoryData, "violations", { reverse: true });
        categoryData = convert.toObject(categoryData);

        //special case: instead of fetching data inside of pmdRadar we need to inject it here because they are also needed below
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12" md="12" key={"pmd-radar"}>
                        <Card className={"radar-card"}>
                            <CustomCardHeader
                                cardHeaderText={"Static Code Analysis (PMD)"}
                                showExpertMode={true}
                                placement={"bottom"}
                                target={"Popover1"}
                                popoverHeaderText={"Static Code Analysis PMD"}
                                popoverBody={
                                    "The radar chart shows the number of violations in the categories best practices, code style, design, documentation, error-proneness, multithreading, and performance. The violations are detailed in the boxes below and colored according to their priority."
                                }
                            />
                            <CardBody style={{ overflow: "hidden" }}>
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
                                <PmdRadar data={this.state.pmdData} />
                            </CardBody>
                        </Card>
                    </Col>

                    {Object.keys(categoryData).map(function(key, i) {
                        var categoryName = Object.keys(categoryData[key])[0];
                        return (
                            <Col xs="12" sm="6" md="6" key={categoryName + i}>
                                <Card className={"pmd-card"}>
                                    <CardHeader>
                                        {categoryName} (
                                        {
                                            this.state.pmdData[categoryName]
                                                .length
                                        }
                                        )
                                        <div className="card-actions">
                                            <PopoverItem
                                                key={i}
                                                type={categoryName}
                                                id={i}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardBody
                                        data-simplebar
                                        style={{
                                            height: "549px",
                                            overflow: "hidden"
                                        }}
                                    >
                                        {Object.keys(
                                            this.state.pmdData[categoryName]
                                        ).map(function(violationItem, i) {
                                            var violation = this.state.pmdData[
                                                categoryName
                                            ][violationItem];

                                            return (
                                                <Alert
                                                    color={
                                                        this.state.alertColors[
                                                            violation.priority -
                                                                1
                                                        ]
                                                    }
                                                    key={violation.fqn + i}
                                                >
                                                    <Row>
                                                        <Col
                                                            xs="12"
                                                            sm="12"
                                                            md="12"
                                                        >
                                                            <div className="float-right">
                                                                <label>
                                                                    Priority:
                                                                </label>
                                                                <span>
                                                                    {
                                                                        violation.priority
                                                                    }
                                                                </span>
                                                            </div>
                                                            <strong className="violation-message">
                                                                {
                                                                    violation.message
                                                                }{" "}
                                                                <a
                                                                    target="_blank"
                                                                    href={
                                                                        violation.externalInfoUrl
                                                                    }
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    [Explanation]
                                                                </a>
                                                            </strong>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col
                                                            xs="12"
                                                            sm="12"
                                                            md="12"
                                                        >
                                                            <label className="equal-width">
                                                                Fqn:
                                                            </label>
                                                            <span>
                                                                {violation.fqn}
                                                            </span>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col
                                                            xs="12"
                                                            sm="12"
                                                            md="12"
                                                        >
                                                            <label className="equal-width">
                                                                Package:
                                                            </label>
                                                            <span>
                                                                {
                                                                    violation.package
                                                                }
                                                            </span>
                                                        </Col>
                                                    </Row>
                                                    <Row className="class-method">
                                                        <Col
                                                            xs="12"
                                                            sm="6"
                                                            md="6"
                                                        >
                                                            <label className="equal-width">
                                                                {violation.className
                                                                    ? "Class:"
                                                                    : ""}
                                                            </label>
                                                            <span>
                                                                {
                                                                    violation.className
                                                                }
                                                            </span>
                                                        </Col>
                                                        <Col
                                                            xs="12"
                                                            sm="6"
                                                            md="6"
                                                        >
                                                            <label>
                                                                {violation.method
                                                                    ? "Method:"
                                                                    : ""}
                                                            </label>
                                                            <span>
                                                                {
                                                                    violation.method
                                                                }
                                                            </span>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col
                                                            xs="12"
                                                            sm="6"
                                                            md="3"
                                                        >
                                                            <label className="equal-width">
                                                                Begin line:
                                                            </label>
                                                            <span>
                                                                {
                                                                    violation.beginLine
                                                                }
                                                            </span>
                                                        </Col>
                                                        <Col
                                                            xs="12"
                                                            sm="6"
                                                            md="3"
                                                        >
                                                            <label>
                                                                End line:
                                                            </label>
                                                            <span>
                                                                {
                                                                    violation.endLine
                                                                }
                                                            </span>
                                                        </Col>
                                                        <Col
                                                            xs="12"
                                                            sm="6"
                                                            md="3"
                                                        >
                                                            <label>
                                                                Begin column:
                                                            </label>
                                                            <span>
                                                                {
                                                                    violation.beginColumn
                                                                }
                                                            </span>
                                                        </Col>
                                                        <Col
                                                            xs="12"
                                                            sm="6"
                                                            md="3"
                                                        >
                                                            <label>
                                                                End column:
                                                            </label>
                                                            <span>
                                                                {
                                                                    violation.endColumn
                                                                }
                                                            </span>
                                                        </Col>
                                                    </Row>
                                                </Alert>
                                            );
                                        }, this)}
                                    </CardBody>
                                </Card>
                            </Col>
                        );
                    }, this)}
                </Row>
            </div>
        );
    }
}

export default QualityManagementStaticCodeAnalysisPMD;
