import React, { Component } from 'react';

import {render} from 'react-dom';
import {Pie, Bar} from 'nivo';

import DashboardAbstract, { neo4jSession } from './Abstract';

class Behaviour extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            filetypeData: [
              {
                "id": "dummy",
                "label": "dummy",
                "value": 1
              }
            ],
            commitsPerAuthor: [
              {
                "author": "Dummy",
                "commits": 1,
                "files": 2,
              }
            ],
            filesFiletypeAuthor: [
              {
                "filetype": "dummy",
                "author": "dummy",
                "files": 1
              }
            ]
        };
    }

    componentDidMount() {
      super.componentDidMount();

      this.readFiletypes();
      this.readCommitsPerAuthor();
    }

    readFiletypes() {
      var aggregatedData = [];
      var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

      neo4jSession.run(
        'MATCH (f:Git:File) ' + 
        'WITH f, split(f.relativePath, ".") as splittedFileName ' +
        'SET f.type = splittedFileName[size(splittedFileName)-1] ' +
        'RETURN f.type as filetype, count(f) as files ' +
        'ORDER BY files DESC'
      ).then(function (result) {
        result.records.forEach(function (record) {
          var recordConverted = {
            "id": record.get(0),
            "label": record.get(0),
            "value": record.get(1).low
          };

          if (recordConverted.id !== null && recordConverted.value > 3) { //below 3 is considered too small to display
            aggregatedData.push(recordConverted);
          }
        });
      }).then( function(context) {
        thisBackup.setState({filetypeData: aggregatedData});
      }).catch(function (error) {
          console.log(error);
      });
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
              <h2>number of files per file type (pie chart) > Struktur</h2>
              <Pie
                width={1000}
                height={800}
                data={this.state.filetypeData}
                margin={{
                  "top": 20,
                  "right": 20,
                  "bottom": 20,
                  "left": 20
                }}
                innerRadius={0}
                padAngle={0}
                cornerRadius={0}
                colors="d320c"
                colorBy="id"
                borderColor="inherit:darker(0.6)"
                radialLabelsSkipAngle={5}
                radialLabelsTextXOffset={6}
                radialLabelsTextColor="#333333"
                radialLabelsLinkOffset={0}
                radialLabelsLinkDiagonalLength={16}
                radialLabelsLinkHorizontalLength={24}
                radialLabelsLinkStrokeWidth={1}
                radialLabelsLinkColor="inherit"
                slicesLabelsSkipAngle={5}
                slicesLabelsTextColor="#333333"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                legends={[
                  {
                    "anchor": "bottom",
                    "direction": "row",
                    "translateY": 56,
                    "itemWidth": 100,
                    "itemHeight": 14,
                    "symbolSize": 14,
                    "symbolShape": "circle"
                  }
                ]}
            />

            <h2>number of commits per author with excluded MERGES (barchart) > Historie</h2>
            <Bar
              width={1000}
              height={750}
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
        )
    }
}

export default Behaviour;
