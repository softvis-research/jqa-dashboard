import React, { Component } from 'react';

import DashboardAbstract, { neo4jSession } from '../../Abstract';
import NumberOfFilesPerFiletypePerAuthor from '../../visualizations/NumberOfFilesPerFiletypePerAuthor';

class ResourceManagementCodeOwnershipFilesPerFileTypePerAuthor extends DashboardAbstract {

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
                <NumberOfFilesPerFiletypePerAuthor/>
            </div>
        )
    }
}

export default ResourceManagementCodeOwnershipFilesPerFileTypePerAuthor;
