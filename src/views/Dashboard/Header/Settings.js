import React from "react";
import DashboardAbstract, {
    databaseCredentialsProvided,
    GenericException
} from "../AbstractDashboardComponent";

import {
    Alert,
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    Button,
    Form,
    FormGroup,
    FormText,
    Label,
    Input,
    Popover,
    PopoverBody,
    PopoverHeader
} from "reactstrap";

const IDENTIFIER_PROJECT_NAME = "projectName";
const IDENTIFIER_CONNECTION_STRING = "connectionString";
const IDENTIFIER_NEO4J_USERNAME = "username";
const IDENTIFIER_NEO4J_PASSWORD = "password";
const IDENTIFIER_LIMIT_COUNTING_HOTSPOTS = "limitCountingHotspots";

var AppDispatcher = require("../../../AppDispatcher");
var localStorageConnectionString = localStorage.getItem(
    IDENTIFIER_CONNECTION_STRING
);
var localStorageNeo4jUsername = localStorage.getItem(IDENTIFIER_NEO4J_USERNAME);
var localStorageNeo4jPassword = localStorage.getItem(IDENTIFIER_NEO4J_PASSWORD);
var localStorageProjectName = localStorage.getItem(IDENTIFIER_PROJECT_NAME);
var localStorageLimitCountingHotspots = localStorage.getItem(
    IDENTIFIER_LIMIT_COUNTING_HOTSPOTS
);

function handleDatabaseError(error) {
    console.log(error);
    localStorage.setItem("connectionString", ""); //reset connection string to prevent further access
    document.getElementById("database-settings-alert").innerHTML =
        "Connection failure: please check the provided data and if the server is running.";
    document.getElementById("database-settings-alert").className =
        "float-right settings-alert alert alert-danger fade show";
    document.getElementById("database-settings-alert").style.display = "block";
}

class Settings extends DashboardAbstract {
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

        this.updateSettings = this.updateSettings.bind(this);
        this.resetSettings = this.resetSettings.bind(this);
        this.toggleInfo = this.toggleInfo.bind(this);
    }

    componentWillMount() {
        this.handleAction = this.handleAction.bind(this);
        this.setState({
            dispatcherEventId: AppDispatcher.register(this.handleAction)
        });
    }

    componentDidMount() {
        //super.componentDidMount(); //do nothing, we don't need a database here
    }

    componentWillUnmount() {
        AppDispatcher.unregister(this.state.dispatcherEventId);
    }

    refreshConnectionSettingsWrapper() {
        //wrapper because it is not possible to access thisBackup.super.function...
        super.refreshConnectionSettings();
    }

    updateSettings(event) {
        var settings = document.querySelectorAll(".setting");

        // save settings to localStorage
        [].forEach.call(settings, function(setting) {
            var identifier = setting.id.replace("-input", "");
            localStorage.setItem(identifier, setting.value);
        });

        try {
            DashboardAbstract.checkForDatabaseConnection();

            if (!databaseCredentialsProvided) {
                throw new GenericException(
                    "Database connection parameter missing.",
                    "DatabaseConncetionException"
                );
            }

            super
                .testDatabaseCredentials()
                .then(function() {
                    // show success message
                    document.getElementById(
                        "database-settings-alert"
                    ).innerHTML = "Successfully saved settings.";
                    document.getElementById(
                        "database-settings-alert"
                    ).className =
                        "float-right settings-alert alert alert-success fade show";
                    document.getElementById(
                        "database-settings-alert"
                    ).style.display = "block";
                })
                .catch(handleDatabaseError); //check database connection
        } catch (e) {
            //handle missing credentials
            handleDatabaseError(e);
        }
    }

    resetSettings(event) {
        var settings = document.querySelectorAll(".setting");

        // clear inputs
        [].forEach.call(settings, function(setting) {
            var identifier = setting.id.replace("-input", "");

            switch (identifier) {
                case "connectionString":
                    setting.value =
                        process.env.REACT_APP_NEO4J_URL || "localhost";
                    break;
                case "username":
                    setting.value =
                        process.env.REACT_APP_NEO4J_USERNAME || "neo4j";
                    break;
                case "password":
                    setting.value =
                        process.env.REACT_APP_NEO4J_PASSWORD || "neo4j";
                    break;
                case "projectName":
                    setting.value =
                        process.env.REACT_APP_PROJECT_NAME || "My project";
                    break;
                case "limitCountingHotspots":
                    setting.value =
                        process.env.REACT_APP_LIMIT_COUNTING_HOTSPOTS || 70;
                    break;
                default:
            }

            localStorage.removeItem(identifier);
        });

        // if database credentials are provided via .env file, we load them now
        if (
            typeof process.env.REACT_APP_NEO4J_URL !== "undefined" &&
            typeof process.env.REACT_APP_NEO4J_USERNAME !== "undefined" &&
            typeof process.env.REACT_APP_NEO4J_PASSWORD !== "undefined"
        ) {
            localStorage.setItem(
                "connectionString",
                process.env.REACT_APP_NEO4J_URL
            );
            localStorage.setItem(
                "username",
                process.env.REACT_APP_NEO4J_USERNAME
            );
            localStorage.setItem(
                "password",
                process.env.REACT_APP_NEO4J_PASSWORD
            );

            var projectName = "My project";
            if (typeof process.env.REACT_APP_PROJECT_NAME !== "undefined") {
                projectName = process.env.REACT_APP_PROJECT_NAME;
            }
            localStorage.setItem("projectName", projectName);

            var limitCountingHotspots = "70";
            if (
                typeof process.env.REACT_APP_LIMIT_COUNTING_HOTSPOTS !==
                "undefined"
            ) {
                limitCountingHotspots =
                    process.env.REACT_APP_LIMIT_COUNTING_HOTSPOTS;
            }
            localStorage.setItem(
                "limitCountingHotspots",
                limitCountingHotspots
            );
        }
    }

    toggleInfo() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        // redefine variables to fix default values when toggling different pages
        localStorageConnectionString = localStorage.getItem(
            IDENTIFIER_CONNECTION_STRING
        );
        localStorageNeo4jUsername = localStorage.getItem(
            IDENTIFIER_NEO4J_USERNAME
        );
        localStorageNeo4jPassword = localStorage.getItem(
            IDENTIFIER_NEO4J_PASSWORD
        );
        localStorageProjectName = localStorage.getItem(IDENTIFIER_PROJECT_NAME);
        localStorageLimitCountingHotspots = localStorage.getItem(
            IDENTIFIER_LIMIT_COUNTING_HOTSPOTS
        );

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" md="6">
                        <Card>
                            <CardHeader>
                                Settings
                                <div className="card-actions">
                                    <button
                                        onClick={this.toggleInfo}
                                        id="Popover2"
                                    >
                                        <i className="text-muted fa fa-question-circle" />
                                    </button>
                                    <Popover
                                        placement="bottom"
                                        isOpen={this.state.popoverOpen}
                                        target="Popover2"
                                        toggle={this.toggleInfo}
                                    >
                                        <PopoverHeader>Settings</PopoverHeader>
                                        <PopoverBody>
                                            Please enter the required connection
                                            details of the Neo4j database and
                                            the name of your project. Confirm
                                            your entries by clicking on "Save".
                                        </PopoverBody>
                                    </Popover>
                                </div>
                            </CardHeader>
                            <CardBody className={"settings"}>
                                <Form
                                    action=""
                                    method="post"
                                    encType="multipart/form-data"
                                    className="form-horizontal"
                                >
                                    <FormGroup row>
                                        <Col md="12">
                                            <strong>Database</strong>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label
                                                htmlFor={
                                                    IDENTIFIER_CONNECTION_STRING +
                                                    "-input"
                                                }
                                            >
                                                URL
                                            </Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input
                                                type="text"
                                                id={
                                                    IDENTIFIER_CONNECTION_STRING +
                                                    "-input"
                                                }
                                                name={
                                                    IDENTIFIER_CONNECTION_STRING +
                                                    "-input"
                                                }
                                                className={"setting"}
                                                placeholder="Please provide Neo4j connection string..."
                                                defaultValue={
                                                    localStorageConnectionString !==
                                                        null &&
                                                    localStorageConnectionString !==
                                                        ""
                                                        ? localStorageConnectionString
                                                        : "localhost"
                                                }
                                                required
                                            />
                                            <FormText color="muted">
                                                Since the dashboard uses the
                                                Bolt protocol, the prefix
                                                "bolt://" is automatically added
                                                to the entered URL.
                                                <br />
                                                Default: "localhost"
                                            </FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label
                                                htmlFor={
                                                    IDENTIFIER_NEO4J_USERNAME +
                                                    "-input"
                                                }
                                            >
                                                Username
                                            </Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input
                                                type="text"
                                                id={
                                                    IDENTIFIER_NEO4J_USERNAME +
                                                    "-input"
                                                }
                                                name={
                                                    IDENTIFIER_NEO4J_USERNAME +
                                                    "-input"
                                                }
                                                className={"setting"}
                                                placeholder="Please provide Neo4j username..."
                                                defaultValue={
                                                    localStorageNeo4jUsername !==
                                                        null &&
                                                    localStorageNeo4jUsername !==
                                                        ""
                                                        ? localStorageNeo4jUsername
                                                        : "neo4j"
                                                }
                                                required
                                            />
                                            <FormText className="help-block">
                                                Default: "neo4j"
                                            </FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label
                                                htmlFor={
                                                    IDENTIFIER_NEO4J_PASSWORD +
                                                    "-input"
                                                }
                                            >
                                                Password
                                            </Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input
                                                type="password"
                                                id={
                                                    IDENTIFIER_NEO4J_PASSWORD +
                                                    "-input"
                                                }
                                                name={
                                                    IDENTIFIER_NEO4J_PASSWORD +
                                                    "-input"
                                                }
                                                className={"setting"}
                                                placeholder="Please provide Neo4j password..."
                                                defaultValue={
                                                    localStorageNeo4jPassword !==
                                                        null &&
                                                    localStorageNeo4jPassword !==
                                                        ""
                                                        ? localStorageNeo4jPassword
                                                        : "neo4j"
                                                }
                                                required
                                            />
                                            <FormText className="help-block">
                                                Default: "neo4j"
                                            </FormText>
                                        </Col>
                                    </FormGroup>
                                    <hr />
                                    <FormGroup row>
                                        <Col md="12">
                                            <strong>Project</strong>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label
                                                htmlFor={
                                                    IDENTIFIER_PROJECT_NAME +
                                                    "-input"
                                                }
                                            >
                                                Name
                                            </Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input
                                                type="text"
                                                id={
                                                    IDENTIFIER_PROJECT_NAME +
                                                    "-input"
                                                }
                                                name={
                                                    IDENTIFIER_PROJECT_NAME +
                                                    "-input"
                                                }
                                                className={"setting"}
                                                placeholder="Please provide project name..."
                                                defaultValue={
                                                    localStorageProjectName !==
                                                        null &&
                                                    localStorageProjectName !==
                                                        ""
                                                        ? localStorageProjectName
                                                        : "My project"
                                                }
                                                required
                                            />
                                            <FormText color="muted">
                                                Example: "jUnit"
                                            </FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label
                                                htmlFor={
                                                    IDENTIFIER_LIMIT_COUNTING_HOTSPOTS +
                                                    "-input"
                                                }
                                            >
                                                Commit hotspot threshold [%]
                                            </Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input
                                                type="text"
                                                id={
                                                    IDENTIFIER_LIMIT_COUNTING_HOTSPOTS +
                                                    "-input"
                                                }
                                                name={
                                                    IDENTIFIER_LIMIT_COUNTING_HOTSPOTS +
                                                    "-input"
                                                }
                                                className={"setting"}
                                                placeholder="Please provide percentage limit for counting hotspots..."
                                                defaultValue={
                                                    localStorageLimitCountingHotspots !==
                                                        null &&
                                                    localStorageLimitCountingHotspots !==
                                                        ""
                                                        ? localStorageLimitCountingHotspots
                                                        : "70"
                                                }
                                                required
                                            />
                                            <FormText color="muted">
                                                Lower limit of the percentage
                                                commit count of a resource from
                                                the maximum commit count to
                                                identify a resource as a
                                                hotspot. Default: "70"
                                            </FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row className="button-row">
                                        <Col xs="12" md="12">
                                            <Button
                                                className="float-right"
                                                color="success"
                                                onClick={this.updateSettings}
                                                id="save"
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                className="float-right margin-right"
                                                color="danger"
                                                onClick={this.resetSettings}
                                                id="reset"
                                            >
                                                Set to default
                                            </Button>
                                            <Alert
                                                id="database-settings-alert"
                                                className="float-right settings-alert"
                                                color="success"
                                            >
                                                Successfully saved settings.
                                            </Alert>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Settings;
