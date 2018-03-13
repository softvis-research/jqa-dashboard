import React, { Component } from 'react';

import DashboardAbstract, { neo4jSession } from '../../Abstract';
import FileType from '../../visualizations/FileType';

import {Badge, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input} from 'reactstrap';

class ArchitectureFileTypes extends DashboardAbstract {

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
                {redirect}
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CardHeader>
                                Number of files per file type
                            </CardHeader>
                            <CardBody>
                                <FileType/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ArchitectureFileTypes;
