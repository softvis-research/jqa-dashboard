import React, { Component } from 'react';
import DashboardAbstract, { neo4jSession } from './Abstract';

import {
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


class Settings extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {
        super.componentDidMount();
    }

    render() {
        return (
            <div className="animated fadeIn">
                <h2>Settings</h2>
                <Row>
                    <Col xs="12" md="6">
                        <Card>
                            <CardHeader>
                                <strong>Project</strong>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Project name</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input type="text" id="text-input" name="text-input" placeholder="Please provide project name..."/>
                                            <FormText color="muted">Example: "jUnit"</FormText>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button className="float-right" type="submit" size="sm" color="success"><i className="fa fa-save"></i> Save project name</Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" md="6">
                        <Card>
                            <CardHeader>
                                <strong>Database Connection</strong>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Neo4j Connection String</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input type="text" id="text-input" name="text-input" placeholder="Please provide Neo4j connection string..."/>
                                            <FormText color="muted">Default: "bolt://localhost"</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="email-input">Neo4j Username</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input type="email" id="email-input" name="email-input" placeholder="Please provide Neo4j username..."/>
                                            <FormText className="help-block">Default: "neo4j"</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="password-input">Password</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input type="password" id="password-input" name="password-input" placeholder="Please provide Neo4j password..."/>
                                            <FormText className="help-block">Default: "neo4j"</FormText>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button className="float-right" type="submit" size="sm" color="success"><i className="fa fa-save"></i> Save database connection data</Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Settings;
