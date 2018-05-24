import React, { Component } from 'react';
import DashboardAbstract, { neo4jSession, databaseCredentialsProvided } from '../../AbstractDashboardComponent';

var AppDispatcher = require('../../../../AppDispatcher');

import CommitsPerAuthor from '../../visualizations/CommitsPerAuthor';
import FilesPerAuthor from '../../visualizations/FilesPerAuthor';
import LatestCommits from '../../visualizations/LatestCommits';
import CommitsTimescale from '../../visualizations/CommitsTimescale';

import {Badge, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input, Button, Popover, PopoverHeader, PopoverBody} from 'reactstrap';

class PopoverItem extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false,
            infoText: {
                "Commits per author": "Dummy text.",
                "Files per author": "Dummy text.",
                "Commits over time": "Dummy text.",
                "Latest 20 commits": "Dummy text."
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
                <a href="javascript: void(0)" className="mr-1" color="secondary" id={'Popover-' + this.props.id} onClick={this.toggle}>
                    <i className="text-muted fa fa-question-circle"></i>
                </a>
                <Popover placement={'bottom'} isOpen={this.state.popoverOpen} target={'Popover-' + this.props.id} toggle={this.toggle}>
                    <PopoverHeader>{this.props.type}</PopoverHeader>
                    <PopoverBody>{this.state.infoText[this.props.type]}</PopoverBody>
                </Popover>
      </span>
        );
    }
}

class ResourceManagementActivity extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {};

        this.toggleInfo = this.toggleInfo.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
    }

    toggleInfo() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
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
                                Commits per author
                                <div className="card-actions">
                                    <PopoverItem key={"Commitsperauthor"} type={"Commits per author"} id={"Commitsperauthor"} />
                                </div>
                            </CardHeader>
                            <CardBody>
                                <CommitsPerAuthor/>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" md="6">
                        <Card>
                            <CardHeader>
                                Files per author
                                <div className="card-actions">
                                    <PopoverItem key={"Filesperauthor"} type={"Files per author"} id={"Filesperauthor"} />
                                </div>
                            </CardHeader>
                            <CardBody>
                                <FilesPerAuthor/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="12" md="6">
                        <Card className="commit-calendar">
                            <CardHeader>
                                Commits over time
                                <div className="card-actions">
                                    <PopoverItem key={"Commitsovertime"} type={"Commits over time"} id={"Commitsovertime"} />
                                </div>
                            </CardHeader>
                            <CardBody>
                                <CommitsTimescale/>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="12" md="6">
                        <Card>
                            <CardHeader>
                                Latest 20 commits
                                <div className="card-actions">
                                    <PopoverItem key={"Latest20commits"} type={"Latest 20 commits"} id={"Latest20commits"} />
                                </div>
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
