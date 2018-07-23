import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";
import CirclePackingHelper from "../utils/CirclePacking";
import DashboardAbstract from "../../views/Dashboard/AbstractDashboardComponent";

class TestCoverageModel extends DashboardAbstract {
    readTestCoverage(thisBackup, projectName) {
        var flatData = [];
        var hierarchicalData = [];
        var collectedNames = [];
        var cpHelper = new CirclePackingHelper();

        neo4jSession
            .run(
                "MATCH (c:Jacoco:Class)-[:HAS_METHOD]->(m:Method:Jacoco)-[:HAS_COUNTER]->(cnt:Counter) " +
                    "WHERE cnt.type='INSTRUCTION' " +
                    "RETURN  c.fqn as fqn, m.signature as signature,(cnt.covered*100)/(cnt.covered+cnt.missed) as coverage, cnt.covered+cnt.missed as loc " +
                    "ORDER BY fqn, signature ASCENDING"
            )
            .then(function(result) {
                var idCounter = 1;
                // collect results
                result.records.forEach(function(record) {
                    var name = record.get("fqn");

                    //add signature as element
                    var recordConverted = {
                        id: idCounter,
                        name: record.get("signature"),
                        fqn: name,
                        coverage: record.get("coverage").low,
                        loc: record.get("loc").low,
                        level: name.split(".").length + 1,
                        role: "leaf"
                    };
                    flatData.push(recordConverted);

                    //add current fqn to elements
                    if (!collectedNames[name]) {
                        idCounter++;
                        collectedNames[name] = idCounter;
                        flatData.push({
                            id: idCounter,
                            name: name,
                            coverage: -1,
                            loc: 0,
                            level: name.split(".").length
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
                                id: idCounter,
                                name: name,
                                coverage: -1,
                                loc: 0,
                                level: level
                            });
                        }
                    }
                    idCounter++;
                });

                hierarchicalData = cpHelper.circlePackingById(
                    projectName,
                    flatData,
                    collectedNames
                );
                console.log(flatData);
                cpHelper.normalizeTestCoverage(hierarchicalData);

                //normalize the root element
                hierarchicalData.key = hierarchicalData.data.id;
                hierarchicalData.name = hierarchicalData.data.name;
                hierarchicalData.coverage = hierarchicalData.data.coverage;
                hierarchicalData.loc = hierarchicalData.data.loc;

                neo4jSession.close();
            })
            .then(function(context) {
                thisBackup.setState({ testCoverageData: hierarchicalData });
                //console.log(hierarchicalData);
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}

export default TestCoverageModel;
