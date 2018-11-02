import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";

class FileTypesModel {
    constructor(props) {
        this.state = {
            queryString:
                "MATCH (f:Git:File) " +
                'WITH f, split(f.relativePath, ".") as splittedFileName ' +
                "SET f.type = splittedFileName[size(splittedFileName)-1] " +
                "RETURN f.type as filetype, count(f) as files " +
                "ORDER BY files DESC"
        };

        if (!localStorage.getItem("filetype_expert_query")) {
            localStorage.setItem(
                "filetype_expert_query",
                this.state.queryString
            );
        } else {
            this.state.queryString = localStorage.getItem(
                "filetype_expert_query"
            );
        }
    }

    readFiletypes(thisBackup) {
        var aggregatedData = [];

        neo4jSession
            .run(this.state.queryString)
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
