import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";

class LayersModel {
    constructor(props) {
        const networkQuery =
            "MATCH (package:Package)-[:CONTAINS]->(layer:Layer), (layer)-[:CONTAINS]->(dependent:Type) " +
            "RETURN package.name, layer.name, collect(dependent.name) as dependents";
        const dependencyQuery =
            "MATCH (:Layer)-[:CONTAINS]->(dependent:Type)-[:DEPENDS_ON]->(dependency:Type)<-[:CONTAINS]-(:Layer) " +
            "RETURN dependent.name, collect(dependency.name) as dependencies";

        this.state = {
            networkQuery: networkQuery,
            dependencyQuery: dependencyQuery
        };
    }

    readLayers(thisBackup) {
        let nodes = [];
        let links = [];

        neo4jSession.run(this.state.networkQuery).then(result => {
            console.log(result);
            result.records.forEach(record => {
                if (!this.nodeExists(nodes, record)) {
                    this.appendNode(
                        nodes,
                        record.get("package.name"),
                        16,
                        1,
                        "rgb(108,121,241)"
                    );
                }
                if (!nodes.includes(record.get("layer.name"))) {
                    this.appendNode(
                        nodes,
                        record.get("layer.name"),
                        12,
                        1,
                        "rgb(97, 205, 187)"
                    );
                    this.appendLink(
                        links,
                        record.get("package.name"),
                        record.get("layer.name")
                    );
                    record.get("dependents").forEach(dependent => {
                        if (!nodes.includes(dependent)) {
                            this.appendNode(
                                nodes,
                                dependent,
                                4,
                                2,
                                "rgb(232, 193, 160)"
                            );
                            this.appendLink(
                                links,
                                record.get("layer.name"),
                                dependent
                            );
                        }
                    });
                }
            });
        });

        neo4jSession.run(this.state.dependencyQuery).then(() => {
            console.log(nodes, links);
            thisBackup.setState({
                nodes: nodes,
                links: links
            });
        });
    }

    appendLink(links, source, target) {
        links.push({
            source: source,
            target: target,
            distance: 100
        });
    }

    appendNode(nodes, id, radius, depth, color) {
        nodes.push({
            id: id,
            radius: radius,
            depth: depth,
            color: color
        });
    }

    nodeExists(nodes, record) {
        return nodes.some(node => node.id === record.get("package.name"));
    }
}

export default LayersModel;
