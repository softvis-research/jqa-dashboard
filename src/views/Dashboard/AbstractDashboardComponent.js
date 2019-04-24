import React, { Component } from "react";
import { Redirect } from "react-router-dom";
var AppDispatcher = require("../../AppDispatcher");

var neo4jConnectionString = localStorage.getItem("connectionString"); //"localhost";
var neo4jUsername = localStorage.getItem("username"); //"neo4j";
var neo4jPassword = localStorage.getItem("password"); //"Test123.";

var neo4j = null;
var neo4jDriver = null;
var neo4jSession = null;

var databaseCredentialsProvided = false;
var databaseCredentialsCorrect = true;

function GenericException(message, name) {
    this.message = message;
    this.name = name;
}

class DashboardAbstract extends Component {
    static checkForDatabaseConnection() {
        var connectionString = localStorage.getItem("connectionString");
        var neo4jPassword = localStorage.getItem("password");
        var neo4jUsername = localStorage.getItem("username");

        databaseCredentialsProvided =
            connectionString !== null &&
            connectionString !== "" &&
            neo4jPassword !== null &&
            neo4jPassword !== "" &&
            neo4jUsername !== null &&
            neo4jUsername !== "";

        // if database credentials are provided via .env file, we load them initially
        if (
            !databaseCredentialsProvided &&
            typeof process.env.REACT_APP_NEO4J_IP !== "undefined" &&
            typeof process.env.REACT_APP_NEO4J_USERNAME !== "undefined" &&
            typeof process.env.REACT_APP_NEO4J_PASSWORD !== "undefined"
        ) {
            localStorage.setItem(
                "connectionString",
                process.env.REACT_APP_NEO4J_IP
            );
            localStorage.setItem(
                "username",
                process.env.REACT_APP_NEO4J_USERNAME
            );
            localStorage.setItem(
                "password",
                process.env.REACT_APP_NEO4J_PASSWORD
            );

            var projectName = "My project";
            if (typeof process.env.REACT_APP_PROJECT_NAME !== "undefined") {
                projectName = process.env.REACT_APP_PROJECT_NAME;
            }
            localStorage.setItem("projectName", projectName);

            var limitCountingHotspots = "70";
            if (
                typeof process.env.REACT_APP_LIMIT_COUNTING_HOTSPOTS !==
                "undefined"
            ) {
                limitCountingHotspots =
                    process.env.REACT_APP_LIMIT_COUNTING_HOTSPOTS;
            }
            localStorage.setItem(
                "limitCountingHotspots",
                limitCountingHotspots
            );

            databaseCredentialsProvided = true;
        }
    }

    componentWillMount() {
        this.handleAction = this.handleAction.bind(this);
        this.setState({
            dispatcherEventId: AppDispatcher.register(this.handleAction)
        });

        return new Promise(DashboardAbstract.checkForDatabaseConnection).then(
            this.testDatabaseCredentials()
        );
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

            //TODO: check if there is a better method for running dashboard and test components
            if (typeof testrun !== "undefined") {
                neo4j = require("neo4j-driver");
            } else {
                neo4j = require("neo4j-driver/lib/browser/neo4j-web");
            }

            neo4jDriver = neo4j.v1.driver(
                "bolt://" + connectionString,
                neo4j.v1.auth.basic(username, password)
            );
            neo4jSession = neo4jDriver.session();

            return neo4jSession
                .run("match (n) return n limit 1") //this should be as generic as possible =)
                .then(function() {
                    databaseCredentialsCorrect = true;
                })
                .catch(function(error) {
                    databaseCredentialsCorrect = false;
                    neo4jConnectionString = "";
                    throw new GenericException(
                        "Invalid database connection data",
                        "InvalidDatabaseConnectionException"
                    );
                }); //handle wrong credentials
        } //end if
    }

    componentDidMount() {}

    refreshConnectionSettings() {
        neo4jConnectionString = localStorage.getItem("connectionString"); //"localhost";
        neo4jUsername = localStorage.getItem("username"); //"neo4j";
        neo4jPassword = localStorage.getItem("password"); //"Test123.";
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
            case "SET_STATE":
                var stateData = event.action.data;
                this.setState(stateData);
                break;
            default:
                break;
        }
    }

    render() {
        var rdir = [];
        if (!databaseCredentialsProvided || !databaseCredentialsCorrect) {
            console.log("No database credentials, redirecting to settings...");
            var baseUrl =
                window.location.protocol + "//" + window.location.host + "/#";
            var path = window.location.href.replace(baseUrl, "");
            if (path !== "/settings") {
                rdir.push(<Redirect key="dummy" to="/settings" />);
            }
        }

        return rdir;
    }
}

export default DashboardAbstract;
export {
    neo4j,
    neo4jSession,
    databaseCredentialsProvided,
    databaseCredentialsCorrect,
    GenericException
};
