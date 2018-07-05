import * as d3 from "d3";

class CirclePackingHelper {

    circlePackingByName(projectName, flatData) {
        var hierarchicalData = [];
        var stratify = d3.stratify()
            .id(function (d) {
                return d.name;
            })
            .parentId(function (d) {
                if (d.name.lastIndexOf(".") !== -1) { // classes and subpackes
                    return d.name.substring(0, d.name.lastIndexOf("."));
                } else if (d.name !== projectName) { // a root package
                    return projectName;
                } else { // project name as root
                    return "";
                }
            });

        try {
            hierarchicalData = stratify(flatData);
        } catch (e) {
            // add projectname as root
            var root = {
                "name": projectName,
                "complexity": 0,
                "loc": 1, // at least 1 to make it visible
                "commits": 0,
                "level": 0,
                "role": "node"
            };
            flatData.push(root);
            hierarchicalData = stratify(flatData);
        }

        return hierarchicalData;
    }

    //TODO: merge both normalize... - functions

    //normalize recursively all childs (move information from .data to the element's root where nivo expects it)
    normalizeHotspots(hierarchicalData) {
        for (var i = 0; i < hierarchicalData.children.length; i++) {
            var lastDot = hierarchicalData.children[i].data.name.lastIndexOf(".");
            hierarchicalData.children[i].name = hierarchicalData.children[i].data.name.substring(lastDot + 1);
            hierarchicalData.children[i].loc = hierarchicalData.children[i].data.loc;
            hierarchicalData.children[i].complexity = hierarchicalData.children[i].data.complexity;
            if (hierarchicalData.children[i].children) {
                this.normalizeHotspots(hierarchicalData.children[i]);
            }
        }
    }

    circlePackingById(projectName, flatData, collectedNames) {
        var hierarchicalData = [];

        var stratify = d3.stratify()
            .id(function (d) {
                return d.id;
            })
            .parentId(function (d) {
                if (d.fqn) {
                    return collectedNames[d.fqn];
                }

                if (d.name.lastIndexOf(".") !== -1) { // classes and subpackes
                    return collectedNames[d.name.substring(0, d.name.lastIndexOf("."))];
                }

                if (d.name !== projectName) { // a root package
                    return collectedNames[projectName];
                } else { // project name as root
                    return undefined;
                }
            });

        // add projectname as root
        try {
            hierarchicalData = stratify(flatData);
        } catch (e) {
            var root = {
                "id": 0,
                "name": projectName,
                "coverage": -1,
                "loc": 0,
                "level": 0
            };
            flatData.push(root);
            collectedNames[projectName] = 0;
            hierarchicalData = stratify(flatData);
        }

        return hierarchicalData;
    }

    normalizeTestCoverage(hierarchicalData) {
        for (var i = 0; i < hierarchicalData.children.length; i++) {
            hierarchicalData.children[i].key = hierarchicalData.children[i].data.id;
            hierarchicalData.children[i].coverage = hierarchicalData.children[i].data.coverage;
            hierarchicalData.children[i].loc = hierarchicalData.children[i].data.loc;

            if (!hierarchicalData.children[i].data.fqn) {
                var lastDot = hierarchicalData.children[i].data.name.lastIndexOf(".");
                hierarchicalData.children[i].name = hierarchicalData.children[i].data.name.substring(lastDot + 1);
            } else {
                hierarchicalData.children[i].name = hierarchicalData.children[i].data.name;
            }

            if (hierarchicalData.children[i].children) {
                this.normalizeTestCoverage(hierarchicalData.children[i]);
            }
        }
    };

}

export default CirclePackingHelper;