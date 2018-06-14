import React, { Component } from 'react';
import DashboardAbstract, {databaseCredentialsProvided, neo4jSession} from "../../../AbstractDashboardComponent";
import { ResponsiveChord } from '@nivo/chord';

class DependencyChord extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
            finalMatrixData: [],
            finalMatrixKeys: [],
        };
    }

    componentDidMount() {
        super.componentDidMount();

        if (databaseCredentialsProvided) {
            this.readDependencies();
        }
    }

    readDependencies() {
        var aggregatedData = [];
        var keyList = [];
        var chordData = [];

        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

        neo4jSession.run(
            'MATCH (dependent_package:Package)-[:CONTAINS]->(dependent:Type)-[depends:DEPENDS_ON]->(dependency:Type)<-[:CONTAINS]-(dependency_package:Package) WHERE (dependent)-[:HAS_SOURCE]->(:File) AND (dependency)-[:HAS_SOURCE]->(:File) WITH dependent_package.fqn as dependent, dependency_package.fqn as dependency, count(dependency) as dependencies  RETURN  dependent , dependency, dependencies ORDER BY dependent, dependency'
        ).then(function (result) {
            result.records.forEach(function (record) {

                var recordConverted = {
                    "dependent": record.get('dependent'),
                    "dependency": record.get('dependency'),
                    "dependencies": record.get('dependencies').low
                };

                if (!aggregatedData[recordConverted.dependent]) {
                    aggregatedData[recordConverted.dependent] = [];
                }
                aggregatedData[recordConverted.dependent][recordConverted.dependency] = recordConverted.dependencies;
            });
        }).then( function(context) {
            var counter = 0;
            for (var i in aggregatedData) {
                keyList[counter++] = i;
            }
            //console.log(keyList);
        }).then( function(context) {
            for (var dependent in keyList) {
                var tmpArray = [];

                var dependencyData = aggregatedData[keyList[dependent]];
                for (var dependency in keyList) {
                    if (dependencyData[keyList[dependency]]) {
                        tmpArray.push(dependencyData[keyList[dependency]]);
                    } else {
                        tmpArray.push(0);
                    }
                }
                chordData.push(tmpArray);
            }
        }).then( function(context) {
            //console.log(chordData);
            //chordData = matrixUtilities.flip(chordData); //maybe TODO: if called components should be more visible than callers this could be useful
            thisBackup.setState({
                finalMatrixData: chordData,
                finalMatrixKeys: keyList
            });
        }).catch(function (error) {
            console.log(error);
        });
    }

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
            return(redirect);
        }

        if (this.state.finalMatrixData.length === 0) {
            return '';
        }

        return (
            <div style={{height: "700px"}}>
                <ResponsiveChord
                    matrix={this.state.finalMatrixData}
                    keys={this.state.finalMatrixKeys}
                    margin={{
                        "top": 170,
                        "right": 170,
                        "bottom": 170,
                        "left": 170
                    }}
                    padAngle={0.02}
                    innerRadiusRatio={0.96}
                    innerRadiusOffset={0.02}
                    arcOpacity={1}
                    arcBorderWidth={1}
                    arcBorderColor="inherit:darker(0.4)"
                    ribbonOpacity={0.5}
                    ribbonBorderWidth={1}
                    ribbonBorderColor="inherit:darker(0.4)"
                    enableLabel={true}
                    label="id"
                    labelOffset={12}
                    labelRotation={-90}
                    labelTextColor="inherit:darker(1)"
                    colors="nivo"
                    isInteractive={true}
                    arcHoverOpacity={1}
                    arcHoverOthersOpacity={0.25}
                    ribbonHoverOpacity={0.75}
                    ribbonHoverOthersOpacity={0.01}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={7}
                />
            </div>
        )
    }
}

export default DependencyChord;
