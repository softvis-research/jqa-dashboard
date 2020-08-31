import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";
import * as d3 from "d3";

class LayersModel {
    constructor(props) {
        const layersQuery =
            "MATCH (package:Package)-[:CONTAINS]->(layer:Layer)-[:CONTAINS]->(child:Type)-[:DECLARES]->(method:Method) " +
            "RETURN package.name as package, layer.name as layer, child.name as child, sum(method.effectiveLineCount) as loc " +
            "ORDER BY layer.name, child.name";

        const dependenciesQuery =
            "MATCH (l1:Layer)-[:CONTAINS]->(dependent:Type)-[:DEPENDS_ON]->(dependency:Type)<-[:CONTAINS]-(l2:Layer) " +
            "WHERE NOT (l1.name)=(l2.name) " +
            "RETURN l1.name AS dependentLayer, l2.name AS dependencyLayer, dependent.name AS dependent, dependency.name AS dependency " +
            "ORDER BY dependentLayer, dependencyLayer, dependent";

        const dependencyDefinitionQuery =
            "MATCH (dependent:Layer)-[:DEFINES_DEPENDENCY]->(dependency:Layer) " +
            "RETURN dependent.name as dependent, collect(dependency.name) as dependencies";

        this.state = {
            layersQuery: layersQuery,
            dependenciesQuery: dependenciesQuery,
            dependencyDefinitionQuery: dependencyDefinitionQuery,
            validDependencies: []
        };
    }

    readLayers(that) {
        const COLORS = {
            PACKAGE: "#F6FBFC",
            LAYER: "#CCECE6",
            VALID_LEAF: "#66C2A4",
            INVALID_LEAF: "#ef654c"
        };
        let visualizationData = [];
        let treeData = [];
        let dependencies = [];
        let visualizationRoot;
        let treeRoot;

        neo4jSession.run(this.state.dependencyDefinitionQuery).then(result => {
            const validDependencies = [];
            result.records.forEach(record => {
                record.get("dependencies").forEach(dependency => {
                    validDependencies.push({
                        dependent: record.get("dependent"),
                        dependency: dependency
                    });
                });
            });
            this.state.validDependencies = validDependencies;
        });

        neo4jSession.run(this.state.dependenciesQuery).then(result => {
            result.records.forEach(record => {
                if (!this.dependencyIsValid(record)) {
                    dependencies.push({
                        id: record.get("dependent"),
                        dependency: record.get("dependency"),
                        isValid: false
                    });
                    this.appendDependency(
                        treeData,
                        record.get("dependent"),
                        record.get("dependency"),
                        record.get("dependentLayer"),
                        record.get("dependencyLayer"),
                        false
                    );
                } else {
                    dependencies.push({
                        id: record.get("dependent"),
                        dependency: record.get("dependency"),
                        isValid: true
                    });
                    this.appendDependency(
                        treeData,
                        record.get("dependent"),
                        record.get("dependency"),
                        record.get("dependentLayer"),
                        record.get("dependencyLayer"),
                        true
                    );
                }
            });
        });

        neo4jSession
            .run(this.state.layersQuery)
            .then(result => {
                result.records.forEach(record => {
                    if (
                        !this.nodeExists(
                            visualizationData,
                            record.get("package")
                        )
                    ) {
                        this.appendVisualizationNode(
                            visualizationData,
                            record.get("package"),
                            "",
                            COLORS.PACKAGE
                        );
                        this.appendTreeNode(
                            treeData,
                            record.get("package"),
                            ""
                        );
                    }
                    if (
                        !this.nodeExists(visualizationData, record.get("layer"))
                    ) {
                        this.appendVisualizationNode(
                            visualizationData,
                            record.get("layer"),
                            record.get("package"),
                            COLORS.LAYER
                        );
                        this.appendTreeNode(
                            treeData,
                            record.get("layer"),
                            record.get("package")
                        );
                    }
                    if (record.get("loc").low === 0) {
                        record.get("loc").low = 1;
                    }

                    if (
                        dependencies.filter(
                            node =>
                                node.id === record.get("child") && !node.isValid
                        ).length > 0 ||
                        dependencies.filter(
                            node =>
                                node.dependency === record.get("child") &&
                                !node.isValid
                        ).length > 0
                    ) {
                        this.appendLeafNode(
                            visualizationData,
                            record.get("child"),
                            record.get("layer"),
                            COLORS.INVALID_LEAF,
                            record.get("loc").low
                        );
                    } else {
                        this.appendLeafNode(
                            visualizationData,
                            record.get("child"),
                            record.get("layer"),
                            COLORS.VALID_LEAF,
                            record.get("loc").low
                        );
                    }
                });
            })
            .then(() => {
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
                this.convertDataForVisualization(visualizationRoot);
                this.convertDataForTree(treeRoot);
            })
            .then(() => {
                that.setState({
                    visualizationData: visualizationRoot,
                    treeData: treeRoot,
                    dependencies: dependencies
                });
            })
            .catch(e => {
                console.error(
                    "Something went wrong while initializing the given data.",
                    e
                );
            });
    }

    appendDependency(
        dataset,
        dependent,
        dependency,
        dependentLayer,
        dependencyLayer,
        isValid
    ) {
        dataset.push({
            id: dependent,
            dependency: dependency,
            parent: dependentLayer,
            dependencyLayer: dependencyLayer,
            isValid: isValid
        });
    }

    dependencyIsValid(record) {
        let isValid = false;
        this.state.validDependencies.forEach(validDependency => {
            if (
                record.get("dependentLayer") === validDependency.dependent &&
                record.get("dependencyLayer") === validDependency.dependency
            ) {
                isValid = true;
            }
        });
        return isValid;
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

    appendTreeNode(dataset, id, parent) {
        dataset.push({
            id: id,
            parent: parent
        });
    }

    appendVisualizationNode(dataset, id, parent, color) {
        dataset.push({
            id: id,
            parent: parent,
            color: color
        });
    }

    appendLeafNode(dataset, id, parent, color, loc) {
        dataset.push({
            id: id,
            parent: parent,
            color: color,
            loc: loc
        });
    }

    nodeExists(nodes, nodeId) {
        return nodes.some(node => node.id === nodeId);
    }
}

export default LayersModel;
