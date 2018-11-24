import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";

class LatestCommitsModel {
    constructor(props) {
        const latestCommitsQuery =
            "MATCH (a:Author)-[:COMMITTED]->(c:Commit)-[:CONTAINS_CHANGE]->(:Change)-[:MODIFIES]->(file:File) " +
            "WHERE NOT c:Merge AND c.date >= {startDate} AND c.date <= {endDate} " +
            "RETURN DISTINCT a.name, c.date, c.message " +
            "ORDER BY c.date desc " +
            "LIMIT 20";
        localStorage.setItem(
            "latest_commits_original_query",
            latestCommitsQuery
        );

        this.state = {
            queryStringLatestCommits: latestCommitsQuery
        };

        if (!localStorage.getItem("latest_commits_expert_query")) {
            localStorage.setItem(
                "latest_commits_expert_query",
                this.state.queryStringLatestCommits
            );
        } else {
            this.state.queryStringLatestCommits = localStorage.getItem(
                "latest_commits_expert_query"
            );
        }
    }

    readLatestCommits(thisBackup, startDate, endDate) {
        var aggregatedData = [];

        neo4jSession
            .run(this.state.queryStringLatestCommits, {
                startDate: startDate,
                endDate: endDate
            })
            .then(function(result) {
                result.records.forEach(function(record) {
                    var recordConverted = {
                        author: record.get(0),
                        date: record.get(1),
                        message: record.get(2)
                    };

                    aggregatedData.push(recordConverted);
                });
            })
            .then(function(context) {
                thisBackup.setState({ latestCommits: aggregatedData }); //reverse reverses the order of the array (because the chart is flipped this is neccesary)
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}

export default LatestCommitsModel;
