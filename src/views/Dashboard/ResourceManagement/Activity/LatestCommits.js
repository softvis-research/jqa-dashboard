import React, { Component } from 'react';
import DashboardAbstract, { neo4jSession } from '../../Abstract';

import LatestCommits from '../../visualizations/LatestCommits';

class ResourceManagementActivityLatestCommits extends DashboardAbstract {

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
                <LatestCommits/>
            </div>
        )
    }
}

export default ResourceManagementActivityLatestCommits;
