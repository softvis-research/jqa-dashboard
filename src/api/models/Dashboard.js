import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";

class DashboardModel {
    readStructureMetrics(thisBackup) {
        var structureMetrics = [];

        neo4jSession
            .run(
                // architecture metrics (table 1)
                // number of classes
                "OPTIONAL MATCH (t:Type:Class)-[:HAS_SOURCE]->(:File) " +
                    "WITH count(t) as classes " +
                    // number of interfaces
                    "OPTIONAL MATCH (t:Type:Interface)-[:HAS_SOURCE]->(:File) " +
                    "WITH classes, count(t) as interfaces " +
                    // number of enums
                    "OPTIONAL MATCH (t:Type:Enum)-[:HAS_SOURCE]->(:File) " +
                    "WITH classes, interfaces, count(t) as enums " +
                    // number of annotations
                    "OPTIONAL MATCH (t:Type:Enum)-[:HAS_SOURCE]->(:File) " +
                    "WITH  classes, interfaces, enums, count(t) as annotations " +
                    // number of methods and lines of code
                    "OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[:DECLARES]->(m:Method) " +
                    "WITH classes, interfaces, enums, annotations, count(m) as methods, sum(m.effectiveLineCount) as loc " +
                    // number of fields
                    "OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[:DECLARES]->(f:Field) " +
                    "RETURN classes, interfaces, enums, annotations, methods, loc, count(f) as fields"
            )
            .then(function(result) {
                result.records.forEach(function(record) {
                    structureMetrics = {
                        classes: record.get(0).low,
                        interfaces: record.get(1).low,
                        enums: record.get(2).low,
                        annotations: record.get(3).low,
                        methods: record.get(4).low,
                        loc: record.get(5).low,
                        fields: record.get(6).low
                    };

                    //console.log(structureMetrics);
                });
            })
            .then(function(context) {
                thisBackup.setState({ structureMetrics: structureMetrics });
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    readDependencyMetrics(thisBackup) {
        var dependencyMetrics = [];

        neo4jSession
            .run(
                // relation metrics (table 2)
                // dependencies
                "OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[d:DEPENDS_ON]->(:Type) " +
                    "WITH count(d) as dependencies " +
                    // extends
                    "OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[e:EXTENDS]->(superType:Type) " +
                    'WHERE superType.name <> "Object" ' +
                    "WITH dependencies, count(e) as extends " +
                    // implements
                    "OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[i:IMPLEMENTS]->(:Type) " +
                    "WITH dependencies, extends, count(i) as implements " +
                    // calls
                    "OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[:DECLARES]->(m:Method)-[i:INVOKES]->(:Method) " +
                    "WITH dependencies, extends, implements, count(i) as invocations " +
                    // reads
                    "OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[:DECLARES]->(m:Method)-[r:READS]->(:Field) " +
                    "WITH dependencies, extends, implements, invocations, count(r) as reads " +
                    // writes
                    "OPTIONAL MATCH (t:Type)-[:HAS_SOURCE]->(:File), (t)-[:DECLARES]->(m:Method)-[w:WRITES]->(:Field) " +
                    "RETURN dependencies, extends, implements, invocations, reads, count(w) as writes"
            )
            .then(function(result) {
                result.records.forEach(function(record) {
                    dependencyMetrics = {
                        dependencies: record.get(0).low,
                        extends: record.get(1).low,
                        implements: record.get(2).low,
                        invocations: record.get(3).low,
                        reads: record.get(4).low,
                        writes: record.get(5).low
                    };

                    //console.log(dependencyMetrics);
                });
            })
            .then(function(context) {
                thisBackup.setState({ dependencyMetrics: dependencyMetrics });
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    readActivityMetrics(thisBackup) {
        var activityMetrics = [];

        neo4jSession
            .run(
                // activity metrics (table)
                // number of authors
                "OPTIONAL MATCH (a:Author) " +
                    "WITH count(a) as authors " +
                    // number of commits (without merges)
                    "OPTIONAL MATCH (c:Commit)-[:CONTAINS_CHANGE]->()-[:MODIFIES]->(f:File) " +
                    "WHERE NOT c:Merge " +
                    "WITH authors, count(c) as commitsWithoutMerges " +
                    // number of commits (including merges)
                    "OPTIONAL MATCH (c:Commit)-[:CONTAINS_CHANGE]->()-[:MODIFIES]->(f:File) " +
                    "RETURN authors, commitsWithoutMerges, count(c) as commitsWithMerges"
            )
            .then(function(result) {
                result.records.forEach(function(record) {
                    activityMetrics = {
                        authors: record.get(0).low,
                        commitsWithoutMerges: record.get(1).low,
                        commitsWithMerges: record.get(2).low
                    };

                    //console.log(activityMetrics);
                });
            })
            .then(function(context) {
                thisBackup.setState({ activityMetrics: activityMetrics });
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    readHotspotMetrics(thisBackup) {
        const IDENTIFIER_LIMIT_COUNTING_HOTSPOTS = "limitCountingHotspots";

        var localStorageLimitCountingHotspots = localStorage.getItem(
            IDENTIFIER_LIMIT_COUNTING_HOTSPOTS
        );
        var hotspotMetrics = [];

        neo4jSession
            .run(
                // number of commits
                "MATCH (c:Commit)-[:CONTAINS_CHANGE]->()-[:MODIFIES]->(f:File) WHERE NOT c:Merge WITH f, count(c) as commits MATCH (t:Type)-[:HAS_SOURCE]->(f), (t)-[:DECLARES]->(m:Method) RETURN t.fqn as fqn, sum(commits) as commits ORDER BY fqn ASCENDING"
            )
            .then(function(result) {
                var maxCommits = 0;

                result.records.forEach(function(record) {
                    var currentCommmits = record.get(1).low;

                    if (currentCommmits > maxCommits) {
                        maxCommits = currentCommmits;
                    }
                });

                var hotspotCount = 0;
                result.records.forEach(function(record) {
                    var currentCommmits = record.get(1).low;

                    if (
                        Math.round((currentCommmits / maxCommits) * 100) >=
                        localStorageLimitCountingHotspots
                    ) {
                        hotspotCount++;
                    }
                });

                hotspotMetrics = {
                    commitHotspots: hotspotCount
                };
            })
            .then(function(context) {
                thisBackup.setState({
                    hotspotMetrics: hotspotMetrics
                });
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    readStaticCodeAnalysisPMDMetrics(thisBackup) {
        var staticCodeAnalysisPMDMetrics = [];

        neo4jSession
            .run(
                // number of violations
                "MATCH (:Report)-[:HAS_FILE]->(file:File:Pmd)-[:HAS_VIOLATION]->(violation:Violation) RETURN count(violation)"
            )
            .then(function(result) {
                result.records.forEach(function(record) {
                    staticCodeAnalysisPMDMetrics = {
                        violations: record.get(0).low
                    };

                    //console.log(staticCodeAnalysisPMDMetrics);
                });
            })
            .then(function(context) {
                thisBackup.setState({
                    staticCodeAnalysisPMDMetrics: staticCodeAnalysisPMDMetrics
                });
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    readTestCoverageMetrics(thisBackup) {
        var testCoverageMetrics = [];

        neo4jSession
            .run(
                // number of violations
                "MATCH (c:Jacoco:Class)-[:HAS_METHOD]->(m:Method:Jacoco)-[:HAS_COUNTER]->(t:Counter) WHERE t.type='INSTRUCTION' RETURN (sum(t.covered)*100)/(sum(t.covered)+sum(t.missed)) as coverage"
            )
            .then(function(result) {
                result.records.forEach(function(record) {
                    testCoverageMetrics = {
                        overallTestCoverage: record.get(0).low
                    };

                    //console.log(testCoverageMetrics);
                });
            })
            .then(function(context) {
                thisBackup.setState({
                    testCoverageMetrics: testCoverageMetrics
                });
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}

export default DashboardModel;
