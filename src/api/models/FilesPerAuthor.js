import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";

class FilesPerAuthorModel {
    constructor(props) {
        const filesPerAuthorQuery =
            "MATCH (a:Author)-[:COMMITTED]->(c:Commit)-[:CONTAINS_CHANGE]->(:Change)-[:MODIFIES]->(file:File) " +
            "WHERE NOT c:Merge AND c.date >= {startDate} AND c.date <= {endDate} " +
            "RETURN a.name as author, count(file) as files " +
            "ORDER BY files DESC";
        localStorage.setItem(
            "files_per_author_original_query",
            filesPerAuthorQuery
        );

        this.state = {
            queryStringFilesPerAuthor: filesPerAuthorQuery
        };

        if (!localStorage.getItem("files_per_author_expert_query")) {
            localStorage.setItem(
                "files_per_author_expert_query",
                this.state.queryStringFilesPerAuthor
            );
        } else {
            this.state.queryStringFilesPerAuthor = localStorage.getItem(
                "files_per_author_expert_query"
            );
        }
    }

    readFilesPerAuthor(thisBackup, startDate, endDate) {
        var aggregatedData = [];
        var recordCount = 0;

        neo4jSession
            .run(this.state.queryStringFilesPerAuthor, {
                startDate: startDate,
                endDate: endDate
            })
            .then(function(result) {
                result.records.forEach(function(record) {
                    var recordConverted = {
                        author: record.get(0),
                        files: record.get(1).low
                    };

                    if (recordCount < 20) {
                        //above 20 records makes the chart unreadable
                        aggregatedData.push(recordConverted);
                    }
                    recordCount++;
                });
            })
            .then(function(context) {
                thisBackup.setState({
                    filesPerAuthor: aggregatedData.reverse()
                }); //reverse reverses the order of the array (because the chart is flipped this is neccesary)
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}

export default FilesPerAuthorModel;
