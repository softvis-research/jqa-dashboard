import React, { Component } from 'react';
import DashboardAbstract, { neo4jSession } from '../Abstract';

import {ResponsiveBar} from 'nivo';

class NumberOfFilesPerFiletypePerAuthor extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            data: [
              {
                "author": "Dummy",
                "filetype": "dum",
                "files": 1,
              }
            ],
            dataKeys: [
              "Dummy"
            ]
        };
    }

    componentDidMount() {
      super.componentDidMount();

      this.readData();
    }
  

    readData() {
      var aggregatedData = [];
      var aggregatedKeys = [];
      var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state
      var recordCount = 0;

      neo4jSession.run(
        'MATCH ' + 
        '  (a:Author)-[:COMMITTED]->(c:Commit)-[:CONTAINS_CHANGE]->(:Change)-[:MODIFIES]->(file:File) ' +
        'WHERE NOT ' + 
        '  c:Merge ' +
        'RETURN ' + 
        '  file.type as filetype, a.name as author, count(file) as files ' +
        'ORDER BY ' + 
        '  files DESC, filetype '
      ).then(function (result) {
        result.records.forEach(function (record) {
          if (recordCount < 100) { //above 100 records makes the chart unreadable
            var author = record.get(1);
            var filetype = record.get(0);
            var files = record.get(2).low;

            var found = false;
            aggregatedData.forEach(function (dataSet) {
              if (dataSet.filetype === filetype) { //found: only append author
                dataSet[author] = files;
                found = true;
              }
            });

            if (!found) { //create dataset
              aggregatedData.push({
                "filetype": filetype,
              });
              aggregatedData[aggregatedData.length - 1][author] = files;
            }

            if (aggregatedKeys.indexOf(author) === -1) {
              aggregatedKeys.push(author);
            }
          }
          recordCount++;
        });
      }).then( function(context) {
        var grouping = [];
        aggregatedData.forEach(function (record) {

        })

      }).then( function(context) {
        //console.log(aggregatedData);
        thisBackup.setState(
          {
            data: aggregatedData,
            dataKeys: aggregatedKeys
          }
        );
      }).catch(function (error) {
          console.log(error);
      });
    }

    render() {
        return (
          <div>
            <h2>number of files per file type per author</h2>
            <div style={{height: "600px"}}>
              <ResponsiveBar
                onClick={ function(event) { console.log(event) } }
                data={this.state.data}
                keys={this.state.dataKeys}
                indexBy="filetype"
                margin={{
                  "top": 50,
                  "right": 50,
                  "bottom": 50,
                  "left": 150
                }}
                padding={0.05}
                groupMode="stacked"
                layout="vertical"
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
                  "legend": "Filetypes",
                  "legendPosition": "center",
                  "legendOffset": 36
                }}
                axisLeft={{
                  "orient": "left",
                  "tickSize": 5,
                  "tickPadding": 5,
                  "tickRotation": 0,
                  "legend": "Number of files",
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

export default NumberOfFilesPerFiletypePerAuthor;
