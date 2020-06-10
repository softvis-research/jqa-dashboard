import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";

class DependenciesModel {
    constructor(props) {
        const dependenciesQuery =
            "MATCH (:Artifact)-[:CONTAINS]->(dependent:Type), (:Artifact)-[:CONTAINS]->(dependency:Type), (dependent_package:Package)-[:CONTAINS]->(dependent)-[depends:DEPENDS_ON]->(dependency)<-[:CONTAINS]-(dependency_package:Package) " +
            "WITH dependent_package.fqn as dependent, dependency_package.fqn as dependency, count(dependency) as dependencies " +
            "RETURN  dependent , dependency, dependencies ORDER BY dependent, dependency";
        localStorage.setItem("dependencies_original_query", dependenciesQuery);

        this.state = {
            queryString: dependenciesQuery
        };

        if (!localStorage.getItem("dependencies_expert_query")) {
            localStorage.setItem(
                "dependencies_expert_query",
                this.state.queryString
            );
        } else {
            this.state.queryString = localStorage.getItem(
                "dependencies_expert_query"
            );
        }
    }

    readDependencies(thisBackup) {
        var aggregatedData = [];
        var keyList = [];
        var chordData = [];

        neo4jSession
            .run(this.state.queryString)
            .then(function(result) {
                result.records.forEach(function(record) {
                    var recordConverted = {
                        dependent: record.get("dependent"),
                        dependency: record.get("dependency"),
                        dependencies: record.get("dependencies").low
                    };

                    if (!aggregatedData[recordConverted.dependent]) {
                        aggregatedData[recordConverted.dependent] = [];
                    }
                    aggregatedData[recordConverted.dependent][
                        recordConverted.dependency
                    ] = recordConverted.dependencies;
                });
            })
            .then(function(context) {
                var counter = 0;
                for (var i in aggregatedData) {
                    keyList[counter++] = i;
                }
                //console.log(keyList);
            })
            .then(function(context) {
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
            })
            .then(function(context) {
                //console.log(chordData);
                //chordData = matrixUtilities.flip(chordData); //maybe TODO: if called components should be more visible than callers this could be useful
                thisBackup.setState({
                    finalMatrixData: chordData,
                    finalMatrixKeys: keyList
                });
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}

export default DependenciesModel;
