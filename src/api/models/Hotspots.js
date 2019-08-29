import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";
import CirclePackingHelper from "../utils/CirclePacking";

var maxCommits = 0;

class HotspotModel {
    constructor(props) {
        const hotspotsQuery =
            "MATCH" +
            " (c:Commit)-[:CONTAINS_CHANGE]->()-[:MODIFIES]->(f:File) " +
            "WHERE NOT" +
            " c:Merge " +
            "WITH" +
            " f, count(c) as commits " +
            "MATCH" +
            " (t:Type)-[:HAS_SOURCE]->(f)," +
            " (t)-[:DECLARES]->(m:Method) " +
            "RETURN" +
            " t.fqn as fqn, sum(commits)/count(m) as commits, sum(m.cyclomaticComplexity) as complexity, sum(m.effectiveLineCount) as loc ORDER BY fqn ASCENDING";
        localStorage.setItem("hotspots_original_query", hotspotsQuery);

        this.state = {
            queryString: hotspotsQuery
        };

        if (!localStorage.getItem("hotspots_expert_query")) {
            localStorage.setItem(
                "hotspots_expert_query",
                this.state.queryString
            );
        } else {
            this.state.queryString = localStorage.getItem(
                "hotspots_expert_query"
            );
        }
    }

    readHotspots(IDENTIFIER_PROJECT_NAME) {
        var flatData = [];
        var commitsData = [];
        var hierarchicalData = [];
        var projectName = localStorage.getItem(IDENTIFIER_PROJECT_NAME); // "PROJECTNAME"; // acts as root as there are multiple root packages in some cases
        var cpHelper = new CirclePackingHelper();

        return neo4jSession
            .run(this.state.queryString)
            .then(function(result) {
                var collectedNames = [];

                maxCommits = 0; //reset value

                // collect results
                result.records.forEach(function(record) {
                    var name = record.get("fqn");
                    var currentCommmits = record.get("commits").low;

                    if (currentCommmits > maxCommits) {
                        maxCommits = currentCommmits;
                    }

                    if (collectedNames[name]) {
                        //if name already present add complexity and loc
                        for (var i = 0; i < flatData.length; i++) {
                            if (flatData[i].name === name) {
                                flatData[i].complexity += record.get(
                                    "complexity"
                                ).low;
                                flatData[i].loc += record.get("loc").low;
                                flatData[i].commits += currentCommmits;
                            }
                        }

                        return; //continue in forEach
                    }
                    collectedNames[name] = 1;
                    var leafLevel = name.split(".").length;

                    var recordConverted = {
                        name: name,
                        complexity: record.get("complexity").low,
                        loc: record.get("loc").low,
                        commits: currentCommmits,
                        level: leafLevel,
                        role: "leaf"
                    };

                    flatData.push(recordConverted);
                    commitsData.push({
                        name: recordConverted.name.replace(/[^\w]/gi, "-"),
                        commits: recordConverted.commits
                    });

                    //fill packages to allow stratify()
                    var level = 0;
                    while (name.lastIndexOf(".") !== -1) {
                        level = name.split(".").length - 1;
                        name = name.substring(0, name.lastIndexOf("."));
                        if (!collectedNames[name]) {
                            collectedNames[name] = 1;
                            flatData.push({
                                name: name,
                                complexity: 0,
                                loc: 0,
                                commits: 0,
                                level: level,
                                role: "node"
                            });
                        }
                    }
                });

                hierarchicalData = cpHelper.circlePackingByName(
                    projectName,
                    flatData
                );
                cpHelper.normalizeHotspots(hierarchicalData); //this function works by reference

                neo4jSession.close();

                //normalize the root element
                hierarchicalData.name = hierarchicalData.id;
                hierarchicalData.loc = hierarchicalData.data.loc;
                hierarchicalData.complexity = hierarchicalData.data.complexity;
                hierarchicalData.commits = hierarchicalData.data.commits;
            })
            .then(function() {
                return {
                    hierarchicalData: hierarchicalData,
                    commitsData: commitsData,
                    maxCommits: maxCommits
                };
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}

export default HotspotModel;
