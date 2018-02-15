import React, { Component } from 'react';

import DashboardAbstract, { neo4jSession } from './Abstract';
import CommitsPerAuthor from './visualizations/CommitsPerAuthor';
import NumberOfFilesPerFiletypePerAuthor from './visualizations/NumberOfFilesPerFiletypePerAuthor';
import LatestCommits from './visualizations/LatestCommits';

class History extends DashboardAbstract {

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
            <CommitsPerAuthor/>
            <NumberOfFilesPerFiletypePerAuthor/>
            <LatestCommits/>
          </div>
        )
    }
}

export default History;
