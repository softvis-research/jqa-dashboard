import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";

class LayersModel {
    constructor(props) {
        const layersQuery =
            "MATCH (l1:Directory)-[:CONTAINS]->(t1:Directory) " +
            "WITH l1, collect(t1.name) AS Children " +
            "WHERE l1.fqn = 'org.junit' " +
            "RETURN l1.name AS Node, Children " +
            "ORDER BY Node, Children";
        localStorage.setItem("layers_query", layersQuery);

        this.state = {
            queryString: layersQuery
        };
    }

    getData() {}

    readLayers(visualization) {
        let layersData = [];
        neo4jSession
            .run(this.state.queryString)
            .then(result => {
                result.records.forEach(record => {
                    let convertedRecord = {
                        name: record.get("Node"),
                        children: record.get("Children")
                    };
                    layersData.push(convertedRecord);
                });
            })
            .then(() => {
                visualization.setState({
                    layersData: layersData
                });
            })
            .catch(error => {
                console.log("Error: " + error);
            });
    }
}

export default LayersModel;
