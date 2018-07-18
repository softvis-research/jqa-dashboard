import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";

class FileTypesModel {
    readFiletypes(thisBackup) {
        var aggregatedData = [];

        neo4jSession
            .run(
                "MATCH (f:Git:File) " +
                    'WITH f, split(f.relativePath, ".") as splittedFileName ' +
                    "SET f.type = splittedFileName[size(splittedFileName)-1] " +
                    "RETURN f.type as filetype, count(f) as files " +
                    "ORDER BY files DESC"
            )
            .then(function(result) {
                result.records.forEach(function(record) {
                    var recordConverted = {
                        id: record.get(0),
                        label: record.get(0),
                        value: record.get(1).low
                    };

                    if (
                        recordConverted.id !== null &&
                        recordConverted.value > 3
                    ) {
                        //below 3 is considered too small to display
                        aggregatedData.push(recordConverted);
                    }
                });
            })
            .then(function(context) {
                thisBackup.setState({ filetypeData: aggregatedData });
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}

export default FileTypesModel;
