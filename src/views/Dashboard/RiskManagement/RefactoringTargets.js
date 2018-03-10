import React, { Component } from 'react';

import DashboardAbstract, { neo4jSession } from '../Abstract';

class QualityManagementRefactoringTargets extends DashboardAbstract {

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
                <div>
                    <h2>currently empty</h2>
                </div>
            </div>
        )
    }
}

export default QualityManagementRefactoringTargets;
