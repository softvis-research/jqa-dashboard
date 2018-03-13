import React, { Component } from 'react';
import DashboardAbstract, { neo4jSession, databaseCredentialsProvided } from '../AbstractDashboardComponent';

import {
    Alert,
    Row,
    Col,
    Button,
    Card,
    CardHeader,
    CardFooter,
    CardBody,
    Form,
    FormGroup,
    FormText,
    Label,
    Input,
    InputGroupText
} from 'reactstrap';

var IDENTIFIER_PROJECT_NAME = "projectName";
var IDENTIFIER_CONNECTION_STRING = "connectionString";
var IDENTIFIER_NEO4J_USERNAME = "username";
var IDENTIFIER_NEO4J_PASSWORD = "password";

function genericException(message, type) {
    this.message = message;
    this.name = name;
}

class Settings extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {
        //super.componentDidMount(); //do nothing, we don't need a database here
    }

    componentWillUnmount() {
        //super.componentWillUnmount(); //do nothing, we don't have a database here
    }
    updateLocalStorage(event) {

        var settings = document.querySelectorAll('.setting');

        // TODO: test database connection

        var settingsArray = [];

        // save settings to localStorage
        [].forEach.call(settings, function(setting) {
            var identifier = setting.id.replace('-input', '');
            localStorage.setItem(identifier, setting.value);
        });
/*
        try {
            super.checkForDatabaseConnection();

            if (!databaseCredentialsProvided) {
                throw new genericException("Database connection parameter missing.", "DatabaseConncetionException");
            }
            super.componentDidMount();
            // show success message
            document.getElementById('settings-alert').innerHTML = 'Successfully saved settings.';
        } catch(e) {
            console.log(e);
            localStorage.setItem('connectionString', '');
            document.getElementById('settings-alert').innerHTML = 'Connection failiure: ' + e.message;
        }
*/
        document.getElementById('settings-alert').style.display = 'block';
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" md="6">
                        <Card>
                            <CardHeader>
                                Settings
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor={IDENTIFIER_PROJECT_NAME + "-input"}>Project name</Label>
                                        </Col>
                                        <Col xs="12" md="8">
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
                                    <hr />
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor={IDENTIFIER_CONNECTION_STRING + "-input"}>Neo4j Connection String</Label>
                                        </Col>
                                        <Col xs="12" md="8">
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
                                        <Col md="4">
                                            <Label htmlFor={IDENTIFIER_NEO4J_USERNAME + "-input"}>Neo4j Username</Label>
                                        </Col>
                                        <Col xs="12" md="8">
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
                                        <Col md="4">
                                            <Label htmlFor={IDENTIFIER_NEO4J_PASSWORD + "-input"}>Password</Label>
                                        </Col>
                                        <Col xs="12" md="8">
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
                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button className="float-right" type="submit" size="lg" color="success" onClick={ this.updateLocalStorage }><i className="fa fa-save"></i> Save settings</Button>
                                <Alert id="settings-alert" className="float-right settings-alert" color="success">
                                    Successfully saved settings.
                                </Alert>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Settings;
