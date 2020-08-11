import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";
import * as d3 from "d3";

class LayersModel {
    constructor(props) {
        const layersQuery =
            "MATCH (package:Package)-[:CONTAINS]->(layer:Layer)-[:CONTAINS]->(child:Type)-[:DECLARES]->(method:Method) " +
            "RETURN package.name as package, layer.name as layer, child.name as child, sum(method.effectiveLineCount) as loc";

        this.state = {
            layersQuery: layersQuery
        };
    }

    readLayers(that) {
        let data = [];
        let root;
        neo4jSession
            .run(this.state.layersQuery)
            .then(result => {
                result.records.forEach(record => {
                    if (!this.nodeExists(data, record.get("package"))) {
                        this.appendNonLeafNode(
                            data,
                            record.get("package"),
                            "#F6FBFC",
                            ""
                        );
                    }
                    if (!this.nodeExists(data, record.get("layer"))) {
                        this.appendNonLeafNode(
                            data,
                            record.get("layer"),
                            "#CCECE6",
                            record.get("package")
                        );
                    }
                    if (record.get("loc").low < 5) {
                        record.get("loc").low = 5;
                    } else {
                        record.get("loc").low = record.get("loc").low + 5;
                    }
                    this.appendLeafNode(
                        data,
                        record.get("child"),
                        "#66C2A4",
                        record.get("layer"),
                        record.get("loc").low
                    );
                });
            })
            .then(() => {
                root = d3
                    .stratify()
                    .id(node => {
                        return node.id;
                    })
                    .parentId(node => {
                        return node.parent;
                    })(data);
            })
            .then(() => {
                this.convertData(root);
            })
            .then(() => {
                that.setState({
                    data: root
                });
            });
    }

    convertData(node) {
        node.color = node.data.color;
        for (let i = 0; i < node.children.length; i++) {
            node.children[i].color = node.children[i].data.color;
            node.children[i].loc = node.children[i].data.loc;
            if (node.children[i].children) {
                this.convertData(node.children[i]);
            }
        }
    }

    appendNonLeafNode(data, id, color, parent) {
        data.push({
            id: id,
            color: color,
            parent: parent
        });
    }

    appendLeafNode(data, id, color, parent, loc) {
        data.push({
            id: id,
            color: color,
            loc: loc,
            parent: parent
        });
    }

    nodeExists(nodes, nodeId) {
        return nodes.some(node => node.id === nodeId);
    }
}

export default LayersModel;
