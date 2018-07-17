import React, { Component } from 'react';
import DashboardAbstract from '../../AbstractDashboardComponent';

import CommitsPerAuthor from './visualizations/CommitsPerAuthor';
import FilesPerAuthor from './visualizations/FilesPerAuthor';
import CommitsTimescale from './visualizations/CommitsTimescale';
import LatestCommits from './visualizations/LatestCommits';

import {Row, Col, Card, CardHeader, CardBody, Popover, PopoverHeader, PopoverBody} from 'reactstrap';

class PopoverItem extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false,
            infoText: {
                "Commits per author": "The bar chart shows the number of commits for each author.",
                "Files per author": "The bar chart shows the number of files for each author.",
                "Commits over time": "The calendar shows the number of commits per day. The darker the color is, the more commits were made.",
                "Latest 20 commits": "The table shows the author, the date, and the commit message of the latest 20 commits."
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
                <a className="mr-1" color="secondary" id={'Popover-' + this.props.id} onClick={this.toggle}>
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
