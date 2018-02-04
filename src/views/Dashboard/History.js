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

    readFilesFiletypeAuthor() {
      var aggregatedData = [];
      var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state
      var recordCount = 0;

      neo4jSession.run(
        'MATCH (a:Author)-[:COMMITTED]->(c:Commit)-[:CONTAINS_CHANGE]->(:Change)-[:MODIFIES]->(file:File) ' +
        'WHERE NOT c:Merge ' +
        'RETURN file.type as filetype, a.name as author, count(file) as files ' +
        'ORDER BY files DESC, filetype'
      ).then(function (result) {
        result.records.forEach(function (record) {
          var recordConverted = {
            "filetype": record.get(0),
            "author": record.get(1),
            "files": record.get(2).low
          };

          if (recordCount < 20) { //above 20 records makes the chard unreadable
            aggregatedData.push(recordConverted);
          }
          recordCount++;
        });
      }).then( function(context) {
        thisBackup.setState({filesFiletypeAuthor: aggregatedData.reverse()}); //reverse reverses the order of the array (because the chart is flipped this is neccesary)
      }).catch(function (error) {
          console.log(error);
      });
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
