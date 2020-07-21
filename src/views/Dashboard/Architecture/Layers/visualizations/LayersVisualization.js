import React from "react";
import DashboardAbstract, {
    databaseCredentialsProvided
} from "../../../AbstractDashboardComponent";
import LayersModel from "../../../../../api/models/LayersModel";
import { Tree } from "react-d3-tree";

const url =
    "https://raw.githubusercontent.com/d3/d3-hierarchy/master/test/data/flare.json";

const styles = {};

class LayersVisualization extends DashboardAbstract {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }

    async componentDidMount() {
        await fetch(url)
            .then(res => res.json())
            .then(data => this.setState({ data: data }));
    }

    render() {
        if (this.state.data == null) {
            return <p>Loading...</p>;
        } else {
            return <Tree data={this.state.data} />;
        }
    }
}

export default LayersVisualization;
