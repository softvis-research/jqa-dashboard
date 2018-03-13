import React, { Component } from 'react';

import DashboardAbstract, { neo4jSession } from './Abstract';

import {Badge, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input} from 'reactstrap';

class Dashboard extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        super.componentDidMount();
    }

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
            return(redirect);
        }

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="6" md="3">
                        <Card>
                            <CardHeader>
                                Architecture
                            </CardHeader>
                            <CardBody>
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                                laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                                ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" md="3">
                        <Card>
                            <CardHeader>
                                Resource Management
                            </CardHeader>
                            <CardBody>
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                                laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                                ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" md="3">
                        <Card>
                            <CardHeader>
                                Risk Management
                            </CardHeader>
                            <CardBody>
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                                laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                                ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" md="3">
                        <Card>
                            <CardHeader>
                                Quality Management
                            </CardHeader>
                            <CardBody>
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                                laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                                ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Dashboard;
