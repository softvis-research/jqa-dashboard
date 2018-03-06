import React, { Component } from 'react';
var AppDispatcher = require('../../AppDispatcher');

const neo4jConnectionString = "bolt://localhost";
const neo4jUsername = "neo4j";
const neo4jPassword = "Test123.";

var neo4j = null;
var neo4jDriver = null;
var neo4jSession = null;

class DashboardAbstract extends Component {

    componentWillMount() {
      this.handleAction = this.handleAction.bind(this);
      this.setState({
        dispatcherEventId: AppDispatcher.register(this.handleAction)
      });
    }
  
    componentDidMount() {
      neo4j = require('../../../neo4j-web.min');
      neo4jDriver = neo4j.v1.driver(neo4jConnectionString, neo4j.v1.auth.basic(neo4jUsername, neo4jPassword));
      neo4jSession = neo4jDriver.session();
    }

    componentWillUnmount() {
      neo4jSession.close();
      neo4jDriver.close();
      AppDispatcher.unregister(this.state.dispatcherEventId);
    }

    handleAction() {

    }

    render() {
        //do nothing
    }
}

export default DashboardAbstract;
export { neo4j, neo4jSession };