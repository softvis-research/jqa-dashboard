import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DashboardAbstract, { neo4jSession, databaseCredentialsProvided } from '../../../AbstractDashboardComponent';
import tinygradient from 'tinygradient';
import TestCoverageModel from '../../../../../api/models/TestCoverage';
import {ResponsiveTreeMapHtml} from '@nivo/treemap';
import * as d3 from "d3";

var IDENTIFIER_PROJECT_NAME = "projectName";
var gradient = tinygradient('red', 'green');

class TestCoverageTreeMap extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            testCoverageData: {},
        };
    }

    componentWillMount() {
        super.componentWillMount();
    }

    componentDidMount() {
        super.componentDidMount();

        if (databaseCredentialsProvided) {
            var testCoverageModel = new TestCoverageModel();
            testCoverageModel.readTestCoverage(this, localStorage.getItem(IDENTIFIER_PROJECT_NAME));
        }
    }

    findCoverageByNode(hoveredNode) {
        var hoveredNodeId = hoveredNode.data.data.id;

        //normalize recursively all childs (move information from .data to the element's root where nivo expects it)
        var findIdInHierarchicalData = function(hierarchicalData, idToFind) {
            for (var i = 0; i < hierarchicalData.children.length; i++) {
                if (hierarchicalData.children[i].data.id == idToFind) {
                    return hierarchicalData.children[i];
                }
                if (hierarchicalData.children[i].children) {
                    var found = findIdInHierarchicalData(hierarchicalData.children[i], idToFind);
                    if (found) {
                        return found;
                    }
                }
            }
        };

        var foundElement = findIdInHierarchicalData(this.state.testCoverageData, hoveredNodeId);

        if (!foundElement) {
            if (this.state.testCoverageData.id == hoveredNodeId) {
                foundElement = this.state.testCoverageData;
            }
        }

        if (typeof(foundElement) === 'object' && typeof(foundElement.coverage) !== 'undefined') {
            return foundElement.coverage;
        }
    }

    static reversePathForDisplay(node) {
        var path = node.path;
        path = path.substr( node.id.length );

        if (path.length > 0) {
            path = path.substr(1)  //+1 to cut first "." away
        }
        var pathParts = path.split('.');
        var correctPath = "";
        for (var i = pathParts.length - 1; i > -1; i--) {
            correctPath += '.' + pathParts[i];
        }

        if (correctPath.length > 0) {
            correctPath = correctPath.substr(1); //remove first "." added in loop
        }

        return correctPath;
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
            return(redirect);
        }

        if (!this.state.testCoverageData.name) {
            return '';
        }

        var thisBackup = this;

        return (
            <div className={'test-coverage'} style={{height: "800px"}}>
                <ResponsiveTreeMapHtml
                    root={this.state.testCoverageData}
                    identity="name"
                    value="loc"
                    innerPadding={2}
                    outerPadding={2}
                    margin={{
                        "top": 10,
                        "right": 10,
                        "bottom": 10,
                        "left": 10
                    }}
                    enableLabel={false}
                    colors="nivo"
                    colorBy={ function (e) {

                        var data = e.data;

                        var role = "undefined";
                        if (data && data.role) {
                            role = data.role;
                        }

                        if (data && role === "leaf") {
                            var coverage = data.coverage / 100;
                            var rgbObject = tinygradient('red', 'green').rgbAt(coverage);
                            var r = Math.round(rgbObject._r);
                            var g = Math.round(rgbObject._g);
                            var b = Math.round(rgbObject._b);
                            return 'rgb(' + r + ', ' + g + ', ' + b + ')';
                        } else if (data) {
                            var level = data.level;
                            var r = 228 - (11 * level * 2);
                            var g = 242 - (6 * level * 2);
                            var b = 243 - (6 * level * 2);
                            return 'rgb(' + r + ', ' + g + ', ' + b + ')';
                        }
                    } }
                    borderColor="inherit:darker(0.3)"
                    animate={true}
                    motionStiffness={90}
                    motionDamping={11}
                    tooltip={({ id, value, color, node }) => (
                        <div style={{whiteSpace: 'pre', display: 'flex', alignItems: 'center'}}>
                            <span style={{display: 'block', height: '12px', width: '12px', marginRight: '7px', backgroundColor: color}}></span>
                            <span>
                                <strong>
                                    <span className={'additional'}>
                                        {TestCoverageTreeMap.reversePathForDisplay(node)}
                                    </span>
                                    <span className={'additional'}>
                                        {id}
                                    </span>
                                    <span className={'additional'}>
                                        LOC: {value}{
                                        thisBackup.findCoverageByNode(node) > -1 ?
                                            ', Test coverage: ' + thisBackup.findCoverageByNode(node) + '%':
                                            ''
                                    }
                                    </span>
                                </strong>
                            </span>
                        </div>
                    )}
                />
            </div>
        )
    }
}

export default TestCoverageTreeMap;
