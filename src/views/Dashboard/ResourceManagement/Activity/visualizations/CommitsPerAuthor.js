import React, { Component } from 'react';
import {ResponsiveBar} from '@nivo/bar';
import DashboardAbstract, { neo4jSession, databaseCredentialsProvided } from '../../../AbstractDashboardComponent';
import CommitsPerAuthorModel from '../../../../../api/models/CommitsPerAuthor';
var AppDispatcher = require('../../../../../AppDispatcher');

class CommitsPerAuthor extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            startDate: '1970-01-01',
            endDate: '3000-12-31',
            commitsPerAuthor: []
        };
    }

    componentWillMount() {
      super.componentWillMount();
    }

    componentDidMount() {
      super.componentDidMount();
      if (databaseCredentialsProvided) {
          var commitsPerAuthorModel = new CommitsPerAuthorModel();
          commitsPerAuthorModel.readCommitsPerAuthor(this, this.state.startDate, this.state.endDate);
      }
    }

    componentWillUnmount() {
      super.componentWillUnmount();
    }

    handleAction(event) {
        var action = event.action;
        switch (action.actionType) {
            case 'DATERANGEPICKER_MODIFIED':
                this.setState({
                    startDate: action.data.displayFrom,
                    endDate: action.data.displayTo,
                });
                var commitsPerAuthorModel = new CommitsPerAuthorModel();
                commitsPerAuthorModel.readCommitsPerAuthor(this, this.state.startDate, this.state.endDate);
            break;
        }
    }

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
          return(redirect);
        }

        if (this.state.commitsPerAuthor.length === 0) {
            return '';
        }

        return (
          <div>
            <div style={{height: "600px"}}>
              <ResponsiveBar
                onClick={ function(event) {
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
                  "top": 0,
                  "right": 50,
                  "bottom": 50,
                  "left": 150
                }}
                padding={0.05}
                groupMode="stacked"
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
                  "tickPadding": 15,
                  "tickRotation": 0,
                  "legend": "# Commits",
                  "legendPosition": "center",
                  "legendOffset": 46
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
              />
            </div>
          </div>
        )
    }
}

export default CommitsPerAuthor;
