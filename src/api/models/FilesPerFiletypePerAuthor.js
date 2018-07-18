import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";

class FilesPerFiletypePerAuthorModel {
    readData(thisBackup, authorToFilterBy) {
        var aggregatedData = [];
        var aggregatedKeys = [];

        var whereClause = " NOT c:Merge ";
        //console.log(authorToFilterBy);
        if (authorToFilterBy && authorToFilterBy.length > 0) {
            whereClause = " c.author contains '" + authorToFilterBy + "'"; //TODO: contains is a workaround
            //TODO: this could result in a sql injection, proper enconding is needed!
        }

        var query =
            "MATCH " +
            "  (a:Author)-[:COMMITTED]->(c:Commit)-[:CONTAINS_CHANGE]->(:Change)-[:MODIFIES]->(file:File) " +
            "WHERE " +
            whereClause +
            "RETURN " +
            "  file.type as filetype, a.name as author, count(file) as files " +
            "ORDER BY " +
            "  files DESC, filetype ";
        neo4jSession
            .run(query)
            .then(function(result) {
                result.records.forEach(function(record) {
                    var author = record.get(1);
                    var filetype = record.get(0);
                    var files = record.get(2).low;

                    var found = false;
                    aggregatedData.forEach(function(dataSet) {
                        if (dataSet.author === author) {
                            //found: only append author
                            dataSet[filetype] = files;
                            found = true;
                        }
                    });

                    if (!found) {
                        //create dataset
                        aggregatedData.push({
                            author: author
                        });
                        aggregatedData[aggregatedData.length - 1][
                            filetype
                        ] = files;
                    }

                    if (aggregatedKeys.indexOf(filetype) === -1) {
                        aggregatedKeys.push(filetype);
                    }
                });
            })
            .then(function(context) {
                thisBackup.setState({
                    data: aggregatedData.reverse(),
                    dataKeys: aggregatedKeys
                });
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}

export default FilesPerFiletypePerAuthorModel;
