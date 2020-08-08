import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";
import * as d3 from "d3";

class LayersModel {
    constructor(props) {
        const layersQuery =
            "MATCH (package:Package)-[:CONTAINS]->(layer:Layer), (layer)-[:CONTAINS]->(dependent:Type), (dependent)-[:DECLARES]->(method:Method) " +
            "RETURN package.name, layer.name, dependent.name, sum(method.effectiveLineCount) as loc";

        this.state = {
            layersQuery: layersQuery
        };
    }

    readLayers(that) {
        neo4jSession.run(this.state.layersQuery).then(result => {
            console.log(result);
            result.records.forEach(record => {
                if (!this.hasNode(root, record.get("package.name"))) {
                    root.name = record.get("package.name");
                    root.color = "hsl(228, 70%, 50%)";
                    root.children = [];
                }
                if (!this.hasNode(root, record.get("layer.name"))) {
                    this.appendNode(
                        root,
                        record.get("package.name"),
                        this.createNode(
                            record.get("layer.name"),
                            "hsl(111, 70%, 50%)"
                        )
                    );
                    this.appendNode(
                        root,
                        record.get("layer.name"),
                        this.createNode(
                            record.get("dependent.name"),
                            "hsl(204, 70%, 50%)"
                        )
                    );
                }
            });
            console.log(root);
        });
    }

    hasNode(root, name) {
        if (this.isEmpty(root)) return false;
        if (root.name === name) return true;
        for (let child of root.children) {
            if (child.name === name) {
                return true;
            }
        }
    }

    isEmpty(root) {
        return Object.keys(root).length === 0 && root.constructor === Object;
    }

    createNode(name, color) {
        return {
            name: name,
            color: color,
            children: []
        };
    }

    appendNode(root, parent, child) {
        debugger;
        const parentNode = this.findParent(root, parent);
        console.log(parentNode);
        parentNode.children.push(child);
    }

    findParent(root, parentName) {
        if (root.name === parentName) {
            return parentName;
        }
        debugger;
        let result;
        for (let child of root.children) {
            console.log(child);
            // result = this.findParent(child.children, name)
            // if (result) return result;
        }
    }
}

export default LayersModel;
