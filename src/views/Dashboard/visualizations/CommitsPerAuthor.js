import React, { Component } from 'react';
var AppDispatcher = require('../../../AppDispatcher');

import {ResponsiveBar} from 'nivo';

import DashboardAbstract, { neo4jSession, databaseCredentialsProvided } from '../Abstract';

class CommitsPerAuthor extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            commitsPerAuthor: [
              {
                "author": "Dummy",
                "commits": 1,
                "files": 1,
              }
            ]
        };
    }

    componentWillMount() {
      super.componentWillMount();
    }

    componentDidMount() {
      super.componentDidMount();
      console.log(databaseCredentialsProvided);
      if (databaseCredentialsProvided) {
        this.readCommitsPerAuthor();
      }
    }

    componentWillUnmount() {
      super.componentWillUnmount();
    }

    readCommitsPerAuthor() {
      var aggregatedData = [];
      var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state
      var recordCount = 0;

      neo4jSession.run(
        'MATCH (a:Author)-[:COMMITTED]->(c:Commit)-[:CONTAINS_CHANGE]->(:Change)-[:MODIFIES]->(file:File) ' + 
        'WHERE NOT c:Merge ' + 
        'RETURN a.name as author, count(distinct c) as commits, count(file) as files ' + 
        'ORDER BY files DESC'
      ).then(function (result) {
        result.records.forEach(function (record) {
          var recordConverted = {
            "author": record.get(0),
            "commits": record.get(1).low,
            "files": record.get(2).low
          };

          if (recordCount < 20) { //above 20 records makes the chart unreadable
            aggregatedData.push(recordConverted);
          }
          recordCount++;
        });
      }).then( function(context) {
        thisBackup.setState({commitsPerAuthor: aggregatedData.reverse()}); //reverse reverses the order of the array (because the chart is flipped this is neccesary)
      }).catch(function (error) {
          console.log(error);
      });
    }

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
          return(redirect);
        }

        return (
          <div>
            <h2>number of commits and files per author with excluded merges</h2>
            <div style={{height: "600px"}}>
              <ResponsiveBar
                onClick={ function(event) { 
                  //console.log(event);
                  AppDispatcher.handleAction({
                    actionType: 'SELECT_COMMITSPERAUTHOR',
                    data: event
                  });
                } }
                data={this.state.commitsPerAuthor}
                keys={[
                  "commits",
                  "files"
                ]}
                indexBy="author"
                margin={{
                  "top": 50,
                  "right": 50,
                  "bottom": 50,
                  "left": 150
                }}
                padding={0.05}
                groupMode="grouped"
                layout="horizontal"
                colors="nivo"
                colorBy="id"
                defs={[
                  {
                    "id": "dots",
                    "type": "patternDots",
                    "background": "inherit",
                    "color": "#38bcb2",
                    "size": 4,
                    "padding": 1,
                    "stagger": true
                  },
                  {
                    "id": "lines",
                    "type": "patternLines",
                    "background": "inherit",
                    "color": "#eed312",
                    "rotation": -45,
                    "lineWidth": 6,
                    "spacing": 10
                  }
                ]}
                borderColor="inherit:darker(1.6)"
                axisBottom={{
                  "orient": "bottom",
                  "tickSize": 5,
                  "tickPadding": 5,
                  "tickRotation": 0,
                  "legend": "Number",
                  "legendPosition": "center",
                  "legendOffset": 36
                }}
                axisLeft={{
                  "orient": "left",
                  "tickSize": 5,
                  "tickPadding": 5,
                  "tickRotation": 0,
                  "legend": "Author",
                  "legendPosition": "center",
                  "legendOffset": -140
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="inherit:darker(1.6)"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                legends={[
                  {
                    "dataFrom": "keys",
                    "anchor": "bottom-right",
                    "direction": "column",
                    "translateX": 120,
                    "itemWidth": 100,
                    "itemHeight": 20,
                    "itemsSpacing": 2,
                    "symbolSize": 20
                  }
                ]}
              />
            </div>
          </div>
        )
    }
}

export default CommitsPerAuthor;
