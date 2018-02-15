import React, { Component } from 'react';

import DashboardAbstract, { neo4jSession } from '../Abstract';

class QualityManagementTemporalCoupling extends DashboardAbstract {

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
            <div>
                <div>
                    <h2>currently empty</h2>
                </div>
            </div>
        )
    }
}

export default QualityManagementTemporalCoupling;
