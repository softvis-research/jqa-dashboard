import React, { Component } from "react";
import * as d3 from "d3";

const url =
    "https://raw.githubusercontent.com/d3/d3-hierarchy/master/test/data/flare.json";

export default class CollapsibleIndentedTree extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.createVisualization();
    }

    createVisualization() {
        const nodeSize = 17;
        const width = 1100;

        d3.json(url).then(data => {
            let i = 0;
            const root = d3.hierarchy(data).eachBefore(d => (d.index = i++));
            const format = d3.format(",");

            const columns = [
                {
                    label: "Size",
                    value: d => d.value,
                    format,
                    x: 280
                },
                {
                    label: "Count",
                    value: d => (d.children ? 0 : 1),
                    format: (value, d) => (d.children ? format(value) : "-"),
                    x: 340
                }
            ];

            const nodes = root.descendants();

            const svg = d3
                .select(this.refs.vis)
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .style("overflow", "visible");

            const link = svg
                .append("g")
                .attr("fill", "none")
                .attr("stroke", "#999")
                .selectAll("path")
                .data(root.links())
                .join("path")
                .attr(
                    "d",
                    d => `
        M${d.source.depth * nodeSize},${d.source.index * nodeSize}
        V${d.target.index * nodeSize}
        h${nodeSize}
      `
                );

            const node = svg
                .append("g")
                .selectAll("g")
                .data(nodes)
                .join("g")
                .attr("transform", d => `translate(0,${d.index * nodeSize})`);

            node.append("circle")
                .attr("cx", d => d.depth * nodeSize)
                .attr("r", 2.5)
                .attr("fill", d => (d.children ? null : "#999"));

            node.append("text")
                .attr("dy", "0.32em")
                .attr("x", d => d.depth * nodeSize + 6)
                .text(d => d.data.name);

            node.append("title").text(d =>
                d
                    .ancestors()
                    .reverse()
                    .map(d => d.data.name)
                    .join("/")
            );

            for (const { label, value, format, x } of columns) {
                svg.append("text")
                    .attr("dy", "0.32em")
                    .attr("y", -nodeSize)
                    .attr("x", x)
                    .attr("text-anchor", "end")
                    .attr("font-weight", "bold")
                    .text(label);

                node.append("text")
                    .attr("dy", "0.32em")
                    .attr("x", x)
                    .attr("text-anchor", "end")
                    .attr("fill", d => (d.children ? null : "#555"))
                    .data(
                        root
                            .copy()
                            .sum(value)
                            .descendants()
                    )
                    .text(d => format(d.value, d));
            }
        });
    }

    render() {
        return (
            <svg
                ref="vis"
                width="1100"
                height="2000"
                viewBox="-10 850 980 50"
            ></svg>
        );
    }
}
