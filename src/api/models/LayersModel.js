import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";
import * as d3 from "d3";

class LayersModel {
    constructor(props) {
        const layersQuery =
            "MATCH (package:Package)-[:CONTAINS]->(layer:Layer)-[:CONTAINS]->(child:Type)-[:DECLARES]->(method:Method) " +
            "RETURN package.name as package, layer.name as layer, child.name as child, sum(method.effectiveLineCount) as loc";

        const dependenciesQuery =
            "MATCH (l1:Layer)-[:CONTAINS]->(dependent:Type)-[:DEPENDS_ON]->(dependency:Type)<-[:CONTAINS]-(l2:Layer) " +
            "WHERE NOT (l1.name)=(l2.name) " +
            "RETURN l1.name AS dependentLayer, l2.name AS dependencyLayer, dependent.name AS dependent, dependency.name AS dependency " +
            "ORDER BY dependentLayer, dependencyLayer";

        this.state = {
            layersQuery: layersQuery,
            dependenciesQuery: dependenciesQuery,
            validDependencyDirection: ["web", "service", "model", "repository"]
        };
    }

    readLayers(that) {
        let visualizationData = [];
        let treeData = [];
        let visualizationRoot;
        let treeRoot;

        neo4jSession.run(this.state.layersQuery).then(result => {
            result.records.forEach(record => {
                if (
                    !this.nodeExists(visualizationData, record.get("package"))
                ) {
                    this.appendNonLeafNode(
                        visualizationData,
                        record.get("package"),
                        "",
                        "#F6FBFC"
                    );
                    this.appendNonLeafNode(
                        treeData,
                        record.get("package"),
                        "",
                        ""
                    );
                }
                if (!this.nodeExists(visualizationData, record.get("layer"))) {
                    this.appendNonLeafNode(
                        visualizationData,
                        record.get("layer"),
                        record.get("package"),
                        "#CCECE6"
                    );
                    this.appendNonLeafNode(
                        treeData,
                        record.get("layer"),
                        record.get("package"),
                        "#CCECE6"
                    );
                }
                if (record.get("loc").low === 0) {
                    record.get("loc").low = 1;
                }
                this.appendLeafNode(
                    visualizationData,
                    record.get("child"),
                    "#66C2A4",
                    record.get("layer"),
                    record.get("loc").low
                );
            });
        });

        neo4jSession
            .run(this.state.dependenciesQuery)
            .then(result => {
                result.records.forEach(record => {
                    if (this.dependencyIsValid(record)) {
                        treeData.push({
                            id: record.get("dependent"),
                            parent: record.get("dependentLayer"),
                            dependency: record.get("dependency"),
                            dependencyLayer: record.get("dependencyLayer"),
                            dependencyIsValid: true
                        });
                    } else {
                        treeData.push({
                            id: record.get("dependent"),
                            parent: record.get("dependentLayer"),
                            dependency: record.get("dependency"),
                            dependencyLayer: record.get("dependencyLayer"),
                            dependencyIsValid: false
                        });
                    }
                });
            })
            .then(() => {
                console.log("visualizationData", visualizationData);
                console.log("treedata", treeData);
                visualizationRoot = d3
                    .stratify()
                    .id(node => {
                        return node.id;
                    })
                    .parentId(node => {
                        return node.parent;
                    })(visualizationData);

                treeRoot = d3
                    .stratify()
                    .id(node => {
                        return node.id;
                    })
                    .parentId(node => {
                        return node.parent;
                    })(treeData);
            })
            .then(() => {
                console.log("visualizationRoot", visualizationRoot);
                console.log("treeRoot", treeRoot);
                this.convertDataForVisualization(visualizationRoot);
                this.convertDataForTree(treeRoot);
            })
            .then(() => {
                that.setState({
                    visualizationData: visualizationRoot,
                    treeData: treeRoot
                });
            });
    }

    changeColor(data, nodeId) {
        data.find(node => node.id === nodeId).color = "#EF6548";
    }

    dependencyIsValid(record) {
        return (
            this.state.validDependencyDirection.indexOf(
                record.get("dependentLayer")
            ) <
            this.state.validDependencyDirection.indexOf(
                record.get("dependencyLayer")
            )
        );
    }

    convertDataForVisualization(root) {
        root.color = root.data.color;
        root.name = root.id;
        for (let i = 0; i < root.children.length; i++) {
            root.children[i].color = root.children[i].data.color;
            root.children[i].loc = root.children[i].data.loc;
            if (root.children[i].children) {
                this.convertDataForVisualization(root.children[i]);
            }
        }
    }

    convertDataForTree(root) {
        root.name = root.id;
        root.toggled = false;
        for (let i = 0; i < root.children.length; i++) {
            root.children[i].name = root.children[i].id;
            root.children[i].toggled = false;
            if (root.children[i].children) {
                root.children[i].children.forEach(child => {
                    child.name =
                        child.data.id + " accesses " + child.data.dependency;
                });
            }
        }
    }

    appendNonLeafNode(dataset, id, parent, color) {
        dataset.push({
            id: id,
            parent: parent,
            color: color,
            violations: []
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
