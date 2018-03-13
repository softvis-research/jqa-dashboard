import React, { Component } from 'react';

import DashboardAbstract, { neo4jSession } from '../../AbstractDashboardComponent';
import FilesPerFiletypePerAuthor from '../../visualizations/FilesPerFiletypePerAuthor';

import {Badge, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input} from 'reactstrap';

class ResourceManagementKnowledgeDistribution extends DashboardAbstract {

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
            <div>
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CardHeader>
                                Number of files per file type per author
                            </CardHeader>
                            <CardBody>
                                <FilesPerFiletypePerAuthor/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ResourceManagementKnowledgeDistribution;
