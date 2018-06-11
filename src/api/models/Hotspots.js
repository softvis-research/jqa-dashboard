import {neo4jSession} from "../../views/Dashboard/AbstractDashboardComponent";
import * as d3 from "d3";

var maxCommits = 0;

class HotspotModel {

    readHotspots(IDENTIFIER_PROJECT_NAME) {
        var flatData = [];
        var commitsData = [];
        var hierarchicalData = [];
        var projectName = localStorage.getItem(IDENTIFIER_PROJECT_NAME); // "PROJECTNAME"; // acts as root as there are multiple root packages in some cases
        //var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

        return neo4jSession.run(
            "MATCH\n" +
            " (c:Commit)-[:CONTAINS_CHANGE]->()-[:MODIFIES]->(f:File)\n" +
            "WHERE NOT\n" +
            " c:Merge\n" +
            "WITH\n" +
            " f, count(c) as commits\n" +
            "MATCH\n" +
            " (t:Type)-[:HAS_SOURCE]->(f),\n" +
            " (t)-[:DECLARES]->(m:Method)\n" +
            "WHERE\n" +
            " f.relativePath STARTS WITH 'src'\n" +
            "RETURN\n" +
            " t.fqn as fqn, sum(commits) as commits, sum(m.cyclomaticComplexity) as complexity, sum(m.effectiveLineCount) as loc ORDER BY fqn ASCENDING"
        ).then(function (result) {
            var collectedNames = [];

            maxCommits = 0; //reset value

            // collect results
            result.records.forEach(function (record) {
                var name = record.get("fqn");
                var currentCommmits = record.get("commits").low;

                if (currentCommmits > maxCommits) {
                    maxCommits = currentCommmits;
                }

                if (collectedNames[name]) { //if name already present add complexity and loc
                    for (var i = 0; i < flatData.length; i++) {
                        if (flatData[i].name === name) {
                            //console.log("----");
                            //console.log(flatData[i]);
                            flatData[i].complexity += record.get("complexity").low;
                            flatData[i].loc += record.get("loc").low;
                            flatData[i].commits += currentCommmits;
                            //console.log(flatData[i]);
                        }
                    }

                    return; //continue in forEach
                }
                collectedNames[name] = 1;
                var leafLevel = name.split(".").length;

                var recordConverted = {
                    "name": name,
                    "complexity": record.get("complexity").low,
                    "loc": record.get("loc").low,
                    "commits": currentCommmits,
                    "level": leafLevel,
                    "role": "leaf"
                };

                flatData.push(recordConverted);
                commitsData.push(
                    {
                        name: recordConverted.name.replace(/[^\w]/gi, '-'),
                        commits: recordConverted.commits
                    }
                );

                //fill packages to allow stratify()
                var level = 0;
                while (name.lastIndexOf(".") !== -1) {
                    level = name.split(".").length - 1;
                    name = name.substring(0, name.lastIndexOf("."));
                    if (!collectedNames[name]) {
                        collectedNames[name] = 1;
                        flatData.push({
                            "name": name,
                            "complexity": 0,
                            "loc": 0,
                            "commits": 0,
                            "level": level,
                            "role": "node"
                        });
                    }
                }
            });
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

            try {
                hierarchicalData = stratify(flatData);
            } catch (e) {
                // add projectname as root
                var root = {
                    "name": projectName,
                    "complexity": 0,
                    "loc": 1, // at least 1 to make it visible
                    "commits": 0,
                    "level": 0,
                    "role": "node"
                };
                flatData.push(root);
                hierarchicalData = stratify(flatData);
            }

            //normalize recursively all childs (move information from .data to the element's root where nivo expects it)
            var normalize = function(hierarchicalData) {
                for (var i = 0; i < hierarchicalData.children.length; i++) {
                    var lastDot = hierarchicalData.children[i].data.name.lastIndexOf(".");
                    hierarchicalData.children[i].name = hierarchicalData.children[i].data.name.substring(lastDot + 1);
                    hierarchicalData.children[i].loc = hierarchicalData.children[i].data.loc;
                    hierarchicalData.children[i].complexity = hierarchicalData.children[i].data.complexity;
                    if (hierarchicalData.children[i].children) {
                        normalize(hierarchicalData.children[i]);
                    }
                }
            };

            normalize(hierarchicalData);

            neo4jSession.close();

            //normalize the root element
            hierarchicalData.name = hierarchicalData.id;
            hierarchicalData.loc = hierarchicalData.data.loc;
            hierarchicalData.complexity = hierarchicalData.data.complexity;
            hierarchicalData.commits = hierarchicalData.data.commits;

            //console.log(hierarchicalData);
        }).then(function() {
            return {
                hierarchicalData: hierarchicalData,
                commitsData: commitsData,
                maxCommits: maxCommits
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

}

export default HotspotModel;