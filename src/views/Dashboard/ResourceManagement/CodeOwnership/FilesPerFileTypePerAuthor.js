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
        var redirect = super.render();
        if (redirect.length > 0) {
          return(redirect);
        }
        
        return (
            <div>
                <NumberOfFilesPerFiletypePerAuthor/>
            </div>
        )
    }
}

export default ResourceManagementCodeOwnershipFilesPerFileTypePerAuthor;
