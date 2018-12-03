import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";

var groupArray = require("group-array");
var arraySort = require("array-sort");

class PMDModel {
    constructor(props) {
        const pmdQuery =
            "MATCH (:Report)-[:HAS_FILE]->(file:File:Pmd)-[:HAS_VIOLATION]->(violation:Violation) RETURN file.fqn, violation.package, violation.className, violation.method, violation.beginLine, violation.endLine, violation.beginColumn, violation.endColumn, violation.message, violation.ruleSet, violation.priority, violation.externalInfoUrl";
        localStorage.setItem("pmd_original_query", pmdQuery);

        this.state = {
            queryString: pmdQuery
        };

        if (!localStorage.getItem("pmd_expert_query")) {
            localStorage.setItem("pmd_expert_query", this.state.queryString);
        } else {
            this.state.queryString = localStorage.getItem("pmd_expert_query");
        }
    }

    readPmdData(thisBackup) {
        var pmdData = [];

        neo4jSession
            .run(this.state.queryString)
            .then(function(result) {
                result.records.forEach(function(record) {
                    pmdData.push({
                        fqn: record.get(0),
                        package: record.get(1),
                        className: record.get(2),
                        method: record.get(3),
                        beginLine: record.get(4).low,
                        endLine: record.get(5).low,
                        beginColumn: record.get(6).low,
                        endColumn: record.get(7).low,
                        message: record.get(8),
                        ruleSet: record.get(9),
                        priority: record.get(10).low,
                        externalInfoUrl: record.get(11)
                    });
                });
            })
            .then(function(context) {
                // output preparation: sort all violations by priority
                pmdData = arraySort(pmdData, "priority");
                // output preparation: group all violations by rule set
                pmdData = groupArray(pmdData, "ruleSet");

                thisBackup.setState({ pmdData: pmdData });
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}

export default PMDModel;
