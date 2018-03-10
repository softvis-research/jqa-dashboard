import React, { Component } from 'react';

import DashboardAbstract, { neo4jSession } from '../../Abstract';
import FileType from '../../visualizations/FileType';

class ArchitectureLanguageFilesPerFileType extends DashboardAbstract {

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
                {redirect}
                <FileType/>
            </div>
        )
    }
}

export default ArchitectureLanguageFilesPerFileType;
