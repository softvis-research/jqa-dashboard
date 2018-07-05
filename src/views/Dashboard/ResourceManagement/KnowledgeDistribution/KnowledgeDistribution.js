import React from 'react';

import DashboardAbstract from '../../AbstractDashboardComponent';
import FilesPerFiletypePerAuthor from './visualizations/FilesPerFiletypePerAuthor';

import {Row, Col, Card, CardHeader, CardBody, Popover, PopoverHeader, PopoverBody} from 'reactstrap';

class ResourceManagementKnowledgeDistribution extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            popoverOpen: false,
            popovers: [
                {
                    placement: 'bottom',
                    text: 'Bottom'
                }
            ]
        };

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
            <div>
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CardHeader>
                                Number of files per file type per author
                                <div className="card-actions">
                                    <a onClick={this.toggleInfo} id="Popover1">
                                        <i className="text-muted fa fa-question-circle"></i>
                                    </a>
                                    <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggleInfo}>
                                        <PopoverHeader>Number of files per file type per author</PopoverHeader>
                                        <PopoverBody>
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                            aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                            culpa qui officia deserunt mollit anim id est laborum.                                        </PopoverBody>
                                    </Popover>
                                </div>
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
