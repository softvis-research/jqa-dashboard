import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
var AppDispatcher = require('../../AppDispatcher');

var neo4jConnectionString = localStorage.getItem("connectionString"); //"bolt://localhost";
var neo4jUsername = localStorage.getItem("username");//"neo4j";
var neo4jPassword = localStorage.getItem("password");//"Test123.";

var neo4j = null;
var neo4jDriver = null;
var neo4jSession = null;

var databaseCredentialsProvided = false;
var databaseCredentialsCorrect = true;

function genericException(message, name) {
  this.message = message;
  this.name = name;
}

var scriptsToInstall = [
    '// 1. remove duplicate authors\n' +
    'MATCH\n' +
    '  (a:Author)\n' +
    'WITH\n' +
    '  a.name as name, collect(a) as authors\n' +
    'WITH\n' +
    '  head(authors) as author, tail(authors) as duplicates\n' +
    'UNWIND\n' +
    '  duplicates as duplicate\n' +
    'MATCH\n' +
    '  (duplicate)-[:COMMITTED]->(c:Commit)\n' +
    'MERGE\n' +
    '  (author)-[:COMMITTED]->(c)\n' +
    'DETACH DELETE\n' +
    '  duplicate\n' +
    'RETURN\n' +
    '  author.name, count(duplicate)\n',

    '// 2. label commits with more than one parent as MERGE\n' +
    'MATCH\n' +
    '  (c:Commit)-[:HAS_PARENT]->(p:Commit)\n' +
    'WITH\n' +
    '  c, count(p) as parents\n' +
    'WHERE\n' +
    '  parents > 1\n' +
    'SET\n' +
    '  c:Merge\n' +
    'RETURN\n' +
    '  count(c)  \n',

    '// 3. create HAS_SOURCE\n' +
    'MATCH\n' +
    '  (p:Package)-[:CONTAINS]->(t:Type)\n' +
    'WITH\n' +
    '  t, p.fileName + "/" + t.sourceFileName as sourceFileName // e.g. "/org/dukecon/model/Location.java"\n' +
    'MATCH\n' +
    '  (f:Git:File)\n' +
    'WHERE\n' +
    '  f.relativePath ends with sourceFileName\n' +
    'MERGE\n' +
    '  (t)-[:HAS_SOURCE]->(f)\n' +
    'RETURN\n' +
    '  f.relativePath, collect(t.fqn)\n',

    '// 4. build time tree\n' +
    'MATCH\n' +
    '  (c:Commit)\n' +
    'WITH\n' +
    '  c, split(c.date, "-") as parts \n' +
    'MERGE\n' +
    '  (y:Year{year:parts[0]})\n' +
    'MERGE\n' +
    '  (m:Month{month:parts[1]})-[:OF_YEAR]->(y)\n' +
    'MERGE\n' +
    '  (d:Day{day:parts[2]})-[:OF_MONTH]->(m)\n' +
    'MERGE\n' +
    '  (c)-[:OF_DAY]->(d)\n' +
    'RETURN\n' +
    '  y, m, d'
];

class DashboardAbstract extends Component {

    checkForDatabaseConnection() {
      var connectionString = localStorage.getItem('connectionString');
      var neo4jPassword = localStorage.getItem('password');
      var neo4jUsername = localStorage.getItem('username');
      
      databaseCredentialsProvided = 
        connectionString !== null && connectionString != "" &&
        neo4jPassword !== null && neo4jPassword != "" &&
        neo4jUsername !== null && neo4jUsername != "";
    }

    componentWillMount() {
      this.handleAction = this.handleAction.bind(this);
      this.setState({
        dispatcherEventId: AppDispatcher.register(this.handleAction)
      });

      return new Promise(
        this.checkForDatabaseConnection
      ).then(
        this.testDatabaseCredentials()
      )
    }
  
    testDatabaseCredentials() {
      var connectionString = neo4jConnectionString;
      var username = neo4jUsername;
      var password = neo4jPassword;

      connectionString = localStorage.getItem("connectionString"); //if we're on settings page and trying to validate new credentials
      username = localStorage.getItem("username"); //if we're on settings page and trying to validate new credentials
      password = localStorage.getItem("password"); //if we're on settings page and trying to validate new credentials

      if (databaseCredentialsProvided) {
        this.refreshConnectionSettings(); //set to abstract variables

        neo4j = require('../../../neo4j-web.min');
        neo4jDriver = neo4j.v1.driver(connectionString, neo4j.v1.auth.basic(username, password));
        neo4jSession = neo4jDriver.session();

        var thisBackup = this;

        return neo4jSession
        .run("match (n) return n limit 1") //this should be as generic as possible =)
        .then( function() {
            databaseCredentialsCorrect = true;
            //thisBackup.runSetupScripts(); //this dashboard mustn't alter the database (at least for now)
        })
        .catch( function(error) {
            databaseCredentialsCorrect = false;
            neo4jConnectionString = "";
            throw new genericException("Invalid database connection data", "InvalidDatabaseConnectionException");
        }); //handle wrong credentials
      } //end if
    }
/*
    runSetupScripts() {
        var currentVersion = -1;
        var oldVersion = -1;
        neo4jSession.run("MATCH (n:Version) RETURN n"
        ).then(function (result) {
            if (result.records.length === 0) {
                neo4jSession.run("create (n:Version {version:-1})");
            }

            result.records.forEach(function (record) {
                var recordData = record.get(0);
                currentVersion = recordData.properties.version.low;
                oldVersion = currentVersion;
            });
            console.log('current setup version: ' + currentVersion);
        }).then(function () {
            for (var i = 0; i < scriptsToInstall.length; i++) {
                if (currentVersion >= i) {
                    continue;
                }
                console.log("running script: " + scriptsToInstall[i]);
                neo4jSession.run(scriptsToInstall[i]);
                currentVersion++;
            }
        }).then(function () {
            if (oldVersion === (scriptsToInstall.length - 1)) {
                console.log("latest version is installed :)");
            } else {
                neo4jSession.run("MATCH (n { version: " + oldVersion + "})\n" +
                    "SET n.version = " + currentVersion + "\n" +
                    "RETURN n.version");
                console.log("setting version to " + currentVersion);
            }
        });
    }
*/
    componentDidMount() {

    }

    refreshConnectionSettings() {
      neo4jConnectionString = localStorage.getItem("connectionString"); //"bolt://localhost";
      neo4jUsername = localStorage.getItem("username");//"neo4j";
      neo4jPassword = localStorage.getItem("password");//"Test123.";
    }

    componentWillUnmount() {
      if (neo4jSession !== null) {
        //neo4jSession.close(); //TODO: this triggers (atm) WebSocket is closed before the connection is established. > disabled
      }
      if (neo4jDriver !== null) {
        //neo4jDriver.close(); //TODO: this triggers (atm) WebSocket is closed before the connection is established. > disabled
      }

      AppDispatcher.unregister(this.state.dispatcherEventId);
    }

    handleAction(event) {
        var action = event.action;
        switch (action.actionType) {
            case 'SET_STATE':
                var stateData = event.action.data;
                this.setState(stateData);
        }
    }

    render() {
      var rdir = [];
      if (!databaseCredentialsProvided || !databaseCredentialsCorrect) {
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
export { neo4j, neo4jSession, databaseCredentialsProvided, databaseCredentialsCorrect, genericException };