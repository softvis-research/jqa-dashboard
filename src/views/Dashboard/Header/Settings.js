import React from 'react';
import DashboardAbstract, { databaseCredentialsProvided, GenericException } from '../AbstractDashboardComponent';

import {
    Alert,
    Row,
    Col,
    Button,
    Form,
    FormGroup,
    FormText,
    Label,
    Input,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

import classnames from 'classnames';

var IDENTIFIER_PROJECT_NAME = "projectName";
var IDENTIFIER_CONNECTION_STRING = "connectionString";
var IDENTIFIER_NEO4J_USERNAME = "username";
var IDENTIFIER_NEO4J_PASSWORD = "password";

function handleDatabaseError(error) {
    console.log(error);
    localStorage.setItem('connectionString', ''); //reset connection string to prevent further access
    document.getElementById('database-settings-alert').innerHTML = 'Connection failure: please check the provided data and if the server is running.';
    document.getElementById('database-settings-alert').className = 'float-right settings-alert alert alert-danger fade show';
    document.getElementById('database-settings-alert').style.display = 'block';
}

class Settings extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1'
        };

        this.updateSettings = this.updateSettings.bind(this);
        this.resetSettings = this.resetSettings.bind(this);
    }

    componentDidMount() {
        //super.componentDidMount(); //do nothing, we don't need a database here
    }

    componentWillUnmount() {
        //super.componentWillUnmount(); //do nothing, we don't have a database here
    }

    refreshConnectionSettingsWrapper() { //wrapper because it is not possible to access thisBackup.super.function...
        super.refreshConnectionSettings();
    }

    updateSettings(event) {
        var settings = document.querySelectorAll('.setting');

        // save settings to localStorage
        [].forEach.call(settings, function(setting) {
            var identifier = setting.id.replace('-input', '');
            localStorage.setItem(identifier, setting.value);
        });

        try {
            DashboardAbstract.checkForDatabaseConnection();

            if (!databaseCredentialsProvided) {
                throw new GenericException("Database connection parameter missing.", "DatabaseConncetionException");
            }

            super.testDatabaseCredentials()
            .then(function() {
                // show success message
                document.getElementById('database-settings-alert').innerHTML = 'Successfully saved settings.';
                document.getElementById('database-settings-alert').className = 'float-right settings-alert alert alert-success fade show';
                document.getElementById('database-settings-alert').style.display = 'block';
            })
            .catch( handleDatabaseError ); //check database connection
        } catch(e) { //handle missing credentials
            handleDatabaseError(e);
        }
    }

    resetSettings(event) {
        var settings = document.querySelectorAll('.setting');

        // clear inputs
        [].forEach.call(settings, function(setting) {
            setting.value = '';
            var identifier = setting.id.replace('-input', '');
            localStorage.removeItem(identifier);
        });

    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" md="6">
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '1' })}
                                    onClick={() => { this.toggle('1'); }}
                                >
                                    Database
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor={IDENTIFIER_CONNECTION_STRING + "-input"}>URL</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input
                                                type="text"
                                                id={IDENTIFIER_CONNECTION_STRING + "-input"}
                                                name={IDENTIFIER_CONNECTION_STRING + "-input"}
                                                className={'setting'}
                                                placeholder="Please provide Neo4j connection string..."
                                                defaultValue={ localStorage.getItem(IDENTIFIER_CONNECTION_STRING) }
                                                required
                                            />
                                            <FormText color="muted">Default: "bolt://localhost"</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor={IDENTIFIER_NEO4J_USERNAME + "-input"}>Username</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input
                                                type="text"
                                                id={IDENTIFIER_NEO4J_USERNAME + "-input"}
                                                name={IDENTIFIER_NEO4J_USERNAME + "-input"}
                                                className={'setting'}
                                                placeholder="Please provide Neo4j username..."
                                                defaultValue={ localStorage.getItem(IDENTIFIER_NEO4J_USERNAME) }
                                                required
                                            />
                                            <FormText className="help-block">Default: "neo4j"</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor={IDENTIFIER_NEO4J_PASSWORD + "-input"}>Password</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input
                                                type="password"
                                                id={IDENTIFIER_NEO4J_PASSWORD + "-input"}
                                                name={IDENTIFIER_NEO4J_PASSWORD + "-input"}
                                                className={'setting'}
                                                placeholder="Please provide Neo4j password..."
                                                defaultValue={ localStorage.getItem(IDENTIFIER_NEO4J_PASSWORD) }
                                                required
                                            />
                                            <FormText className="help-block">Default: "neo4j"</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor={IDENTIFIER_PROJECT_NAME + "-input"}>Name</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input
                                                type="text"
                                                id={IDENTIFIER_PROJECT_NAME + "-input"}
                                                name={IDENTIFIER_PROJECT_NAME + "-input"}
                                                className={'setting'}
                                                placeholder="Please provide project name..."
                                                defaultValue={ localStorage.getItem(IDENTIFIER_PROJECT_NAME) }
                                                required
                                            />
                                            <FormText color="muted">Example: "jUnit"</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row className="button-row">
                                        <Col xs="12" md="12">
                                            <Button className="float-right" color="success" onClick={ this.updateSettings }>Save</Button>
                                            <Button className="float-right margin-right" color="danger" onClick={ this.resetSettings }>Reset</Button>
                                            <Alert id="database-settings-alert" className="float-right settings-alert" color="success">
                                                Successfully saved settings.
                                            </Alert>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Settings;
