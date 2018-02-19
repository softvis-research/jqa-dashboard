import React, { Component } from 'react';
import DashboardAbstract, { neo4jSession } from '../../Abstract';

import {ResponsiveBubble} from 'nivo';
import * as d3 from "d3";

class RiskManagementHotspotsBubbleChartWithNavigationTreeAndHotspots extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            hotSpotData:
                {
                    "name": "nivo",
                    "test": "testval",
                    "color": "hsl(333, 70%, 50%)",
                    "children": [
                        {
                            "name": "viz",
                            "color": "hsl(260, 70%, 50%)",
                            "children": [
                                {
                                    "name": "stack",
                                    "color": "hsl(114, 70%, 50%)",
                                    "children": [
                                        {
                                            "name": "chart",
                                            "color": "hsl(6, 70%, 50%)",
                                            "loc": 149781
                                        },
                                        {
                                            "name": "xAxis",
                                            "color": "hsl(330, 70%, 50%)",
                                            "loc": 104756
                                        },
                                        {
                                            "name": "yAxis",
                                            "color": "hsl(115, 70%, 50%)",
                                            "loc": 157675
                                        },
                                        {
                                            "name": "layers",
                                            "color": "hsl(106, 70%, 50%)",
                                            "loc": 111794
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.readStructure();
    }

    readStructure() {
        var flatData = [];
        var hierarchicalData = [];
        var projectName = "PROJECTNAME"; // acts as root as there are multiple root packages in some cases
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state
        neo4jSession.run("MATCH (package:Package) RETURN package.fqn as fqn, 0 as complexity, 1 as loc UNION MATCH (package)-[:CONTAINS]->(class:Type), (class)-[:DECLARES]->(method:Method) RETURN class.fqn as fqn, sum(method.cyclomaticComplexity) as complexity, sum(method.effectiveLineCount) as loc")
            .then(function (result) {
                // collect results
                result.records.forEach(function (record) {
                    var recordConverted = {
                        "name": record.get("fqn"),
                        "complexity": record.get("complexity").low,
                        "loc": record.get("loc").low
                    };
                    flatData.push(recordConverted);
                });

                // add projectname as root
                var root = {
                    "name": projectName,
                    "complexity": 0,
                    "loc": 1 // at least 1 to make it visible
                };
                flatData.push(root);

                // turn flat json into hierarchical json
                var stratify = d3.stratify()
                    .id(function (d) {
                        return d.name;
                    })
                    .parentId(function (d) {
                        if (d.name.lastIndexOf(".") != -1) { // classes and subpackes
                            return d.name.substring(0, d.name.lastIndexOf("."));
                        } else if (d.name != projectName) { // a root package
                            return projectName;
                        } else { // project name as root
                            return "";
                        }
                    });
                hierarchicalData = stratify(flatData);

                //normalize recursively all childs (move information from .data to the element's root where nivo expects it)
                var normalize = function(hierarchicalData) {
                    for (var i = 0; i < hierarchicalData.children.length; i++) {
                        hierarchicalData.children[i].name = hierarchicalData.children[i].data.name;
                        hierarchicalData.children[i].loc = hierarchicalData.children[i].data.loc;
                        hierarchicalData.children[i].complexity = hierarchicalData.children[i].data.complexity;
                        if (hierarchicalData.children[i].children) {
                            normalize(hierarchicalData.children[i]);
                        }
                    }
                }
                normalize(hierarchicalData);

                neo4jSession.close();

                //normalize the root element
                hierarchicalData.name = hierarchicalData.id;
                hierarchicalData.loc = hierarchicalData.data.loc;
                hierarchicalData.complexity = hierarchicalData.data.complexity;

                //window.hierarchicalData = hierarchicalData;
                //window.hotSpotData = thisBackup.state.hotSpotData;

                //console.log(hierarchicalData);
                //console.log(thisBackup.state.hotSpotData);
/*
                var seen = [];
                var test = JSON.stringify(hierarchicalData, function(key, val) {
                    if (val != null && typeof val == "object") {
                        if (seen.indexOf(val) >= 0) {
                            return;
                        }
                        seen.push(val);
                    }

                    return val;
                }, 2);
*/
//                console.log(test);

            }).then( function(context) {
                //this currently explodes
                thisBackup.setState({hotSpotData: hierarchicalData});
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <h2>Hotspots</h2>
                <div style={{height: "600px"}}>
                    <ResponsiveBubble
                        root={this.state.hotSpotData}
                        margin={{
                            "top": 20,
                            "right": 20,
                            "bottom": 20,
                            "left": 20
                        }}
                        identity="name"
                        value="loc"
                        colors="nivo"
                        colorBy="depth"
                        padding={6}
                        labelTextColor="inherit:darker(0.8)"
                        borderWidth={2}
                        defs={[
                            {
                                "id": "lines",
                                "type": "patternLines",
                                "background": "none",
                                "color": "inherit",
                                "rotation": -45,
                                "lineWidth": 5,
                                "spacing": 8
                            }
                        ]}
                        fill={[
                            {
                                "match": {
                                    "depth": 1
                                },
                                "id": "lines"
                            }
                        ]}
                        animate={true}
                        motionStiffness={90}
                        motionDamping={12}
                    />
                </div>
            </div>
        )
    }
}

export default RiskManagementHotspotsBubbleChartWithNavigationTreeAndHotspots;
