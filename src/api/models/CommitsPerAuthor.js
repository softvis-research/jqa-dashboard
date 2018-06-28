import {neo4jSession} from "../../views/Dashboard/AbstractDashboardComponent";

class CommitsPerAuthorModel {

    readCommitsPerAuthor(thisBackup, startDate, endDate) {
        var aggregatedData = [];
        var recordCount = 0;

        neo4jSession.run(
            'MATCH (a:Author)-[:COMMITTED]->(c:Commit)-[:CONTAINS_CHANGE]->(:Change)-[:MODIFIES]->(file:File) ' +
            'WHERE NOT c:Merge AND c.date >= {startDate} AND c.date <= {endDate} ' +
            'RETURN a.name as author, count(distinct c) as commits ' +
            'ORDER BY commits DESC',
            {
                startDate: startDate,
                endDate: endDate
            }
        ).then(function (result) {
            result.records.forEach(function (record) {
                var recordConverted = {
                    "author": record.get(0),
                    "commits": record.get(1).low
                };

                if (recordCount < 20) { //above 20 records makes the chart unreadable
                    aggregatedData.push(recordConverted);
                }
                recordCount++;
            });
        }).then( function(context) {
            thisBackup.setState({commitsPerAuthor: aggregatedData.reverse()}); //reverse reverses the order of the array (because the chart is flipped this is neccesary)
        }).catch(function (error) {
            console.log(error);
        });
    }

}

export default CommitsPerAuthorModel;