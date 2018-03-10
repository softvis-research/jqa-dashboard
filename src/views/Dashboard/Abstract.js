import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
var AppDispatcher = require('../../AppDispatcher');

const neo4jConnectionString = localStorage.getItem("connectionString"); //"bolt://localhost";
const neo4jUsername = localStorage.getItem("username");//"neo4j";
const neo4jPassword = localStorage.getItem("password");//"Test123.";

var neo4j = null;
var neo4jDriver = null;
var neo4jSession = null;

var databaseCredentialsProvided = false;

class DashboardAbstract extends Component {

    componentWillMount() {
      var connectionString = localStorage.getItem('connectionString');
      var neo4jPassword = localStorage.getItem('password');
      var neo4jUsername = localStorage.getItem('username');
      
      databaseCredentialsProvided = 
        connectionString !== null && connectionString != "" &&
        neo4jPassword !== null && neo4jPassword != "" &&
        neo4jUsername !== null && neo4jUsername != "";

      this.handleAction = this.handleAction.bind(this);
      this.setState({
        dispatcherEventId: AppDispatcher.register(this.handleAction)
      });
    }
  
    componentDidMount() {
      if (databaseCredentialsProvided) {
        neo4j = require('../../../neo4j-web.min');
        neo4jDriver = neo4j.v1.driver(neo4jConnectionString, neo4j.v1.auth.basic(neo4jUsername, neo4jPassword));
        neo4jSession = neo4jDriver.session();
      }
    }

    componentWillUnmount() {
      if (neo4jSession !== null) {
        neo4jSession.close();
      }
      if (neo4jDriver !== null) {
        neo4jDriver.close();
      }

      AppDispatcher.unregister(this.state.dispatcherEventId);
    }

    handleAction() {

    }

    render() {
      var rdir = [];
      if (!databaseCredentialsProvided) {
        console.log("No database credentials, redirecting to settings...");
          var baseUrl = window.location.protocol + '//' + window.location.host + '/#';
          var path = window.location.href.replace(baseUrl, '');
          if (path != '/settings') {
              rdir.push(<Redirect key="dummy" to="/settings" />);
          }
      }

      return (rdir);
    }
}

export default DashboardAbstract;
export { neo4j, neo4jSession, databaseCredentialsProvided };