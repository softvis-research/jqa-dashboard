import React from 'react';

import DashboardAbstract from '../../AbstractDashboardComponent';
import FileType from './visualizations/FileType';

import {Row, Col, Card, CardHeader, CardBody, Popover, PopoverHeader, PopoverBody} from 'reactstrap';

class ArchitectureFileTypes extends DashboardAbstract {

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
                {redirect}
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CardHeader>
                                Number of files per file type
                                <div className="card-actions">
                                    <a onClick={this.toggleInfo} id="Popover1">
                                        <i className="text-muted fa fa-question-circle"></i>
                                    </a>
                                    <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggleInfo}>
                                        <PopoverHeader>Number of files per file type</PopoverHeader>
                                        <PopoverBody>
                                            The pie chart shows all file types of the project with the number of corresponding files.
                                        </PopoverBody>
                                    </Popover>
                                </div>
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
