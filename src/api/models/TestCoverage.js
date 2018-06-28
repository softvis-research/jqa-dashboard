import {neo4jSession} from "../../views/Dashboard/AbstractDashboardComponent";
import * as d3 from "d3";

class TestCoverageModel {

    readTestCoverage(thisBackup, projectName) {
        var flatData = [];
        var hierarchicalData = [];
        var collectedNames = [];

        neo4jSession.run(
            "MATCH (c:Jacoco:Class)-[:HAS_METHODS]->(m:Method:Jacoco)-[:HAS_COUNTERS]->(cnt:Counter) " +
            "WHERE cnt.type='INSTRUCTION' " +
            "RETURN  c.fqn as fqn, m.signature as signature,(cnt.covered*100)/(cnt.covered+cnt.missed) as coverage, cnt.covered+cnt.missed as loc " +
            "ORDER BY fqn, signature ASCENDING"
        ).then(function (result) {
            var idCounter = 1;
            // collect results
            result.records.forEach(function (record) {
                var name = record.get("fqn");

                //add signature as element
                var recordConverted = {
                    "id": idCounter,
                    "name": record.get("signature"),
                    "fqn": name,
                    "coverage": record.get("coverage").low,
                    "loc": record.get("loc").low,
                    "level": name.split(".").length + 1,
                    "role": "leaf"
                };
                flatData.push(recordConverted);

                //add current fqn to elements
                if (!collectedNames[name]) {
                    idCounter++;
                    collectedNames[name] = idCounter;
                    flatData.push({
                        "id": idCounter,
                        "name": name,
                        "coverage": -1,
                        "loc": 0,
                        "level": name.split(".").length
                    });
                }

                //fill packages to allow stratify()
                var level = 0;
                while (name.lastIndexOf(".") !== -1) {
                    idCounter++;
                    level = name.split(".").length - 1;
                    name = name.substring(0, name.lastIndexOf("."));
                    if (!collectedNames[name]) {
                        collectedNames[name] = idCounter;
                        flatData.push({
                            "id": idCounter,
                            "name": name,
                            "coverage": -1,
                            "loc": 0,
                            "level": level
                        });
                    }
                }
                idCounter++;
            });

            var stratify = d3.stratify()
                .id(function (d) {
                    return d.id;
                })
                .parentId(function (d) {
                    if (d.fqn) {
                        return collectedNames[d.fqn];
                    }

                    if (d.name.lastIndexOf(".") !== -1) { // classes and subpackes
                        return collectedNames[d.name.substring(0, d.name.lastIndexOf("."))];
                    }

                    if (d.name !== projectName) { // a root package
                        return collectedNames[projectName];
                    } else { // project name as root
                        return undefined;
                    }
                });

            // add projectname as root
            try {
                hierarchicalData = stratify(flatData);
            } catch (e) {
                var root = {
                    "id": 0,
                    "name": projectName,
                    "coverage": -1,
                    "loc": 0,
                    "level": 0
                };
                flatData.push(root);
                collectedNames[projectName] = 0;
                hierarchicalData = stratify(flatData);
            }

            //normalize recursively all childs (move information from .data to the element's root where nivo expects it)
            var normalize = function(hierarchicalData) {
                for (var i = 0; i < hierarchicalData.children.length; i++) {
                    hierarchicalData.children[i].key = hierarchicalData.children[i].data.id;
                    hierarchicalData.children[i].coverage = hierarchicalData.children[i].data.coverage;
                    hierarchicalData.children[i].loc = hierarchicalData.children[i].data.loc;

                    if (!hierarchicalData.children[i].data.fqn) {
                        var lastDot = hierarchicalData.children[i].data.name.lastIndexOf(".");
                        hierarchicalData.children[i].name = hierarchicalData.children[i].data.name.substring(lastDot + 1);
                    } else {
                        hierarchicalData.children[i].name = hierarchicalData.children[i].data.name;
                    }

                    if (hierarchicalData.children[i].children) {
                        normalize(hierarchicalData.children[i]);
                    }
                }
            };

            normalize(hierarchicalData);
            //normalize the root element
            hierarchicalData.key = hierarchicalData.data.id;
            hierarchicalData.name = hierarchicalData.data.name;
            hierarchicalData.coverage = hierarchicalData.data.coverage;
            hierarchicalData.loc = hierarchicalData.data.loc;

            neo4jSession.close();
        }).then( function(context) {
            thisBackup.setState({testCoverageData: hierarchicalData});
            //console.log(hierarchicalData);
        }).catch(function (error) {
            console.log(error);
        });
    }
}

export default TestCoverageModel;