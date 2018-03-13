import React, { Component } from 'react';
import DashboardAbstract, { neo4jSession, databaseCredentialsProvided } from '../../AbstractDashboardComponent';

var AppDispatcher = require('../../../../AppDispatcher');

import {ResponsiveBar} from 'nivo';

import CommitsPerAuthor from '../../visualizations/CommitsPerAuthor';
import LatestCommits from '../../visualizations/LatestCommits';
import {Badge, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input} from 'reactstrap';

class ResourceManagementActivity extends DashboardAbstract {

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
                    <Col xs="12" sm="6" md="6">
                        <Card>
                            <CardHeader>
                                Number of commits and files per author with excluded merges (TODO: split)
                            </CardHeader>
                            <CardBody>
                                <CommitsPerAuthor/>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" md="6">
                        <Card>
                            <CardHeader>
                                Number of commits and files per author with excluded merges (TODO: split)
                            </CardHeader>
                            <CardBody>
                                <CommitsPerAuthor/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CardHeader>
                                Latest 20 commits
                            </CardHeader>
                            <CardBody>
                                <LatestCommits/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ResourceManagementActivity;
