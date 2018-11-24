import $ from "jquery";
import { neo4jSession } from "../../views/Dashboard/AbstractDashboardComponent";

class CommitsTimescaleModel {
    constructor(props) {
        const commitsTimescaleQuery =
            "MATCH (a:Author)-[:COMMITTED]->(c:Commit)-[:CONTAINS_CHANGE]->()-[:MODIFIES]->(f:File), " +
            "(c)-[:OF_DAY]->(d)-[:OF_MONTH]->(m)-[:OF_YEAR]->(y) " +
            "WHERE NOT c:Merge " +
            "RETURN y.year as year, m.month as month, d.day as day, count(distinct c) as commits, count(f) as files " +
            "ORDER BY year, month, day";
        localStorage.setItem(
            "commits_timescale_original_query",
            commitsTimescaleQuery
        );

        this.state = {
            queryStringCommitsTimescale: commitsTimescaleQuery
        };

        if (!localStorage.getItem("commits_timescale_expert_query")) {
            localStorage.setItem(
                "commits_timescale_expert_query",
                this.state.queryStringCommitsTimescale
            );
        } else {
            this.state.queryStringCommitsTimescale = localStorage.getItem(
                "commits_timescale_expert_query"
            );
        }
    }

    readCommitsTimescale(thisBackup) {
        var aggregatedData = [];

        var minDate = new Date();
        var maxDate = new Date("1970-01-01");

        neo4jSession
            .run(this.state.queryStringCommitsTimescale)
            .then(function(result) {
                result.records.forEach(function(record) {
                    var dayString =
                        record.get(0) +
                        "-" +
                        record.get(1) +
                        "-" +
                        record.get(2);

                    var current = new Date(dayString);
                    if (current.getTime() < minDate.getTime()) {
                        minDate = current;
                    }
                    if (current.getTime() > maxDate.getTime()) {
                        maxDate = current;
                    }

                    var recordConverted = {
                        day: dayString,
                        value: record.get(3).low
                    };

                    aggregatedData.push(recordConverted);
                });
            })
            .then(function(context) {
                var strFrom =
                    minDate.getFullYear() +
                    "-" +
                    ("0" + (minDate.getMonth() + 1)).slice(-2) +
                    "-" +
                    ("0" + minDate.getDate().toString()).slice(-2);
                var strTo =
                    maxDate.getFullYear() +
                    "-" +
                    ("0" + (maxDate.getMonth() + 1)).slice(-2) +
                    "-" +
                    ("0" + maxDate.getDate().toString()).slice(-2);

                thisBackup.setState({
                    commitsTimescale: aggregatedData,
                    commitsFrom: strFrom,
                    commitsTo: strTo,
                    displayFrom: strFrom,
                    displayTo: strTo
                });
            })
            .then(function(context) {
                // clean daterangepicker in header
                $(".daterangepicker-placeholder").html("");
                // put daterangepicker into header
                $(".react-bootstrap-daterangepicker-container")
                    .detach()
                    .appendTo(".daterangepicker-placeholder");
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}

export default CommitsTimescaleModel;
