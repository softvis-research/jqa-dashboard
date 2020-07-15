import React, { Component } from "react";
import LayersVisualization from "./visualizations/LayersVisualization";

class DependencyArcWrapper extends Component {
    componentDidMount() {
        new LayersVisualization(this.refs.arc);
    }

    render() {
        return (
            <div className="visualization-wrapper">
                <div style={{ height: "2200px" }}>
                    <div ref="arc"></div>
                </div>
            </div>
        );
    }
}

export default DependencyArcWrapper;
