import React, { Component } from 'react';

import DashboardAbstract, {databaseCredentialsProvided, neo4jSession} from '../../../AbstractDashboardComponent';

import {Alert, Badge, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Button, Popover, PopoverHeader, PopoverBody} from 'reactstrap';

import SimpleBar from 'SimpleBar';

var groupArray = require('group-array');
var arraySort = require('array-sort');

class PopoverItem extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false,
            infoText: {
                "Best Practices": "Rules which enforce generally accepted best practices.",
                "Code Style": "Rules which enforce a specific coding style.",
                "Design": "Rules that help you discover design issues.",
                "Documentation": "Rules that are related to code documentation.",
                "Error Prone": "Rules to detect constructs that are either broken, extremely confusing or prone to runtime errors.",
                "Multithreading": "Rules that flag issues when dealing with multiple threads of execution.",
                "Performance": "Rules that flag suboptimal code."
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

class QualityManagementStaticCodeAnalysisPMD extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            pmdData: {
                "loading": [] //indicator for no data
            },
            alertColors: [
                "worstcase",
                "danger",
                "warning",
                "info",
                "secondary"
            ]
        };

        this.toggleInfo = this.toggleInfo.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        if (databaseCredentialsProvided) {
            this.readPmdData();
        }
    }

    readPmdData() {
        var pmdData = [];
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

        neo4jSession.run(
            'MATCH (:Report)-[:HAS_FILES]->(file:File:Pmd)-[:HAS_VIOLATIONS]->(violation:Violation) RETURN file.fqn, violation.package, violation.className, violation.method, violation.beginLine, violation.endLine, violation.beginColumn, violation.endColumn, violation.message, violation.ruleSet, violation.priority, violation.externalInfoUrl'
        ).then(function (result) {
            result.records.forEach(function (record) {

                pmdData.push({
                    "fqn": record.get(0),
                    "package": record.get(1),
                    "className": record.get(2),
                    "method": record.get(3),
                    "beginLine": record.get(4).low,
                    "endLine": record.get(5).low,
                    "beginColumn": record.get(6).low,
                    "endColumn": record.get(7).low,
                    "message": record.get(8),
                    "ruleSet": record.get(9),
                    "priority": record.get(10).low,
                    "externalInfoUrl": record.get(11)
                });

            });
        }).then( function(context) {

            // output preparation: sort all violations by priority
            pmdData = arraySort(pmdData, "priority");
            // output preparation: group all violations by rule set
            pmdData = groupArray(pmdData, "ruleSet");

            thisBackup.setState({pmdData: pmdData});
        }).catch(function (error) {
            console.log(error);
        });
    }

    toggleInfo() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        var thisBackup = this;
        var redirect = super.render();

        if (redirect.length > 0) {
            return(redirect);
        }

        if (this.state.pmdData.loading) {
            return '';
        }

        return (
            <div className="animated fadeIn">
                <Row>
                    {Object.keys(this.state.pmdData).map(function(key, i) {
                        //console.log(key);
                        //console.log(this.state.pmdData[key]);

                        return (
                            <Col xs="12" sm="6" md="6" key={key + i}>
                                <Card className={'pmd-card'}>
                                    <CardHeader>
                                        {key} ({this.state.pmdData[key].length})
                                        <div className="card-actions">
                                            <PopoverItem key={i} type={key} id={i} />
                                        </div>
                                    </CardHeader>
                                    <CardBody data-simplebar style={{height: "549px", overflow: "hidden"}}>
                                        {
                                            Object.keys(this.state.pmdData[key]).map(function(violationItem, i) {
                                                var violation = this.state.pmdData[key][violationItem];

                                                return (
                                                    <Alert color={this.state.alertColors[violation.priority - 1]} key={violation.fqn + i}>
                                                        <Row>
                                                            <Col xs="12" sm="12" md="12">
                                                                <div className="float-right">
                                                                    <label>Priority:</label>
                                                                    <span>{violation.priority}</span>
                                                                </div>
                                                                <strong className="violation-message">{violation.message} <a target="_blank" href={violation.externalInfoUrl}>[Explanation]</a></strong>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="12" md="12">
                                                                <label className="equal-width">Fqn:</label>
                                                                <span>{violation.fqn}</span>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="12" md="12">
                                                                <label className="equal-width">Package:</label>
                                                                <span>{violation.package}</span>
                                                            </Col>
                                                        </Row>
                                                        <Row className="class-method">
                                                            <Col xs="12" sm="6" md="6">
                                                                <label className="equal-width">{violation.className ? 'Class:' : '' }</label>
                                                                <span>{violation.className}</span>
                                                            </Col>
                                                            <Col xs="12" sm="6" md="6">
                                                                <label>{violation.method ? 'Method:' : '' }</label>
                                                                <span>{violation.method}</span>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6" md="3">
                                                                <label className="equal-width">Begin line:</label>
                                                                <span>{violation.beginLine}</span>
                                                            </Col>
                                                            <Col xs="12" sm="6" md="3">
                                                                <label>End line:</label>
                                                                <span>{violation.endLine}</span>
                                                            </Col>
                                                            <Col xs="12" sm="6" md="3">
                                                                <label>Begin column:</label>
                                                                <span>{violation.beginColumn}</span>
                                                            </Col>
                                                            <Col xs="12" sm="6" md="3">
                                                                <label>End column:</label>
                                                                <span>{violation.endColumn}</span>
                                                            </Col>
                                                        </Row>
                                                    </Alert>
                                                );
                                            }, this )
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        )
                    }, this)}
                </Row>
            </div>
        )
    }
}

export default QualityManagementStaticCodeAnalysisPMD;
